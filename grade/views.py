from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from tk_rest import TKRest
import requests as rq
from random import randint


def grade(request):
  if request.session.has_key('login_success'):
    return render(request, "grade.html")
  else:
    return HttpResponseRedirect('/login')


def classroom_lms(request):
  r = TKRest('https://tk-lms.herokuapp.com/api')
  r = r.classrooms.get()
  data = r.json()
  return JsonResponse(data)


def savedb_classroom(request):
  r = TKRest('https://tk-lms.herokuapp.com/api')
  r = r.classrooms.get()
  raw_data = r.json()
  datas = raw_data['data']
  dummy_class_grade = {"data": []}

  members = []
  sessions = []

  for data in datas:
    numb_sessions = data['session']
    for i in range(numb_sessions):
      for member in data['members']:

        memb = {
            "member_id": member['_id'],
            "name": member['username'],
            "point": randint(0, 10)
        }
        members.append(memb)
      sessions.append(members)
      members = []

    classroom = {"classroom_id": data['_id'],
                 "grades": sessions}
    dummy_class_grade['data'].append(classroom)
    # members = []
    sessions = []
  return JsonResponse(dummy_class_grade)


def renderdb_classroom(request, classroom_id=None):
  
  r = rq.get('http://localhost:8000/database')
  raw_data = r.json()

  def getData(datas):
    dummy_class_grade = {"data": []}
    for data in datas:
      members = data['grades'][0]
      sessions = data['grades']
      for member in members:
        points = []
        for session in sessions:
          for memb in session:
            if member["member_id"] == memb["member_id"]:
              points.append(memb['point'])
          continue
        member['point'] = points

      classroom = {"classroom_id": data['classroom_id'],
                   "grades": members}

      dummy_class_grade['data'].append(classroom)
    return dummy_class_grade

  datas = raw_data['data']
  if classroom_id is None:
    dummy_class_grade = getData(datas)
  else:
    for data in datas:
      if data['classroom_id'] == classroom_id:
        datas = []
        datas.append(data)
        dummy_class_grade = getData(datas)
  
  return JsonResponse(dummy_class_grade)
        
 


# teacher = {
#   _id : "78678678",
#   "time" : {
#     start : 345345,
#     total : 5634543
#   }
# }

