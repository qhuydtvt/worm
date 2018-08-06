from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import LoginForm
import requests as req
from django.contrib import messages


def index(request):
  if request.method == 'POST':
    form = LoginForm(request.POST)
    if form.is_valid():
      data = {"username": form.cleaned_data['username'],
              "password": form.cleaned_data['password']}
      r = req.post('https://tk-lms.herokuapp.com/api/auth', data=data)

      if r.json()['success'] == 1:
        request.session['login_success'] = r.headers['Set-Cookie']
        return HttpResponseRedirect('/admin')
      else:
        messages.warning(request, 'Username or password incorrect!')
        return render(request, 'login.html', {"form": form})
  else:
    form = LoginForm()
    return render(request, 'login.html', {"form": form})
