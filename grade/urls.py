from django.urls import path
from . import views

urlpatterns = [path('', views.grade, name=''),
               path('summary', views.summary, name=''),
               path('api/classroom', views.classroom_lms, name=''),
               path('api/users', views.user_lms, name=''),
               path('api/log', views.api_grade_log, name=''),
               path('api/grades', views.api_grade, name='')]
