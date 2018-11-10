from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from services import lms
from .models import Grade, GradeLog, Attendance
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from addict import Dict
import datetime
from . import controller
from django.core.cache import cache
from django.core.mail import send_mail


def get_token(request):
  TOKEN = cache.get('access_token')
  if TOKEN is None:
    logout(request)
    return TOKEN
  else:
    headers = {"access_token": TOKEN}
    return headers


def get_classroom_lms(request):
  headers = get_token(request)
  lms.classroom.url += "?listAll=1"
  r = lms.classroom.get(headers=headers)
  data = r.json()
  lms.classroom.url = lms.reset_url_classroom
  return data


def classroom_lms(request):
  data = get_classroom_lms(request)
  return JsonResponse(data)


def get_user_lms(request):
  headers = get_token(request)
  lms.users.url += "?listAll=1"
  r = lms.users.get(headers=headers)
  data = r.json()
  teacher = []
  for user in data['data']['users']:
    if user['role'] == 1:
      teacher.append(user)
  lms.users.url = lms.reset_url_users
  return teacher


@login_required
def grade(request):
  return render(request, "grade.html")


@login_required
def summary(request):
  return render(request, "summary.html")


@csrf_exempt
def api_grade(request):
  if 'classroom_id' not in request.GET:
    try:
      teacher_id = request.session['teacher_id']
      return JsonResponse({'success': 0,
                           'message': '\'classroom_id\' not specified',
                           "role": teacher_id})
    except BaseException:
      return JsonResponse({'success': 0,
                           'message': '\'classroom_id\' not specified',
                           "role": 0})
  classroom_id = request.GET["classroom_id"]
  if 'access_token' in request.GET:
    token = request.GET["access_token"]
    headers = {"access_token": token}
  else:
    headers = get_token(request)
  if request.method == "GET":
    return api_grade_get(request, classroom_id, headers)
  elif request.method == "POST":
    return api_grade_post(request, classroom_id)


def api_grade_get(request, classroom_id, headers):
  classroom_r = lms.classroom.get(classroom_id, headers=headers)
  classroom_response = classroom_r.json()
  if 'data' not in classroom_response:
    return JsonResponse({"success": 0, "message": 'Could not find classroom', })
  classroom_data = Dict(classroom_response['data'])
  session = classroom_data.session
  classroom_data.time = "00:00:00"
  grades = Grade.objects.filter(classroom_id=classroom_id)
  grade_dict = {g.member_id: json.loads(g.grades) for g in grades}
  for member in classroom_data.members:
    attendance = Attendance.objects.filter(member__member_id=member._id)
    attendance_dict = {member._id: json.loads(att.attendances) for att in attendance}
    grades = grade_dict.get(member._id, [-1] * session)
    atten = attendance_dict.get(member._id, [-1] * session)
    if len(grades) < session or len(atten) < session:
      grades.extend([-1] * (session - len(grades)))
      atten.extend([-1] * (session - len(atten)))
    elif len(grades) > session or len(atten) > session:
      grades = grades[0:session]
      atten = atten[0:session]

    member.grades = grades
    member.attendance = atten
  return JsonResponse({"data": classroom_data, })


@transaction.atomic
def api_grade_post(request, classroom_id):
  grades_json = json.loads(request.body)
  for member in grades_json['members']:
    grade = Grade.objects.get_or_create(member_id=member['_id'], classroom_id=classroom_id)[0]
    grade.grades = [float(point) for point in member['grades']]
    grade.save()

  try:
    new_grade_log = GradeLog(teacher_id=request.session['teacher_id'],
                             classroom_id=classroom_id,
                             grade_time=grades_json['time'])
    new_grade_log.save()
    return JsonResponse({"success": 1, "message": "data saved"})
  except BaseException:
    return JsonResponse({"success": 0, "message": "session expired"})


@csrf_exempt
@transaction.atomic
def api_atten_post(request):
  if request.method == "POST":
    data = json.loads(request.body)
    member = Grade.objects.get_or_create(member_id=data["member_id"],
                                         classroom_id=data["classroom_id"])[0]
    new_atten = Attendance.objects.get_or_create(member=member)[0]
    new_atten.attendances = [int(atten) for atten in data['attendance']]
    new_atten.save()
    current_index = data["currentIndex"]
    if current_index > 0:
      if new_atten.attendances[current_index] == 0:
        if new_atten.attendances[current_index - 1] == 0 or new_atten.attendances[current_index - 1] == -1:
          fullname = data["member_fullname"]
          phone_number = data["member_phone"]
          link_fb = data["member_fb"]
          class_name = data["member_class"]
          days_off = (current_index, current_index + 1)
          send_gmail(fullname, class_name, phone_number, link_fb, days_off)

    return JsonResponse({"message": "data saved"})
  else:
    return JsonResponse({"message": "notthing to do here"})


def api_grade_log(request):
  start_time = request.GET['start_time']
  stop_time = request.GET['stop_time']
  start_time = datetime.datetime.strptime(start_time, "%Y-%m-%d")
  stop_time = datetime.datetime.strptime(stop_time, "%Y-%m-%d")
  day = stop_time - start_time
  time_plus = stop_time + datetime.timedelta(days=1)

  if request.user.is_authenticated:
    grade_log = GradeLog.objects.filter(grade_day__range=[start_time, time_plus])
    if len(grade_log) > 0:
      # teachers
      log = get_log(grade_log)
      teacher_time = controller.cal_teacher_time(log, day.days)
      teacher_info = get_user_lms(request)
      # classrooms
      classroom_time = controller.cal_classroom_time(log, day.days)
      class_info_response = get_classroom_lms(request)
      class_info = class_info_response["data"]['class']

      for index, user in enumerate(teacher_info):
        if user["_id"] in teacher_time:
          teacher_info[index]["time"] = teacher_time[user["_id"]]
        else:
          teacher_info[index]["time"] = None
      for index, classroom in enumerate(class_info):
        class_info[index].pop('teachers', None)
        class_info[index].pop('playlists', None)
        if classroom["_id"] in classroom_time:
          class_info[index]["time"] = classroom_time[classroom["_id"]]
        else:
          class_info[index]["time"] = None

      return JsonResponse({"total_days": day.days,
                           "teachers": teacher_info,
                           "classrooms": class_info,
                           })
    else:
      return JsonResponse({"success": 0, "message": 'Could not find logs', })

  else:
    return JsonResponse({"success": 0, "message:": "method not allowed"})


def get_log(grade_log):
  data = {}
  for log in grade_log:
    data_dict = {"classroom": log.classroom_id,
                 "teacher": log.teacher_id,
                 "time": log.grade_time,
                 "created_day": log.grade_day,
                 }
    if log.teacher_id not in data:
      data[log.teacher_id] = [data_dict]
    else:
      data[log.teacher_id].append(data_dict)
    if log.classroom_id not in data:
      data[log.classroom_id] = [data_dict]
    else:
      data[log.classroom_id].append(data_dict)
  return data


def send_gmail(fullname, class_name, phone_number, link_fb, days_off):
  send_mail('Thông báo học viên nghỉ học liên tiếp 2 buổi',
            f'''
            Học viên {fullname} lớp {class_name} đã nghỉ học buổi {days_off[0]} và {days_off[1]}.
            Contact:
            Số điện thoại: {phone_number}
            Link facebook: {link_fb}
            ''',
            'inform.techkidsvn@gmail.com', ['qc.techkidsvn@gmail.com']
            )
