from django.urls import path
from . import views

urlpatterns = [path('', views.grade, name=''),
               path('classroom', views.classroom_lms, name='')]