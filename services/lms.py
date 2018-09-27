from tk_rest import TKRest


api = TKRest("https://learn.techkids.vn/api")
classroom = api.classrooms
users = api.users
users.url = users.url + '?listAll=1'
classroom.url = classroom.url + '?listAll=1'
