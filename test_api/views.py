from django.shortcuts import render
from django.http import HttpResponseRedirect


def api(request):
  if request.session.has_key('login_success'):
    return render(request, "test-api.html")
  else:
    return HttpResponseRedirect('/login')
