from django.db import models
from django.utils import timezone
# Create your models here.


class Grade(models.Model):
  classroom_id = models.CharField(max_length=50)
  member_id = models.CharField(max_length=50)
  grades = models.CharField(max_length=100)

  def json(self):
    return {"classroom_id": self.classroom_id,
            "member_id": self.member_id,
            "grades": self.grades}


class GradeLog(models.Model):
  classroom_id = models.CharField(max_length=50)
  teacher_id = models.CharField(max_length=50)
  grade_day = models.DateTimeField(default=timezone.now)
  grade_time = models.CharField(max_length=50)

  def __str__(self):
    return str(self.grade_day)