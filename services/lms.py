from tk_rest import TKRest


api = TKRest("http://learn.techkids.vn/api/")
classroom = api.classrooms
users = api.users

reset_url_classroom = classroom.url
reset_url_users = users.url
