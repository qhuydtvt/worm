from django.db import models
from datetime import datetime
# Create your models here.


class Grade(models.Model):
  classroom_id = models.CharField(max_length=50)
  member_id = models.CharField(max_length=50)
  grades = models.CharField(max_length=100)

  def json(self):
    return {"classroom_id": self.classroom_id,
            "member_id": self.member_id,
            "grades": self.grades}


class Teacher(models.Model):
  teacher_id = models.CharField(max_length=50)
  grade_day = models.DateTimeField(default=datetime.now().date())
  grade_time = models.DateTimeField()