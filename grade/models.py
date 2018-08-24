from django.db import models

# Create your models here.


class Grade(models.Model):
  classroom_id = models.CharField(max_length=50)
  member_id = models.CharField(max_length=50)
  grades = models.CharField(max_length=100)

  def json(self):
    return {"classroom_id": self.classroom_id,
            "member_id": self.member_id,
            "grades": self.grades}          