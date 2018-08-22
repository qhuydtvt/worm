from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from services import lms
from .models import Grade
from django.views.decorators.csrf import csrf_exempt
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
  grades = Grade.objects.filter(classroom_id=classroom_id)
  if len(grades) == 0:
    return JsonResponse({"success": 0,
                         "grades": []})
  else:
    classroom_data = classroom_response['data']
    member_dict = {m['_id']: m for m in classroom_data['members']}
    for grade in grades:
      member_id = grade.member_id
      grade.member = member_dict.get(member_id, {"_id": member_id})

# return JsonResponse({'grades': [grade.json() for grade in grades]})
    return JsonResponse({'data': [{'member': grade.member,
                                   'grades': json.loads(grade.grades)}
                                  for grade in grades]})



def api_grade_post(request, classroom_id):
  grades_json = json.loads(request.body)
  print(grades_json)
  return JsonResponse({"data": classroom_id})
