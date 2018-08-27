from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import LoginForm
from django.contrib import messages
from tk_rest import TKRest


def index(request):
  if request.method == 'POST':
    form = LoginForm(request.POST)
    if form.is_valid():
      data = {"username": form.cleaned_data['username'],
              "password": form.cleaned_data['password']}
      r = TKRest('https://tk-lms.herokuapp.com/api')
      r = r.auth.post(data)

      if r.json()['success'] == 1:
        request.session['login_success'] = r.headers['Set-Cookie']
        request.session['teacher_id'] = r.json()['data']['id']
        return HttpResponseRedirect('/')
      else:
        messages.warning(request, 'Username or password incorrect!')
        return render(request, 'login.html', {"form": form})
  else:
    form = LoginForm()
    return render(request, 'login.html', {"form": form})


def logout(request):
  try:
        del request.session['login_success']
  except BaseException:
        pass
  return HttpResponseRedirect('/')
