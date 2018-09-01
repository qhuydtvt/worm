from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from services import lms
from .models import Grade, Teacher
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json


def classroom_lms(request):
  r = lms.classroom.get()
  data = r.json()
  return JsonResponse(data)


def grade(request):
  if request.session.has_key('login_success'):
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
    return JsonResponse({
        'success': 0,
        'message': 'Could not find classroom'})
  # return JsonResponse(classroom_response)
  classroom_data = classroom_response['data']
  grades = Grade.objects.filter(classroom_id=classroom_id)
  if len(grades) == 0:
    grades = save_data(classroom_id, classroom_data)
  
  member_dict = {m['_id']: m for m in classroom_data['members']}
  for grade in grades:
    member_id = grade.member_id
    grade.member = member_dict.get(member_id, {"_id": member_id})

# return JsonResponse({'grades': [grade.json() for grade in grades]})
  return JsonResponse({'data': [{'member': grade.member,
                                  'grades': json.loads(grade.grades)}
                                for grade in grades]})


def save_data(classroom_id, classroom_data):
  list_grades = []
  classroom_grades = []
  for member in classroom_data["members"]:
    for _ in range(classroom_data["session"]):
      list_grades.append(-1)
    str_grades = str(list_grades)
    new_grade = Grade(classroom_id=classroom_id,
                      member_id=member["_id"],
                      grades=str_grades)
    new_grade.save()
    classroom_grades.append(new_grade)
    list_grades = []
  return classroom_grades

@transaction.atomic
def api_grade_post(request, classroom_id):
  grades_json = json.loads(request.body)
  for member in grades_json['data']['member']:
    member_update = Grade.objects.get(member_id=member['_id'])
    grades = []
    [grades.append(float(point)) for point in member['grades']]
    member_update.grades = grades
    member_update.save()

  for teacher in grades_json['data']['teacher']:
    teacher_update = Teacher(teacher_id=request.session['teacher_id'],
                             grade_time=teacher['time'])
    teacher_update.save()

  return JsonResponse({"data": classroom_id})
