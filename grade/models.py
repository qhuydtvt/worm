from django.db import models

# Create your models here.


class Grade(models.Model):
  classroom_id = models.CharField(max_length=50)
  member_id = models.CharField(max_length=50)
  grades = models.CharField(max_length=100)
