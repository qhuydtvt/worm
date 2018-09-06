from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm
from django.contrib import messages
from tk_rest import TKRest


def index(request):
  if request.method == 'POST':
    form = LoginForm(request.POST)
    if form.is_valid():
      username = form.cleaned_data["username"]
      password = form.cleaned_data["password"]

      data = {"username": username,
              "password": password}
      r = TKRest('https://learn.techkids.vn/api/')
      r = r.auth.post(data)

      if r.json()['success'] == 1:
        try:
          request.session['teacher_id'] = r.json()['data']['id']
          user = User.objects.get(username=username, password=password)
          login(request, user)
          return HttpResponseRedirect('/')
        except BaseException:
          user = User.objects.create_user(username=username, password=password)
          login(request, user)
          return HttpResponseRedirect('/')
      else:
        messages.warning(request, 'Username or password incorrect!')
        return render(request, 'login.html', {"form": form})
  else:
    form = LoginForm()
    return render(request, 'login.html', {"form": form})


def logout_view(request):
  logout(request)
  return HttpResponseRedirect('/')
