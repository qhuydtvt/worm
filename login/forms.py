from django import forms


class LoginForm(forms.Form):
  username = forms.CharField(widget=forms.TextInput(attrs={"class": "mnb",
                                                           "placeholder": "username"}))
  password = forms.CharField(widget=forms.PasswordInput(attrs={"class": "mnb",
                                                               "placeholder": "password"}))