from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from tk_rest import TKRest


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
    print(numb_sessions)
    # print(data['members'])
    for member in data['members']:
      # print(member)
      memb = {
          "_id": member['_id'],
          "name": member['username'],
          "point": 8
      }
      members.append(memb)
    
    for i in range(numb_sessions):
      sessions.append(members)

    classroom = {"classroom_id": data['_id'],
                 "grades": sessions}
    dummy_class_grade['data'].append(classroom)
    members = []
    sessions = []
  return JsonResponse(dummy_class_grade)



# teacher = {
#   _id : "78678678",
#   "time" : {
#     start : 345345,
#     total : 5634543
#   }
# }

