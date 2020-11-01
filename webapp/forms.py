from django.forms import ModelForm
from django import forms
from .models import Student
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True,  widget= forms.EmailInput
                           (attrs={'placeholder':'Enter email address', 'class': 'input100', 'readonly': 'readonly'}))
    first_name = forms.CharField(max_length=30,  widget= forms.TextInput
                           (attrs={'placeholder':'Enter first name', 'class': 'input100'}))
    last_name = forms.CharField(max_length=30,  widget= forms.TextInput
                           (attrs={'placeholder':'Enter last name', 'class': 'input100'}))
    password1 = forms.CharField(widget= forms.PasswordInput
                           (attrs={'placeholder':'Enter  password', 'class': 'input100'}))
    password2 = forms.CharField(widget= forms.PasswordInput
                           (attrs={'placeholder':'Re-Enter password', 'class': 'input100'}))                      

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.is_active = False
        user.username = user.email
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']

        if commit:
            user.save()
        return user    


class   StudentForm(ModelForm):
    class Meta:
        model = Student
        fields = ('time_zn',) 

