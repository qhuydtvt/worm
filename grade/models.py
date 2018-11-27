from django.db import models
from django.utils import timezone
# Create your models here.


class Grade(models.Model):
  classroom_id = models.CharField(max_length=50)
  member_id = models.CharField(max_length=50)
  grades = models.CharField(max_length=258, default="[-1]")

  def json(self):
    return {"classroom_id": self.classroom_id,
            "member_id": self.member_id,
            "grades": self.grades}


class Attendance(models.Model):
  member = models.ForeignKey(Grade, on_delete=models.CASCADE)
  attendances = models.CharField(max_length=258)

  def __str__(self):
    return str(self.member)

  def json(self):
    return {"member": self.member,
            "attendances": self.attendances}


class GradeLog(models.Model):
  classroom_id = models.CharField(max_length=500)
  teacher_id = models.CharField(max_length=50)
  grade_day = models.DateTimeField(default=timezone.now)
  grade_time = models.CharField(max_length=50)

  def __str__(self):
    return str(self.grade_day)
