from django.shortcuts import render
from googletrans import Translator
from bing_image_urls import bing_image_urls
from urllib.parse import unquote
from GoogleNews import GoogleNews
import random
import wikipedia
import urllib.request
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import numpy as np
import re
import requests
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.edit import FormView
from dal import autocomplete
from django.core.exceptions import ObjectDoesNotExist
from webapp.models import NewsEntertainment, NewsEntertainmentLevel, NewsTechnology, NewsTechnologyLevel, News, NewsLevel, CareerRoles,Course, Student, StudentCourse, Teacher, TeacherCourse, CourseLevel, StudentCourseVideoBookings
import json
from django.utils.timezone import make_aware
import datetime, pytz
import dateutil.parser
from django.db.models import Q
from django.conf import settings
import stripe # new
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import views as auth_views
from django.urls import reverse
from .utils import token_generator
from django.shortcuts import redirect
from .forms import StudentForm, ExtendedUserCreationForm
from django.contrib.auth.models import User
import socket
from dateutil.relativedelta import *
import threading

stripe.api_key = settings.STRIPE_SECRET_KEY # new
HOSTNAME = settings.APP_HOST_NAME



def get_context_data(self, **kwargs): # new
    context = super().get_context_data(**kwargs)
    context['key'] = settings.STRIPE_PUBLISHABLE_KEY
    return context

def charge(request): # new
    if request.method == 'POST':
        try:
            charge = stripe.Charge.create(
                amount=1300,
                currency='cad',
                description='A Django charge',
                source=request.POST['stripeToken']
            )
        except Exception as e:
            return render(request, 'webapp/stripe_err.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
    tz = Student.objects.get(email=request.session['email']).time_zn
    d_aware = datetime.datetime.strptime(request.session['datetimeval'], '%Y-%m-%dT%H:%M').astimezone(pytz.timezone(tz))
    student_obj = Student.objects.get(email=request.session['email'])
    course_obj= Course.objects.get(name=request.session['course'])
    assignCourse = StudentCourse.objects.create(student=student_obj, course=course_obj, level=request.session['level'], status="P", date_joined=d_aware, teacher=None)
    assignCourse.save()
    #Sening email
    
    email_subject = 'Teklrn Course Booked Alert'
    email_body = 'Hello '+request.session["name"]+', \n\n You have booked \n\nCourse: '+request.session["course"]+'\n\nLevel: '+request.session["level"]+'\n\n You will be notified once the Booking is accepted by a trainer. \n\n Thanks And Regards, \n Teklrn Backend Team'
    email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [student_obj.email],
            )
    email_test.send(fail_silently=False)
    return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'technology' : request.session['course']})
   
def chargevideo(request): # new
    if request.method == 'POST':
        try:
            charge = stripe.Charge.create(
                amount=300,
                currency='cad',
                description='A Django charge',
                source=request.POST['stripeToken']
            )
        except Exception as e:
            return render(request, 'webapp/stripe_err.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
    student_obj = Student.objects.get(email=request.session['email'])
    course_obj= Course.objects.get(name=request.session['course'])
    assignVideoAccess = StudentCourseVideoBookings.objects.create(student=student_obj, course=course_obj, level=request.session['level'], videoPresent=True)
    assignVideoAccess.save()
    #Sening email
    
    email_subject = 'Teklrn Course Video Booked Alert'
    email_body = 'Hello '+request.session["name"]+', \n\n You have booked \n\nCourse: '+request.session["course"]+'\n\nLevel: '+request.session["level"]+' Video Tutorial'+'\n\n You will get access to the video if it exists now, if not in two working days. \n\n Thanks And Regards, \n Teklrn Backend Team'
    email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [student_obj.email],
            )
    email_test.send(fail_silently=False)
    return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'technology' : request.session['course']})


def about(request):
    return render(request, 'webapp/about.html')

def RedirectToLandingStudentView(request):
    return  HttpResponseRedirect(HOSTNAME+'?GFTfgTRFghHGfdjkJHGVCDSdnHHHH')


def registerBack(request):
    ret = '?technology='+request.session['course']
    return  HttpResponseRedirect(HOSTNAME+ret)

def register(request):
    if request.method == 'POST':
        user_time_zone  = request.session.get('user_time_zone', None)
        form = ExtendedUserCreationForm(request.POST)
        #student_form = StudentForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password1')
            user_obj = form.save()
            freegeoip_response = requests.get('http://ip-api.com/json/')
            freegeoip_response_json = freegeoip_response.json()
            user_time_zone = freegeoip_response_json['timezone']
            student = Student.objects.create(user=user_obj, time_zn=user_time_zone, email=username)
            student.save()
            domain = get_current_site(request).domain        
            uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
            link=reverse('activate', kwargs={
                     'uidb64': uidb64, 'token': token_generator.make_token(user_obj)})
            activate_url = 'http://'+domain+link
            email_subject = 'Teklrn Account Activation'
            email_body = 'Hello '+user_obj.first_name+ ', \nPlease use this link to verify your Teklrn Student Account\n' + activate_url
            email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [user_obj.email],
            )
            email_test.send(fail_silently=False)
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologinA')
    else:
        form = ExtendedUserCreationForm()
        form.fields["email"].initial = request.session['email']

    context = {'form' : form}
    return render(request, 'webapp/register.html', context)



def user_profile(request):
    if request.method == 'POST':    
            u = User.objects.get(username=request.user.email)
            name = request.POST['name']
            u.first_name = name
            u.save()
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologin')
    return render(request, 'webapp/userProfile.html')

    
def upload_course(request):
    if request.method == 'POST':    
            t = Teacher.objects.get(email=request.user.email)
            phone = request.POST['phone']
            t.phone = phone
            t.save()
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologinT')
    return render(request, 'webapp/uploadCourse.html')



def user_profile_t(request):
    if request.method == 'POST':    
            t = Teacher.objects.get(email=request.user.email)
            phone = request.POST['phone']
            t.phone = phone
            t.save()
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologinT')
    return render(request, 'webapp/userProfileT.html')

def register_t(request):
    if request.method == 'POST':
        user_time_zone  = request.session.get('user_time_zone', None)
        form = ExtendedUserCreationForm(request.POST)
        #student_form = StudentForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password1')
            course_name =  request.POST['course-register-t']
           # meeting_link = request.POST['meeting-link-register-t']
            meeting_link = 'https://us04web.zoom.us/j/3181485588?pwd=RU1ENGg4aHB6ZzhWWTBDOGIremEwQT09'
            phone = request.POST['phone']
          #  dob = request.POST['start']
            dob = '2001-01-01'
            course_obj = Course.objects.get(name=course_name)
            user_obj = form.save()
            freegeoip_response = requests.get('http://ip-api.com/json/')
            freegeoip_response_json = freegeoip_response.json()
            user_time_zone = freegeoip_response_json['timezone']
            teacher = Teacher.objects.create(user=user_obj, time_zn=user_time_zone, email=username, meetingLink=meeting_link, dob = dob, phone = phone)
            teacher.save()
            teacherCourse = TeacherCourse.objects.create(teacher=teacher, course=course_obj)
            teacherCourse.save()
            domain = get_current_site(request).domain        
            uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
            link=reverse('activateT', kwargs={
                     'uidb64': uidb64, 'token': token_generator.make_token(user_obj)})
            activate_url = 'http://'+domain+link
            email_subject = 'Teklrn Account Activation'
            email_body = 'Hello '+user_obj.first_name+ ', \nPlease use this link to verify your Teklrn Trainer Account\n' + activate_url
            email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [user_obj.email],
            )
            email_test.send(fail_silently=False)
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologinTA')
    else:
        form = ExtendedUserCreationForm()
        form.fields["email"].initial = request.session['email']

    list_technology = Course.objects.all()
    context = {'form' : form, 'list_technology' : list_technology}
    return render(request, 'webapp/registerT.html', context)

def login_page(request):
    return render(request, 'webapp/login.html', {'course': request.session['course']})

def upload_complete(request):
    return render(request, 'webapp/upload_complete.html')       
    
def login_teacher_authorize(request):
    return render(request, 'webapp/login_t_auth.html')    
    

def login_page_t(request):
    return render(request, 'webapp/loginT.html')

def login_page_t_a(request):
    return render(request, 'webapp/loginTActivate.html')

def login_page_a(request):
    return render(request, 'webapp/loginActivate.html')

def contact(request):
    return render(request, 'webapp/contact.html')
    
def worldNews(request):
    page = 'webapp/worldnews_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})

def entertainmentNews(request):
    page = 'webapp/entertainmentnews_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def entertainmentnews(request):    
    page = 'webapp/entertainmentnews.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = NewsEntertainment.objects.get(name=data.get("technology"))
        except:
            try:
                c = NewsEntertainment.objects.filter(name__icontains=data.get("technology")[0:12])[0]
            except:
                c = NewsEntertainment.objects.filter(name__icontains=data.get("technology")[0:4])[0]

        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.name
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    # url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # # opening the url for reading
    # html = urllib.request.urlopen(url)
    # # parsing the html file
    # htmlParse = BeautifulSoup(html, 'html.parser')
    # htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # # getting all the paragraphs
    # txt = ''
    # for para in htmlParse.find_all("p"):
    #     txt += str(para)
    # soup = BeautifulSoup(txt, features="lxml")
    # data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':''})



def technologyNews(request):
    page = 'webapp/technologynews_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def newsPre(request):
    page = 'webapp/news_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def hiPre(request):
    page = 'webapp/hi_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def technologyread(request):
    page = 'webapp/technologymainpage.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    cname = unquote(data.get("heading"))
    n = NewsTechnology.objects.get(name=cname)
    cl = NewsTechnologyLevel.objects.filter(description__icontains=data.get("description"), news=n)[0]
    return render(request, page, {'description':cl.description.split('!@#')[0], 'heading':cl.description.split('!@#')[1], 'technologyVal':data.get("heading"), 'url':cl.imageLink})

def entertainmentread(request):
    page = 'webapp/entertainmentmainpage.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    cname = unquote(data.get("heading"))
    n = NewsEntertainment.objects.get(name=cname)
    cl = NewsEntertainmentLevel.objects.filter(description__icontains=data.get("description"), news=n)[0]
    return render(request, page, {'description':cl.description.split('!@#')[0], 'heading':cl.description.split('!@#')[1], 'technologyVal':data.get("heading"), 'url':cl.imageLink})


def trendingread(request):
    page = 'webapp/trendingmainpage.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    cname = unquote(data.get("heading"))
    n = News.objects.get(name=cname)
    cl = NewsLevel.objects.filter(description__icontains=data.get("description"), news=n)[0]
    return render(request, page, {'description':cl.description.split('!@#')[0], 'heading':cl.description.split('!@#')[1], 'technologyVal':data.get("heading"), 'url':cl.imageLink})


def newsread(request):
    page = 'webapp/newsmainpage.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    req = Request(data.get("url"), headers={'User-Agent': 'Mozilla/5.0'})
    html = urlopen(req)    
    #html = urllib.request.urlopen(data.get("url"), headers=hdr)
    # parsing the html file
    htmlParse = BeautifulSoup(html, 'html.parser')
    txt = ''
    for para in htmlParse.find_all("p"):
        txt += ' '+str(para)
    soup = BeautifulSoup(txt, features="lxml")
    dataValue = re.sub("[\[].*?[\]]", "", soup.get_text())
    return render(request, page, {'description':dataValue, 'heading':data.get("heading"), 'technologyVal':data.get("technology"), 'url':data.get("imgLink")})

def info(request):
    page = 'webapp/info.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = Course.objects.get(description=data.get("technology"))
        except:
            c = Course.objects.get(name=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.description
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # opening the url for reading
    html = urllib.request.urlopen(url)
    # parsing the html file
    htmlParse = BeautifulSoup(html, 'html.parser')
    htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # getting all the paragraphs
    txt = ''
    for para in htmlParse.find_all("p"):
        txt += str(para)
    soup = BeautifulSoup(txt, features="lxml")
    data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("wikipedia", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':data})

def technologynews(request):
    page = 'webapp/technologynews.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = NewsTechnology.objects.get(name=data.get("technology"))
        except:
            try:
                c = NewsTechnology.objects.filter(name__icontains=data.get("technology")[0:12])[0]
            except:
                c = NewsTechnology.objects.filter(name__icontains=data.get("technology")[0:4])[0]

        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.name
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    # url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # # opening the url for reading
    # html = urllib.request.urlopen(url)
    # # parsing the html file
    # htmlParse = BeautifulSoup(html, 'html.parser')
    # htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # # getting all the paragraphs
    # txt = ''
    # for para in htmlParse.find_all("p"):
    #     txt += str(para)
    # soup = BeautifulSoup(txt, features="lxml")
    # data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':''})


def trendingnews(request):
    page = 'webapp/trendingnews.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = News.objects.get(name=data.get("technology"))
        except:
            try:
                c = News.objects.filter(name__icontains=data.get("technology")[0:12])[0]
            except:
                c = News.objects.filter(name__icontains=data.get("technology")[0:4])[0]

        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.name
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    # url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # # opening the url for reading
    # html = urllib.request.urlopen(url)
    # # parsing the html file
    # htmlParse = BeautifulSoup(html, 'html.parser')
    # htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # # getting all the paragraphs
    # txt = ''
    # for para in htmlParse.find_all("p"):
    #     txt += str(para)
    # soup = BeautifulSoup(txt, features="lxml")
    # data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':''})


def news(request):
    page = 'webapp/news.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = Course.objects.get(description=data.get("technology"))
            defaultTechnology = c.name
            contentType = c.contentType
            request.session['contentType'] = c.contentType
            technology_description = c.description
        except:
            try:
                c = Course.objects.get(name=data.get("technology"))
                defaultTechnology = c.name
                contentType = c.contentType
                request.session['contentType'] = c.contentType
                technology_description = c.description
            except:
                defaultTechnology = data.get("technology")
                contentType = data.get("technology")
                request.session['contentType'] = data.get("technology")
                technology_description = data.get("technology")

       
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    #url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # opening the url for reading
    #html = urllib.request.urlopen(url)
    # parsing the html file
    #htmlParse = BeautifulSoup(html, 'html.parser')
    #htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # getting all the paragraphs
    #txt = ''
    # for para in htmlParse.find_all("p"):
    #     txt += str(para)
    # soup = BeautifulSoup(txt, features="lxml")
    # data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology,'Code':data.get('Code'), 'technology_desc':technology_description, 'data':''})



def hi(request):
    page = 'webapp/hi.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = Course.objects.get(description=data.get("technology"))
        except:
            c = Course.objects.get(name=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.description
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # opening the url for reading
    html = urllib.request.urlopen(url)
    # parsing the html file
    htmlParse = BeautifulSoup(html, 'html.parser')
    htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # getting all the paragraphs
    txt = ''
    for para in htmlParse.find_all("p"):
        txt += str(para)
    soup = BeautifulSoup(txt, features="lxml")
    data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, data:data})

def gotToTechnology(request):
    page = 'webapp/hi.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("technology"):
        try:
            c = Course.objects.get(description=data.get("technology"))
        except:
            c = Course.objects.get(name=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
        request.session['contentType'] = c.contentType
        technology_description = c.description
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    #data_file = open('assets/text/'+defaultTechnology+'_text.txt', 'r')       
    #data = data_file.read()
    url = "https://en.wikipedia.org/wiki/"+(wikipedia.search(technology_description)[0]).replace(" ", "_")
    # opening the url for reading
    html = urllib.request.urlopen(url)
    # parsing the html file
    htmlParse = BeautifulSoup(html, 'html.parser')
    htmlParse = htmlParse.find("div", {"class": "mw-parser-output"})
    # getting all the paragraphs
    txt = ''
    for para in htmlParse.find_all("p"):
        txt += str(para)
    soup = BeautifulSoup(txt, features="lxml")
    data = re.sub("[\[].*?[\]]", "", soup.get_text()).replace("Wikipedia", "Teklrn Inc.").replace("Wiki", "Teklrn Inc. ").replace("wikipedia", "Teklrn Inc.").replace("wiki", "Teklrn Inc.")
  
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':data})


def test(request):
    page = 'webapp/test.html' 
    data = request.GET
    return render(request, page, {'lvl':'2', 'technology_desc':'Hi'})

def privacy(request):
    return render(request, 'webapp/privacy.html')

def refund(request):
    return render(request, 'webapp/refund.html')

def terms(request):
    return render(request, 'webapp/terms.html')

def help(request):
    return render(request, 'webapp/help.html')    

def press(request):
    return render(request, 'webapp/press.html')

def teach(request):
    return render(request, 'webapp/teach.html')

def business(request):
    return render(request, 'webapp/business.html')

def careers(request):
    return render(request, 'webapp/careers.html')

def home(request):
    return render(request, 'webapp/home.html')

class SupportedDesignationsView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        technology = data.get("search_string") 
        results = []
        designations = Course.objects.get(name=technology).careerroles_set.all()
        for designation in designations:
            designation_json = {}
            designation_json['designation'] = designation.name
            results.append(designation_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class TechnologyNewsForNews(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        news = data.get("search_string")
        if news:
            try:
                c = NewsTechnology.objects.get(name=news)
            except:
                try:
                    c = NewsTechnology.objects.filter(name__icontains=news[0:12])[0]
                except:
                    c = NewsTechnology.objects.filter(name__icontains=news[0:4])[0]
        results = []
        newsLevels = NewsTechnologyLevel.objects.filter(news=c)
        for entry in newsLevels:
            course_json = {}
            course_json['title'] = news
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class EntertainmentNewsForNews(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        news = data.get("search_string")
        if news:
            try:
                c = NewsEntertainment.objects.get(name=news)
            except:
                try:
                    c = NewsEntertainment.objects.filter(name__icontains=news[0:12])[0]
                except:
                    c = NewsEntertainment.objects.filter(name__icontains=news[0:4])[0]
        results = []
        newsLevels = NewsEntertainmentLevel.objects.filter(news=c)
        for entry in newsLevels:
            course_json = {}
            course_json['title'] = news
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class TrendingNewsForNews(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        news = data.get("search_string")
        if news:
            try:
                c = News.objects.get(name=news)
            except:
                try:
                    c = News.objects.filter(name__icontains=news[0:12])[0]
                except:
                    c = News.objects.filter(name__icontains=news[0:4])[0]
        results = []
        newsLevels = NewsLevel.objects.filter(news=c)
        for entry in newsLevels:
            course_json = {}
            course_json['title'] = news
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)



class TechnologiesMatchingTheDesignationView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        designation = data.get("search_string")
        results = []
        technologies = CareerRoles.objects.get(name=designation).courses.all()
        for technology in technologies:
            course_json = {}
            course_json['description'] = technology.description
            course_json['technology'] = technology.name
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class TechnologiesMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        codeC = data.get("search_string")  
        our_url = "https://newsapi.org/v2/top-headlines?country="+codeC+"&apiKey=10f27a32c3224f959563a9964bbd70db"
        data = requests.get(our_url).json()
        for item in data['articles']:
            course_json = {}
            course_json['technology'] = str(item['urlToImage']) 
            course_json['description'] = item['title'].split(' - ')[0].replace("'", "").replace("‘", "").replace("’", "")
            course_json['contentType'] = 'POLITICS'
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class TechnologiesMatchingTheSearchView(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  Course.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['technology'] = tech.name
                    course_json['description'] = tech.description
                    if tech.contentType == 'Tech':
                        cate = 'TECHNOLOGY'
                    elif tech.contentType == 'Edu':
                        cate = 'EDUCATIONAL'
                    elif tech.contentType == 'Pol':
                        cate = 'POLITICS'
                    elif tech.contentType == 'Eco':
                        cate = 'ECONOMY'

                    course_json['contentType'] = cate
                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = Course.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['technology'] = technology.name
                course_json['description'] = technology.description
                if technology.contentType == 'Tech':
                        cate = 'TECHNOLOGY'
                elif technology.contentType == 'Edu':
                        cate = 'EDUCATIONAL'
                elif technology.contentType == 'Pol':
                        cate = 'POLITICS'
                elif technology.contentType == 'Eco':
                        cate = 'ECONOMY'

                course_json['contentType'] = cate
                #course_json['videoLink'] = CourseLevel.objects.get(course=technology, level_number=1).videoLink
                   
                results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class TechnologiesMatchingTheSearchViewFiltered(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  Course.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['technology'] = tech.name
                    course_json['description'] = tech.description
                    if tech.contentType == 'Tech':
                        cate = 'TECHNOLOGY'
                    elif tech.contentType == 'Edu':
                        cate = 'EDUCATIONAL'
                    elif tech.contentType == 'Pol':
                        cate = 'POLITICS'
                    elif tech.contentType == 'Eco':
                        cate = 'ECONOMY'

                    course_json['contentType'] = cate
                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = Course.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['technology'] = technology.name
                course_json['description'] = technology.description
                if technology.contentType == 'Tech':
                        cate = 'TECHNOLOGY'
                elif technology.contentType == 'Edu':
                        cate = 'EDUCATIONAL'
                elif technology.contentType == 'Pol':
                        cate = 'POLITICS'
                elif technology.contentType == 'Eco':
                        cate = 'ECONOMY'

                course_json['contentType'] = cate
                #course_json['videoLink'] = CourseLevel.objects.get(course=technology, level_number=1).videoLink
                   
                results.append(course_json)
        data = json.dumps(results[-35:])
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class EntertainmentNewsMatchingTheSearchView(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  NewsEntertainment.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = NewsEntertainment.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)  

class TechnologyNewsMatchingTheSearchView(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  NewsTechnology.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = NewsTechnology.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)        

class TechnologyNewsMatchingTheSearchViewFiltered(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  NewsTechnology.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = NewsTechnology.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results[-35:])
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)           

class EntertainmentNewsMatchingTheSearchViewFiltered(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  NewsEntertainment.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = NewsEntertainment.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results[-35:])
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)    

class NewsMatchingTheSearchView(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  News.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = News.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class NewsMatchingTheSearchViewFiltered(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            courses =  News.objects.filter(name__icontains=technology).order_by("-id")
            if courses:
                for tech in courses:
                    course_json = {}
                    course_json['name'] = tech.name
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:

            technologies = News.objects.all().order_by("-id")
            for technology in technologies:
                course_json = {}
                course_json['name'] = technology.name
                course_json['category'] = technology.category
                course_json['contentType'] = technology.contentType
                course_json['imageLink'] = technology.imageLink
                #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results[-35:])
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
    
class AutoCompleteSearchTopicsView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        temp = Course.objects.get(name=c.capitalize())
        if topic:
            courses = CourseLevel.objects.filter(description__icontains=topic, course=temp )  
            if not courses:
                 courses = CourseLevel.objects.filter(course=temp)         
        else:
            courses = CourseLevel.objects.filter(course=temp)   
            results = []
        for course in courses:
            course_json = {}
            course_json['level'] = course.level_number
            course_json['value'] = course.description
            course_json['rating'] = course.rating
            course_json['reviewCount'] = course.reviewCount
            course_json['videoFree'] = course.videoFree
            course_json['videolink'] = course.videoLink
            
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

        
class AutoCompleteSearchTopicsViewNewTechnology(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        #temp = Course.objects.get(name=c.capitalize()).description
        # temp = c
        # googlenews = GoogleNews(lang='en  ', period='1d')
        # googlenews.search(temp)
        # alldata = googlenews.results(sort=True)
        cname = unquote(c)
        n = NewsTechnology.objects.get(name=cname)
        cl = NewsTechnologyLevel.objects.filter(news=n)
        for entry in cl:
            course_json = {}
            course_json['title'] = cname
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
   
class AutoCompleteSearchTopicsViewNewEntertainment(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        #temp = Course.objects.get(name=c.capitalize()).description
        # temp = c
        # googlenews = GoogleNews(lang='en  ', period='1d')
        # googlenews.search(temp)
        # alldata = googlenews.results(sort=True)
        cname = unquote(c)
        n = NewsEntertainment.objects.get(name=cname)
        cl = NewsEntertainmentLevel.objects.filter(news=n)
        for entry in cl:
            course_json = {}
            course_json['title'] = cname
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class AutoCompleteSearchTopicsViewNewTrending(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        #temp = Course.objects.get(name=c.capitalize()).description
        # temp = c
        # googlenews = GoogleNews(lang='en  ', period='1d')
        # googlenews.search(temp)
        # alldata = googlenews.results(sort=True)
        cname = unquote(c)
        n = News.objects.get(name=cname)
        cl = NewsLevel.objects.filter(news=n)
        for entry in cl:
            course_json = {}
            course_json['title'] = cname
            course_json['heading'] = entry.description.split('!@#')[1]
            course_json['description'] = entry.description.split('!@#')[0]
            course_json['link'] = entry.imageLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
   
class AutoCompleteSearchTopicsViewNewNews(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        langg = data.get("lang")
        #temp = Course.objects.get(name=c.capitalize()).description
        temp=unquote(c)
        googlenews = GoogleNews(lang=langg, period='1d')
        googlenews.search(temp)
        alldata = googlenews.results(sort=True)
        translator = Translator()
        NonEnglish = False
        if langg not in ('us', 'gb', 'nz', 'au', 'ca'):
            NonEnglish = True   
        if NonEnglish: 
            for entry in alldata:
                course_json = {}
                
                course_json['description'] = entry["desc"].replace('\'', '')
                course_json['link'] = entry["link"]
                titles = entry["title"]
                course_json['title'] = titles
                titles = translator.translate(titles, dest="en").text
                                    
                try:
                    course_json['imgLink'] =  bing_image_urls(titles, limit=1)[0]
                except:
                    course_json['imgLink'] =  ''

                results.append(course_json)
        else:
            for entry in alldata:
                course_json = {}
                
                course_json['description'] = entry["desc"].replace('\'', '')
                course_json['link'] = entry["link"]
                titles = entry["title"].replace('\'', '')
                course_json['title'] = titles
                    
                try:
                    course_json['imgLink'] =  bing_image_urls(titles, limit=1)[0]
                except:
                    course_json['imgLink'] =  ''

                results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class AutoCompleteSearchTopicsViewNew(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get("keyword_data")   
        c = data.get("course_name")
        temp = Course.objects.get(name=c.capitalize())
        if topic:
            courses = CourseLevel.objects.filter(description__icontains=topic, course=temp )  
            if not courses:
                 courses = CourseLevel.objects.filter(course=temp)         
        else:
            courses = CourseLevel.objects.filter(course=temp)   
            results = []
        for course in courses:
            course_json = {}
            course_json['level'] = course.level_number
            course_json['value'] = course.description
            course_json['rating'] = course.rating
            course_json['reviewCount'] = course.reviewCount
            course_json['videoFree'] = course.videoFree
            course_json['videolink'] = course.videoLink
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class AutoCompleteView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        courseName = data.get("term").strip() 
        courses = []
        if courseName:
            for cr in courseName.split():
                courses += Course.objects.filter(description__icontains=cr)
                courses.reverse()
        else:
            courses = Course.objects.all()
            results = []
        for course in courses:
            course_json = {}
            course_json['levels'] = course.levels
            course_json['value'] = course.description
            course_json['name'] = course.name
            course_json['description'] = course.description
            course_json['contentType'] = course.contentType
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class ChargeAccepted(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        data = request.GET
        email_id = data.get("email")
        if email_id:
            students = Student.objects.filter(email__iexact=email_id)           
        else:
            students = []
            results = []
        
        for student in students:
            student_json = {}
            student_json['email'] = student.email
            student_json['name'] = student.name
            results.append(student_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)



class CheckUserExistsView(FormView):
    
    def get(self,request,*args,**kwargs):
        data = request.GET
        email_id = data.get("email")
        student = None
        if email_id:
            try:
               student = Student.objects.get(email=email_id) 
            except ObjectDoesNotExist:
               student = None
             
        if student:
            request.session['email']=email_id
            return HttpResponseRedirect(HOSTNAME+'login')
        try:
            teacher = Teacher.objects.get(email=email_id)
        except ObjectDoesNotExist:
            teacher = None
        if teacher:
            return HttpResponseRedirect(HOSTNAME+'loginForm')
        # render(request, page, {'email': request.session['email']})
        request.session['email']=email_id
        return HttpResponseRedirect(HOSTNAME+'register')


def logout_view(request): 
        logout(request)    
        defaultTechnology='Tensorflow'        
        return render(request, "webapp/hi_pre_landing.html", {'technology':defaultTechnology, 'technology_desc':defaultTechnology})

def logout_t_view(request): 
        logout(request)   
        defaultTechnology='Tensorflow'            
        return render(request, "webapp/hi_pre_landing.html", {'technology':defaultTechnology, 'technology_desc':defaultTechnology})

class CheckTeacherExistsView(FormView):
  
    def get(self,request,*args,**kwargs):
        data = request.GET
        email_id = data.get("email")
        request.session['email'] = email_id
        if email_id:
            try:
               teacher = Teacher.objects.get(email=email_id) 
            except ObjectDoesNotExist:
               teacher = None
             
        if teacher:
            request.session['email']=email_id
            return HttpResponseRedirect(HOSTNAME+'loginT')
        # render(request, page, {'email': request.session['email']})
        try:
            student = Student.objects.get(email=email_id)
        except ObjectDoesNotExist:
            student = None
        if student:
            return HttpResponseRedirect(HOSTNAME+'loginFormT')
        return HttpResponseRedirect(HOSTNAME+'registerT')



class LoginViewForVideoAccess(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        course_name = data.get("course_name")
        course_level = data.get("course_level") 
        course_description = data.get("course_description")
        request.session['description']=course_description
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        request.session['level']=course_level
        request.session['action']='Video'
        if request.user.is_authenticated:
            tz = Student.objects.get(email=request.user.email).time_zn
            now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(days=10)
            dt = now.strftime('%Y-%m-%dT%H:%M')        
            max_v = now + relativedelta(months=2)
            dt_max = max_v.strftime('%Y-%m-%dT%H:%M')
            return render(request, "webapp/bookVideo.html", {'course_name':  course_name, 'course_level': course_level})
        return render(request, "webapp/email.html", {'name':  'name', 'course': course_name, 'level': course_level, 'action':'video'})
   



class LoginView(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        course_name = data.get("course_name")
        course_level = data.get("course_level")
        course_description = data.get("course_description")
        request.session['description']=course_description
        request.session['course']=course_name
        request.session['level']=course_level        
        request.session['action']='Trainer'
        if request.user.is_authenticated:
            tz = Student.objects.get(email=request.user.email).time_zn
            now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(days=10)
            dt = now.strftime('%Y-%m-%dT%H:%M')        
            max_v = now + relativedelta(months=2)
            dt_max = max_v.strftime('%Y-%m-%dT%H:%M')            
            request.session['contentType'] = Course.objects.get(name=course_name).contentType
            return render(request, "webapp/bookCourse.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : dt_max, 'tz': tz })
        return render(request, "webapp/email.html", {'name':  'name', 'course': course_name, 'level': course_level })

class LoginTView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/emailT.html", {'name':  'name'})

        
class BookCourseFormView(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        course_name = data.get("course")
        course_description = data.get("course_description")
        request.session['description']=course_description
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        course_level = data.get("level")
        tz = Student.objects.get(email=request.user.email).time_zn
        now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(days=10)
        dt = now.strftime('%Y-%m-%dT%H:%M')        
        max_v = now + relativedelta(months=2)
        dt_max = max_v.strftime('%Y-%m-%dT%H:%M')
        return render(request, "webapp/bookCourse.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : dt_max, 'tz': tz })

class LoginTeacherView(FormView):    
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        teacher = Teacher.objects.get(email=email_id)
        page = "webapp/loginT.html"
        if teacher is not None and teacher.is_teklrn_authorized:
            user = authenticate(request, username = email_id, password = pwd)
            if user is not None:
                login(request, user)
                page="webapp/hi_login_t.html"               
                name = teacher.user.first_name
                request.session['name']=name
                request.session['email']=email_id
                request.session['technology'] = 'Tensorflow'
            else:
                request.session['name']=None
                request.session['email']=email_id
        return render(request, page, {'email': request.session['email'], 'technology':  request.session['technology'], 'contentType': 'Tech'})
    def get(self,request,*args,**kwargs):
        page = "webapp/loginT.html"
        if(request.user.is_authenticated):
           page="webapp/hi_login_t.html"  
        return render(request, page)
        


class LoginStudentView(FormView):
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        student = Student.objects.get(email=email_id)
        page = "webapp/login.html"
        if student is not None:
            user = authenticate(request, username = email_id, password = pwd)
            if user is not None:
                login(request, user)
                if(request.session['course'] is not None and request.session['level'] is not None):
                    course_name = request.session['course']
                    course_level = request.session['level']
                    tz = Student.objects.get(email=user.email).time_zn
                    now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(days=10)
                    dt = now.strftime('%Y-%m-%dT%H:%M')
                    max_v = now + relativedelta(months=2)
                    dt_max = max_v.strftime('%Y-%m-%dT%H:%M')
                    if(request.session['action']=='Video'):
                        return render(request, "webapp/bookVideo.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : dt_max, 'tz': tz })
                             
                    return render(request, "webapp/bookCourse.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : dt_max, 'tz': tz })
                else:
                    page="webapp/hi_pre_landing.html"     
                    if(request.session['course'] is None):
                        request.session['course'] = 'Tensorflow'
                        request.session['description'] = 'Tensorflow' 
                request.session['contentType'] = Course.objects.get(name= request.session['course']).contentType                     
                name = student.user.first_name
                email_id = student.user.username
                request.session['name']=name
                request.session['email']=email_id
            else:
                request.session['name']=None
                request.session['email']=email_id
        return render(request, page, {'email': request.session['email'], 'name': request.session['name'], 'technology':request.session['course'], 'technology_desc':request.session['description'], 'contentType':request.session['contentType']})
    def get(self,request,*args,**kwargs):
        page = "webapp/login.html"
        if(request.user.is_authenticated):
           page="webapp/hi_pre_landing.html"  
        return render(request, page)
    

class ResetStudentPwdView(FormView):
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        page="webapp/login.html"
        student = Student.objects.get(email=email_id)   
        student.password = pwd
        student.save()
        return render(request, page)
        
class ResetTrainerPwdView(FormView):
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        page="webapp/loginT.html"
        teacher = Teacher.objects.get(email=email_id)   
        teacher.password = pwd
        teacher.save()
        return render(request, page)   

class ActivateTrainerView(FormView):
    def get(self,request,uidb64,token):
        try:
            uid=force_text(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None
        if user is not None and token_generator.check_token(user, token):
            user.is_active=True
            user.save()
            request.session['email'] = user.email
            email_subject = 'Teklrn Trainer Registered Alert'
            email_body = 'Teklrn Backend Team, \nPlease verify and authorize the User Registered as Trainer\n'+ 'User Email : '+user.email
            email_test = EmailMessage(  
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                ['teklrn@yahoo.com',],
            )
            email_test.send(fail_silently=False)
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologinT')
        return HttpResponseRedirect(HOSTNAME+'?toerrorT')

class ActivateStudentView(FormView):
    def get(self,request,uidb64,token):
        try:
            uid=force_text(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None
        if user is not None and token_generator.check_token(user, token):
            user.is_active=True
            user.save()
            request.session['email'] = user.email
            return  HttpResponseRedirect(HOSTNAME+'?redirecttologin')
        return HttpResponseRedirect(HOSTNAME+'?toerror')

class RegisterStudentView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        if 'course' not in request.POST:
          course_name = "Java"
        else:
          course_name = request.POST['course']
          course_description = request.post['course_description']
        if 'level' not in request.POST:
          course_level = "1"
        else:
          course_level = request.POST['level']
        tz_info = request.POST['tz_info']
        student_name = request.POST['name']
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        student =  Student.objects.create(name=student_name, email=email_id,password=pwd, time_zn = tz_info)
        student.save()
        domain = get_current_site(request).domain        
        uidb64 = urlsafe_base64_encode(force_bytes(student.pk))
        link=reverse('activate', kwargs={
                     'uidb64': uidb64, 'token': token_generator.make_token(student)})
        activate_url = 'http://'+domain+link
        email_subject = 'Teklrn Account Activation'
        email_body = 'Hello '+student.name+ ', \nPlease use this link to verify your Teklrn Student Account\n' + activate_url
        email_test = EmailMessage(
            email_subject,
            email_body,
            'teklrn.inc@gmail.com',
            [student.email],
        )
        email_test.send(fail_silently=False)
        request.session['name']=student_name
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        request.session['description'] = course_description
        request.session['level']=course_level
        request.session['email']=email_id
        request.session['password']=pwd
        return render(request, "webapp/hi_login.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})

class LandingBackView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/hi.html", {'name': 'name'})

class LandingBackLoginView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/hi_login.html", {'name': 'name', 'technology' : request.session['course'], 'technology_desc':request.session['description']})       

class ResetPasswordView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/resetPassword.html", {'name': 'name'})
        
class ResetPasswordTView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/resetPasswordT.html", {'name': 'name'})  

class RegisterTeacherView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        teacher_name = request.POST['name']
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        course_name =  request.POST['course']
        course_description = request.POST['course_description']
        meeting_link = request.POST['meetingLink']
        tz_info = request.POST['tz_info']
        phone = request.POST['phone']
        dob = request.POST['start']
        course_obj = Course.objects.get(name=course_name)
        teacher =  Teacher.objects.create(name=teacher_name, email=email_id,password=pwd, meetingLink=meeting_link, time_zn = tz_info, phone = phone, dob = dob)
        teacher.save()
        teacherCourse = TeacherCourse.objects.create(teacher=teacher, course=course_obj)
        teacherCourse.save()
        request.session['name']=teacher_name
        request.session['email']=email_id
        request.session['password']=pwd
        request.session['description']=course_description
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        request.session['meetingLink']=meeting_link
        return render(request, "webapp/hi_login_t.html", {'name': request.session['name'], 'email': request.session['email'], 'password': request.session['password'], 'course': request.session['course']})


class BookVideoView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        course_name = request.POST['course']
        course_level = request.POST['level']
        course_description = request.POST['course_description']
        request.session['name']=request.user.first_name
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        request.session['level']=course_level
        request.session['description']=course_description
        return render(request, "webapp/buyVideo.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email']})


class BookCourseView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        course_description = request.POST['course_description']
        course_name = request.POST['course']
        course_level = request.POST['level']
        request.session['datetimeval']=request.POST['datetimeval']
        request.session['name']=request.user.first_name
        request.session['course']=course_name
        request.session['contentType'] = Course.objects.get(name=course_name).contentType
        request.session['level']=course_level
        request.session['description'] = course_description
        return render(request, "webapp/buy.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email']})

class MostSoughTechView(FormView):
    def get(self,request,*args,**kwargs):
        d = request.GET
        course = d.get("course")
        associated_techs = Course.objects.exclude(name=course.capitalize()) 
        results = []
        
        for associated_tech in associated_techs:
         if associated_tech.name != course:
            associated_tech_json = {}
            associated_tech_json['name'] = associated_tech.name
            associated_tech_json['description'] = associated_tech.description
            results.append(associated_tech_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class AssociatedTechView(FormView):
    def get(self,request,*args,**kwargs):
        d = request.GET
        course = d.get("course").capitalize()
        designations = Course.objects.get(name=course).careerroles_set.all()
        results = []
        for designation in designations:
            technologies = CareerRoles.objects.get(name=designation).courses.all()
            for technology in technologies:
                associated_tech_json = {}
                associated_tech_json['description'] = technology.description
                associated_tech_json['name'] = technology.name
                results.append(associated_tech_json)
        seen = set()
        new_l = []
        for d in results:
            t = tuple(d.items())
            if t not in seen:
                seen.add(t)
                new_l.append(d)

        data = json.dumps(new_l)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)



class TeacherPickCourseView(FormView):
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='P')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            tz = pytz.timezone(Teacher.objects.get(email=t_email).time_zn)
            my_ct = studCourse_obj.date_joined.astimezone(tz)
            new_ct = my_ct.strftime('%c')
            studCourse_json['date'] = new_ct
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class TeacherBookCourseView(FormView):
    def get(self,request,*args,**kwargs):
        pk= request.GET['pk']
        studCourse_obj=StudentCourse.objects.get(id=pk)
        teacher_email=request.session['email']
        teacher_obj = Teacher.objects.get(email=teacher_email)
        studCourse_obj.status='A'
        studCourse_obj.save()
        studCourse_obj.teacher=teacher_obj
        studCourse_obj.save()
        email_subject = 'Teklrn Trainer Assigned'
        email_body = 'Hello, \n \nTrainer Assigned to your course Booking. \n\nKindly login to your Teklrn Account to get more information. \n\n Thanks And Regards, \n Teklrn Backend Team'
        email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [studCourse_obj.student.email],
            )
        email_test.send(fail_silently=False)

        email_subject = 'Teklrn Booking Accepted'
        email_body = 'Hello, \n\n You have Accepted the Booking on Teklrn. \n\nKindly review the Syllabus and prepare before starting the Session. \n\n It is mandatory to guide the Trainee to mark the Course Complete on his Screen. \n\nUnless Trainee marks the course completed the Payment will be blocked. \n\n Thanks And Regards, \n Teklrn Backend Team'
        email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [teacher_obj.email],
            )
        email_test.send(fail_silently=False)
        return render(request, "webapp/hi_login_t.html" )


class MarkCourseCompletionView(FormView):
    def get(self,request,*args,**kwargs):
        pk= request.GET['pk']
        studCourse_obj=StudentCourse.objects.get(id=pk)
        studCourse_obj.status='C'
        studCourse_obj.save()
        return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
   
        """return HttpResponse(None, mimetype)"""

class TeacherGivenTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']

        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='C', teacher=(Teacher.objects.get(email=t_email)))
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name            
            tz = pytz.timezone(Teacher.objects.get(email=t_email).time_zn)
            my_ct = studCourse_obj.date_joined.astimezone(tz)
            new_ct = my_ct.strftime('%c')
            studCourse_json['date'] = new_ct
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class TeacherInProgressTrainingsView(FormView):
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='I')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            studCourse_json['date'] = studCourse_obj.date_joined.isoformat()
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'   
        return HttpResponse(data, mimetype)

class TeacherPendingTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='A', teacher=(Teacher.objects.get(email=t_email)))
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            tz = pytz.timezone(Teacher.objects.get(email=t_email).time_zn)
            my_ct = studCourse_obj.date_joined.astimezone(tz)
            new_ct = my_ct.strftime('%c')
            studCourse_json['date'] = new_ct
            studCourse_json['meetingLink'] = Teacher.objects.get(email=t_email).meetingLink
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class PendingStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        student_email = request.user.email
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=student_email)), status='P')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            tz = pytz.timezone(Student.objects.get(email=student_email).time_zn)
            my_ct = studCourse_obj.date_joined.astimezone(tz)
            new_ct = my_ct.strftime('%c')
            studCourse_json['date'] = new_ct
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class AcceptedStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        student_email = request.user.email
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=student_email)), status='A')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            tz = pytz.timezone(Student.objects.get(email=student_email).time_zn)
            my_ct = studCourse_obj.date_joined.astimezone(tz)
            new_ct = my_ct.strftime('%c')
            studCourse_json['date'] = new_ct
            studCourse_json['meetingLink'] = studCourse_obj.teacher.meetingLink
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class InprogressStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=t_email)), status='I')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            studCourse_json['date'] = studCourse_obj.date_joined.astimezone(tz).isoformat()
            studCourse_json['meetingLink'] = studCourse_obj.teacher.meetingLink
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
        
class CompletedStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        student_email = request.user.email
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=student_email)), status='C')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            tz = pytz.timezone(Student.objects.get(email=student_email).time_zn)
            my_ct = studCourse_obj.date_joined
            new_ct = my_ct.strftime('%c ')
            studCourse_json['date'] = new_ct
            studCourse_json['meetingLink'] = studCourse_obj.teacher.meetingLink
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
