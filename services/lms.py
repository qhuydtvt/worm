from tk_rest import TKRest


api = TKRest("https://tk-lms.herokuapp.com/api")
classroom = api.classrooms
users = api.users

reset_url_classroom = classroom.url
reset_url_users = users.url
