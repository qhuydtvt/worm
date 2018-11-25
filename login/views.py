from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from .forms import LoginForm
from django.contrib import messages
from tk_rest import TKRest
from django.core.cache import cache


def index(request):
  if request.method == 'POST':
    form = LoginForm(request.POST)
    if form.is_valid():
      username = form.cleaned_data["username"]
      password = form.cleaned_data["password"]

      data = {"username": username,
              "password": password}
      r = TKRest('http://learn.techkids.vn/api')
      r = r.auth.post(data)

      if r.json()['success'] == 1:
        if r.json()['data']['user']['role'] in (2, 3):
          print(r.json()['data']['user']['role'])
          request.session['teacher_id'] = r.json()['data']['user']['id']
          request.session["TOKEN"] = r.json()['data']['access_token']
          user, create = User.objects.get_or_create(username=username,
                                                    password=password,
                                                    is_staff=True)
          login(request, user)
          return HttpResponseRedirect('/worm/')
        else:
          messages.warning(request, 'Your account does not have permission to access!')
          return render(request, 'login.html', {"form": form})
      else:
        messages.warning(request, 'Username or password incorrect!')
        return render(request, 'login.html', {"form": form})
  else:
    form = LoginForm()
    return render(request, 'login.html', {"form": form})


def logout_view(request):
  logout(request)
  cache.delete('access_token')
  return HttpResponseRedirect('/worm/')
