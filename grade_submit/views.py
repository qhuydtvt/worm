from django.shortcuts import render

# Create your views here.


def grade_submit(request):
  return render(request, 'grade.html')
