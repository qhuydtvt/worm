from django.urls import path
from . import views


urlpatterns = [path('', views.grade_submit, name='')]