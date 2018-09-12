from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from services import lms
from .models import Grade, GradeLog
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from addict import Dict


def classroom_lms(request):
  r = lms.classroom.get()
  data = r.json()
  return JsonResponse(data)


@login_required
def grade(request):
    return render(request, "grade.html")


@csrf_exempt
def api_grade(request):
  if request.user.is_authenticated:
    if 'classroom_id' not in request.GET:
      return JsonResponse({'success': 0,
                          'message': '\'classroom_id\' not specified'})
    classroom_id = request.GET["classroom_id"]
    if request.method == "GET":
      return api_grade_get(request, classroom_id)
    elif request.method == "POST":
      return api_grade_post(request, classroom_id)
  else:
    return JsonResponse({"success": 0, "message:": "method not allowed"})


def api_grade_get(request, classroom_id):
  classroom_response = lms.classroom.get(classroom_id).json()
  if 'data' not in classroom_response:
    return JsonResponse({"success": 0, "message": 'Could not find classroom',})
  classroom_data = Dict(classroom_response['data'])
  session = classroom_data.session
  classroom_data.time = "00:00:00"
  grades = Grade.objects.filter(classroom_id=classroom_id)
  grade_dict = {g.member_id: json.loads(g.grades) for g in grades}
  for member in classroom_data.members:
    grades = grade_dict.get(member._id, [-1] * session)
    if len(grades) < session:
      grades.extend([-1] * (session - len(grades)))
    elif len(grades) > session:
      grades = grades[0:session]
    member.grades = grades
  return JsonResponse({"data": classroom_data})


@transaction.atomic
def api_grade_post(request, classroom_id):
  grades_json = json.loads(request.body)
  print(grades_json)
  for member in grades_json['members']:
    grade = Grade.objects.get_or_create(member_id=member['_id'], classroom_id=classroom_id)[0]
    grade.grades = [float(point) for point in member['grades']]
    print(grade)
    # grade.save()

  grade_log = grades_json['teachers']
  new_grade_log = GradeLog(teacher_id=request.session['teacher_id'],
                            classroom_id=classroom_id,
                            grade_time=grades_json['time'])
  new_grade_log.save()
  return JsonResponse({"success": 1, "message": "data saved"})
  


def api_grade_log(request):
  if request.user.is_authenticated:
    grade_log = GradeLog.objects.filter(classroom_id="5b8521c829a0640c61e476e0")  #test in one class
    data = [{"class": log.classroom_id,
             "teacher_id": log.teacher_id,
             "time": log.grade_time,
             } for log in grade_log]
    return JsonResponse({"data": data})
  else:
    return JsonResponse({"success": 0, "message:": "method not allowed"})
