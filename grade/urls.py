from django.urls import path
from . import views

urlpatterns = [path('', views.grade, name=''),
               path('api/classroom', views.classroom_lms, name=''),
               path('api/grades', views.api_grade, name='')]
