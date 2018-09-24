from django.urls import path
from . import views

app_name = 'grade'

urlpatterns = [path('', views.grade, name='grade'),
               path('summary', views.summary, name='summary'),
               path('api/classroom', views.classroom_lms, name=''),
               path('api/log', views.api_grade_log, name=''),
               path('api/grades', views.api_grade, name='')]
