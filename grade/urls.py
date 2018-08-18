from django.urls import path
from . import views

urlpatterns = [path('', views.grade, name=''),
              #  path('classroom', views.classroom_lms, name=''),
              #  path('database', views.savedb_classroom, name=''),
              #  path('grades', views.renderdb_classroom, name=''),
               path('api/grades', views.api_grade, name='')]
