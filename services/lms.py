from tk_rest import TKRest

list_all = '?listAll=1'
classrooms = 'classrooms' + list_all
users = 'users' + list_all

api = TKRest("https://learn.techkids.vn/api/")
classroom = api.classrooms
users = api.users
