from django.contrib import admin
from .models import Grade, GradeLog, Attendance
# Register your models here.

admin.site.register(Grade)
admin.site.register(GradeLog)
admin.site.register(Attendance)