from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from services import lms
from .models import Grade, Teacher
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from addict import Dict


def classroom_lms(request):
  r = lms.classroom.get()
  data = r.json()
  return JsonResponse(data)


def grade(request):
  if 'login_success' in request.session:
    return render(request, "grade.html")
  else:
    return HttpResponseRedirect('/login')


@csrf_exempt
def api_grade(request):
  if 'classroom_id' not in request.GET:
    return JsonResponse({'success': 0,
                        'message': '\'classroom_id\' not specified'})
  classroom_id = request.GET["classroom_id"]
  if request.method == "GET":
    return api_grade_get(request, classroom_id)
  elif request.method == "POST":
    return api_grade_post(request, classroom_id)


def api_grade_get(request, classroom_id):
  classroom_response = lms.classroom.get(classroom_id).json()
  if 'data' not in classroom_response:
    return JsonResponse({ "success": 0, "message": 'Could not find classroom', })
  classroom_data = Dict(classroom_response['data'])
  session = classroom_data.session
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
  for member in grades_json['data']['members']:
    grade = Grade.objects.get_or_create(member_id=member['_id'], classroom_id=classroom_id)[0]
    grade.grades = [float(point) for point in member['grades']]
    grade.save()

  # for teacher in grades_json['data']['teachers']:
  #   teacher_update = Teacher(teacher_id=request.session['teacher_id'],
  #                            grade_time=teacher['time'])
  #   teacher_update.save()

  return JsonResponse({"data": classroom_id})
