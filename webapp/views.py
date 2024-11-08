from django.shortcuts import render
from googletrans import Translator
from bing_image_urls import bing_image_urls
from string import digits
from urllib.parse import unquote
from GoogleNews import GoogleNews
import random
import wikipedia
import urllib.request
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import re
import requests
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.edit import FormView
from django.core.exceptions import ObjectDoesNotExist
from webapp.models import RandomTechNews, FinancialRelatedNews, RelatedNews,UrlLink,Books,StudentAds, Country, Language, NewsFinancial, NewsEntertainment, NewsLinks, AllNewsLinks, NewsSearchUrls, NewsEntertainment, NewsEntertainmentLevel, NewsTechnology, NewsTechnologyLevel, News, NewsLevel, CareerRoles,Course, Student, StudentCourse, Teacher, TeacherCourse, CourseLevel, StudentCourseVideoBookings, Person, DailyNewsVideos, PersonVideoLinks
import json
import datetime, pytz
from django.conf import settings
import stripe # new
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from .utils import token_generator
from .forms import ExtendedUserCreationForm
from django.contrib.auth.models import User
from dateutil.relativedelta import *

stripe.api_key = settings.STRIPE_SECRET_KEY # new
#HOSTNAME = settings.APP_HOST_NAME
HOSTNAME = 'https://www.teklrn.com/'



def get_context_data(self, **kwargs): # new
    context = super().get_context_data(**kwargs)
    context['key'] = settings.STRIPE_PUBLISHABLE_KEY
    return context

def charge(request): # new
    if request.method == 'POST':
        s = Student.objects.get(email=request.user.email)
        if 'auto_pay' in request.POST:
            try:
                charge = stripe.Charge.create(
                    amount=1300*(request.session['count']),
                    currency='cad',
                    description='A Django charge',
                    customer=s.cust_id
                )
            except Exception as e:
                return render(request, 'webapp/stripe_err.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
            s.advertisement_count = s.advertisement_count+request.session['count']
            request.session['advertisement_count'] = s.advertisement_count
            s.save()
        
            all_files = request.session['upd_file'].split('----')
            for fl in all_files:
                student_ads =  StudentAds(student=s, ad_name=fl, payed=True)
                student_ads.save()
            del request.session['upd_file']
            return render(request, 'webapp/businessdashboard.html', {'name': request.user.first_name})
            
        use_default=False
        try:
            if not s.one_click:
                customer = stripe.Customer.create(
                    email=request.user.email,
                    source=request.POST['stripeToken']
                )
                s.cust_id=customer['id']
                s.one_click=True
                s.save()
            else:
                stripe.Customer.create_source(
                    s.cust_id,
                    source=request.POST['stripeToken']
                )
            if not use_default:
                charge = stripe.Charge.create(
                amount=1300*(request.session['count']),
                currency='cad',
                description='A Django charge',
                customer=s.cust_id
            )
            else:
                charge = stripe.Charge.create(
                    amount=1300*(request.session['count']),
                    currency='cad',
                    description='A Django charge',
                    source=request.POST['stripeToken']
                )
        except Exception as e:
            return render(request, 'webapp/stripe_err.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
        s.advertisement_count = s.advertisement_count+request.session['count']
        request.session['advertisement_count'] = s.advertisement_count
        s.save()
        
        all_files = request.session['upd_file'].split('----')
        for fl in all_files:
            student_ads =  StudentAds(student=s, ad_name=fl, payed=True)
            student_ads.save()
        del request.session['upd_file']
        return render(request, 'webapp/businessdashboard.html', {'name': request.user.first_name})
   
    # tz = Student.objects.get(email=request.session['email']).time_zn
    # d_aware = datetime.datetime.strptime(request.session['datetimeval'], '%Y-%m-%dT%H:%M').astimezone(pytz.timezone(tz))
    # student_obj = Student.objects.get(email=request.session['email'])
    # course_obj= Course.objects.get(name=request.session['course'])
    # assignCourse = StudentCourse.objects.create(student=student_obj, course=course_obj, level=request.session['level'], status="P", date_joined=d_aware, teacher=None)
    # assignCourse.save()
    # #Sening email
    
    # email_subject = 'Teklrn Course Booked Alert'
    # email_body = 'Hello '+request.session["name"]+', \n\n You have booked \n\nCourse: '+request.session["course"]+'\n\nLevel: '+request.session["level"]+'\n\n You will be notified once the Booking is accepted by a trainer. \n\n Thanks And Regards, \n Teklrn Backend Team'
    # email_test = EmailMessage(
    #             email_subject,
    #             email_body,
    #             'teklrn.inc@gmail.com',
    #             [student_obj.email],
    #         )
    # email_test.send(fail_silently=False)
    # return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'technology' : request.session['course']})
   
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
            request.session['email']=username
            password = form.cleaned_data.get('password1')
            business_name = form.cleaned_data.get('business_name')
            user_obj = form.save()
            freegeoip_response = requests.get('http://ip-api.com/json/')
            freegeoip_response_json = freegeoip_response.json()
            user_time_zone = freegeoip_response_json['timezone']
            student = Student.objects.create(user=user_obj, time_zn=user_time_zone, email=username, business_name=business_name)
            student.save()
            domain = get_current_site(request).domain        
            uidb64 = urlsafe_base64_encode(force_bytes(user_obj.pk))
            link=reverse('activate', kwargs={
                     'uidb64': uidb64, 'token': token_generator.make_token(user_obj)})
            activate_url = 'http://'+domain+link
            email_subject = 'Teklrn Business Account Activation'
            email_body = 'Hello '+user_obj.first_name+ ', \n\n Please use this link to verify your Teklrn business account.\n\n' + activate_url+ ' \n\nTeklrn for Business.\nhttps://teklrn.com/business/ \nEmail: teklrn.com@gmail.com \nCA, United States'
            email_test = EmailMessage(
                email_subject,
                email_body,
                'teklrn.inc@gmail.com',
                [user_obj.email],
            )
            try:
                email_test.send(fail_silently=False)
            except:
                ji='Error'
            return render(request, 'webapp/loginActivate.html', {'email' : request.session['email']})

            # return  HttpResponseRedirect(HOSTNAME+'?redirecttologinA')
    else:
        form = ExtendedUserCreationForm()
        try:
            # form.fields["email"].initial = request.session['email']
            data = request.GET            
            form.fields["email"].initial = data.get("email")
        except:
            kl=0

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
    return render(request, 'webapp/login.html', {'course': 'Tensorflow'})

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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return
   #  render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})

def financialNews(request):
    page = 'webapp/financial_pre_landing.html'
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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            #page = 'webapp/hi_pre_landing.html'
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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def videoPre(request):
    page = 'webapp/video_pre_landing.html'
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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            #page = 'webapp/hi_pre_landing.html'
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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
   # return render(request, page, {'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':defaultTechnology})
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})

def scitechLatestTechPre(request):
    page = 'webapp/scitech_emerging_technology_pre_landing.html'
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
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def scitechSpacePre(request):
    page = 'webapp/scitech_space_pre_landing.html'
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
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def scitechPre(request):
    page = 'webapp/scitech_pre_landing.html'
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
    return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})


def financialPre(request):
    page = 'webapp/financial_pre_landing.html'
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
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})
        except Exception:
            #page = 'webapp/hi_pre_landing.html'
            return render(request, page, {'technology':defaultTechnology, 'technology_desc':defaultTechnology})    
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
    try:
        html = urlopen(req)    
        #html = urllib.request.urlopen(data.get("url"), headers=hdr)
        # parsing the html file
        htmlParse = BeautifulSoup(html, 'html.parser')
        txt = ''
        for para in htmlParse.find_all("p"):
            txt += ' '+str(para)
        soup = BeautifulSoup(txt, features="lxml")
        dataValue = re.sub("[\[].*?[\]]", "", soup.get_text())
    except:
        dataValue = '' 
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

def scitechnews(request):
    # try:
    #     email_test = EmailMessage(
    #             "New Visit News",
    #             "New Visit News",
    #             'teklrn.inc@gmail.com',
    #             ['teklrn.inc@gmail.com'],
    #         )
    #     email_test.content_subtype = "html"
    #     email_test.send(fail_silently=False)
    # except:
    #     print()
    page = 'webapp/scientificnews.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    img=''
    pElement=data.get("para")
    all_p_ele=""
    if pElement != "":    
        soup = BeautifulSoup(requests.get(str(pElement)).content)
        
        for a2 in soup.find_all("p"):
            try:
                if "NIH" not in a2.text and "National Institute" not in a2.text and "More »" not in a2.text and "Quick Links" not in a2.text and "News Release" not in a2.text:
                    paradata= ' '.join(a2.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("Tech Tonic.", "").strip()
                    if len(paradata.split(" "))<5:
                        continue 
                    all_p_ele+=paradata
            except:
                all_p_ele = wikipedia.summary(wikipedia.search(data.get('subject').split('|')[0])[0])
                continue
    
    if len(all_p_ele)<15:
        try:
            all_p_ele = wikipedia.summary(wikipedia.search(data.get('subject').split('|')[0])[0])
        except:
            all_p_ele = ""
    
    if data.get("level"):
        defaultLevel = data.get("level")
    if data.get("subject"):
        try:
            c = Course.objects.get(description=data.get("subject"))
            defaultTechnology = c.name
            contentType = c.contentType
            request.session['contentType'] = c.contentType
            technology_description = c.description
        except:
            try:
                c = Course.objects.get(name=data.get("subject"))
                defaultTechnology = c.name
                contentType = c.contentType
                request.session['contentType'] = c.contentType
                technology_description = c.description
            except:
                defaultTechnology = data.get("subject")
                contentType = data.get("subject")
                request.session['contentType'] = data.get("subject")
                technology_description = data.get("subject")

       
    request.session['course'] = defaultTechnology
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    if data.get('image'):
        img = data.get('image')
    if data.get('direct'):
        if data.get('direct') == 'Financial':
            img = NewsFinancial.objects.get(name=data.get('subject')).imageLink
        elif data.get('direct') == 'Technology':
            img = NewsTechnology.objects.get(name=data.get('subject')).imageLink
        elif data.get('direct') == 'Entertainment':
            img = NewsEntertainment.objects.get(name=data.get('subject')).imageLink


    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology,'Code':data.get('Code'), 'technology_desc':technology_description, 'data':'', 'img':img, 'pElement':all_p_ele+'</div>'})


def news1(request):
    # try:
    #     email_test = EmailMessage(
    #             "New Visit News",
    #             "New Visit News",
    #             'teklrn.inc@gmail.com',
    #             ['teklrn.inc@gmail.com'],
    #         )
    #     email_test.content_subtype = "html"
    #     email_test.send(fail_silently=False)
    # except:
    #     print()
    page = 'webapp/news.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    img=''
    pElement=''
    
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
    # if(request.user.is_authenticated):
    #     try:
    #         s  = Student.objects.get(email=request.user.email)
    #         page = 'webapp/hi_login.html'
    #         return render(request, page, {'lvl':defaultLevel,'contentType':contentType, 'technology':defaultTechnology, 'technology_desc':technology_description})
    #     except Exception:
    #         page = 'webapp/hi_login_t.html'
    #         return render(request, page, {'lvl':defaultLevel,'technology':defaultTechnology, 'technology_desc':technology_description})    
    if data.get('image'):
        img = data.get('image')
    if data.get('direct'):
        if data.get('direct') == 'Financial':
            img = NewsFinancial.objects.get(name=data.get('technology')).imageLink
        elif data.get('direct') == 'Technology':
            img = NewsTechnology.objects.get(name=data.get('technology')).imageLink
        elif data.get('direct') == 'Entertainment':
            img = NewsEntertainment.objects.get(name=data.get('technology')).imageLink


    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology,'Code':data.get('Code'), 'technology_desc':technology_description, 'data':'', 'img':img, 'pElement':pElement+'</div>'})

def news(request):
    page = 'webapp/news.html' 
    data = request.GET
    img=''
    pElement=''
    defaultTechnology = data.get("technology")
    if data.get('image'):
        img = data.get('image')
    return render(request, page, {'lvl':1,'contentType':defaultTechnology, 'technology':defaultTechnology,'Code':data.get('Code'), 'technology_desc':defaultTechnology, 'data':'', 'img':img, 'pElement':pElement+'</div>'})

    

def medianews(request):
    page = 'webapp/medianews.html' 
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defaultLevel = 1
    img=''
    pElement=''
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
    if data.get('image'):
        img = data.get('image')
    
    if data.get('technology'):
        try:
            search = data.get('technology')
            url = 'https://www.google.com/search'

            headers = {
                'Accept' : '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82',
            }
            parameters = {'q': search}

            content = requests.get(url, headers = headers, params = parameters).text
            soup = BeautifulSoup(content, 'html.parser')

            search = soup.find(id = 'search')
            for link in search.find_all('a'):
                try:
                    r = requests.get(link['href'])
                    soup = BeautifulSoup(r.content)
                    pElement = '<div style="font-size:small;">'
                    for all_p in soup.find_all('p')[1:-1]:
                        pElement = pElement+ '<p style="color:black;">'+all_p.text.strip()+'</a>'
                    if len(pElement.split())>=200:
                        break
                except:
                    continue
            e = unquote(defaultTechnology.replace(':', ' ').replace('-', ' ').replace(',', ' ').replace('"', '').replace('\'', '').replace('’', ''))
            try:
                    img =  bing_image_urls(e, limit=1)[0]
            except:
                try:
                    img =  bing_image_urls(e, limit=4)[2]
                except:
                    try:
                        img =  bing_image_urls(e, limit=10)[1]
                    except:
                        try:
                            img =  bing_image_urls(e, limit=1)[0]
                        except:
                            img =  '/static/image/test/certificate.jpg'  
            
        except Exception as e:
            pElement = ''
    return render(request, page, {'lvl':defaultLevel,'contentType':request.session['contentType'], 'technology':defaultTechnology, 'technology_desc':technology_description, 'data':'', 'img':img, 'pElement':pElement+'</div>'})



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

def books(request):
    page = 'webapp/books_pre_landing.html'
    data = request.GET
    defaultTechnology = 'Tensorflow'
    defView = ''
    defImg = 'https://wordsrated.com/wp-content/uploads/2022/02/Number-of-Books-Published-Per-Year.jpg'
    if data.get("technology"):
        c = Course.objects.get(description=data.get("technology"))
        defaultTechnology = c.name
        contentType = c.contentType
    if data.get("technology1"):
       defView=data.get("technology1")
    if data.get("img1"):
       defImg=data.get("img1")
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
    return render(request, page, {'img':defImg, 'technology1':defView, 'technology':defView.replace('_', ' ')})


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
    return render(request, 'webapp/businessdashboard.html')

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


class CheckoutRemoveAdd(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        import boto3
        from pprint import pprint
        import pathlib
        import os

        """
        Uploads file to S3 bucket using S3 client object
        :return: None
        """
        from django.core.files.storage import FileSystemStorage
        user_email = request.user.email
        s3=''
        s3_client = ''
        s3_client = boto3.client("s3") 
        
        session=''
        if settings.AWS_ACCESS_KEY_ID=='1':
            session = boto3.Session()
            s3_client = boto3.client("s3") 
            
        else:
            session = boto3.Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            s3_client = boto3.client("s3",
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID, 
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, 
                        region_name=settings.AWS_DEFAULT_REGION
                            )        
        s3 = session.resource('s3')
        bucket_name = "tekl-rn-img"
        my_bucket = s3.Bucket(bucket_name)
        data = request.GET
        ad_number = data.get("ad_number")
        news_session = ''
        i=-1
        counterReduce = False
        for add_Data in request.session['upd_file'].split('----'):
            i=i+1
            if add_Data.split('|')[2]==ad_number:
                counterReduce=True
            else:
                if counterReduce:
                    oldCount = add_Data.split('|')[2]
                    newCOunt = str(int(oldCount)-1)
                    temp_Add_Data = add_Data.split('|')[0]+'|'+add_Data.split('|')[1]+'|'+newCOunt+'|'+add_Data.split('|')[3]
                    news_session+=temp_Add_Data+'----' 
                    s3_client.copy_object(CopySource = '/'+bucket_name+'/'+add_Data, Bucket = bucket_name, Key = temp_Add_Data)
                    
                else:
                    news_session+=add_Data+'----'
        request.session['upd_file'] = news_session[:-4]
        if(request.session['upd_file']==''):
            course_json={}
            course_json['imageUrl'] = 'NONE'
            course_json['display'] = 'NONE'
            course_json['link'] = 'NONE'
            results.append(course_json)
            data = json.dumps(results)
            mimetype = 'application/json'
            return HttpResponse(data, mimetype)
        
        
        all_items = request.session['upd_file'].split('----')
        for technology in all_items:
            course_json = {}
            response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': technology},
                                                    ExpiresIn=3600)
            course_json['imageUrl'] = response
            course_json['display'] = 'Advertisement '+technology.split('|')[2]
            course_json['link'] = technology.split('|')[1]
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class Checkout(FormView):
    def get(self,request,*args,**kwargs):
        import boto3
        from pprint import pprint
        import pathlib
        import os

        """
        Uploads file to S3 bucket using S3 client object
        :return: None
        """
        from django.core.files.storage import FileSystemStorage
        user_email = request.user.email
        # count=int(request.POST['cnt'])+1
        # webaddress = request.POST['web']
        # fs = FileSystemStorage()
        # filename = fs.save(request.FILES['file'].name, request.FILES['file'])
        s3=''
        s3_client = ''
        s3_client = boto3.client("s3") 
        
        session=''
        if settings.AWS_ACCESS_KEY_ID=='1':
            session = boto3.Session()
            s3_client = boto3.client("s3") 
            
        else:
            session = boto3.Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            s3_client = boto3.client("s3",
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID, 
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, 
                        region_name=settings.AWS_DEFAULT_REGION
                            )        
        #aws_access_key_id='<your_access_key_id>', aws_secret_access_key='<your_secret_access_key>')
        s3 = session.resource('s3')
        bucket_name = "tekl-rn-img"
        my_bucket = s3.Bucket(bucket_name)
        results= []
        all_items = request.session['upd_file'].split('----')
        for technology in all_items:
            course_json = {}
            response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': technology},
                                                    ExpiresIn=3600)
            course_json['imageUrl'] = response
            course_json['display'] = 'Advertisement '+technology.split('|')[2]
            course_json['link'] = technology.split('|')[1]
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

class LanguagesView(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        c = data.get("country")
        results= []
        langs = NewsLinks.objects.filter(country=Country.objects.get(name=c))
        for country in langs:
            course_json = {}
            course_json['name'] = country.language.name
            results.append(course_json)  
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 


class CountriesView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        countries = Country.objects.all()
        data = request.GET
        from geopy.geocoders import Nominatim
        geolocator = Nominatim(user_agent="geoapiExercises")
        if data.get("def_C")!="":
            try:
                location = geolocator.reverse(data.get("def_C"))
                srcC = str(location).split(',')[-1].strip()
            except:
                srcC = 'Canada'

        else:
            srcC =  'Canada'
        for country in countries:
            course_json = {}
            course_json['name'] = country.name
            if srcC in country.name:
                course_json['default_c'] = 1
            else:
                course_json['default_c'] = 0
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 

class VideosMatchingTheSearchNewView(FormView):
    def allNews(self, nameValue):
        nsu = NewsSearchUrls.objects.all()        
        fname = nameValue.capitalize().replace(' ','+')
        names = ''
        for u in nsu:            
            req = requests.get(u.url+fname)
            dataVal = BeautifulSoup(req.content)
            for a in dataVal.find_all(u.rule):
                k = a.text
                if len(k.strip().split(' ')) > 4:
                    if fname.split('+')[0]  in k:
                            names = names+k+';'
        return names[:-1].replace("'", "’")
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        # email_test = EmailMessage(
        #     'Hi',
        #     'Hello',
        #     'teklrn.inc@gmail.com',
        #     ['vijayan.akhil.cet@gmail.com'],
        # )
        # email_test.send(fail_silently=False)
        count=0
        # all_person = Person.objects.filter(country=Country.objects.get(name=c))
        alllinks = []

        # for person in all_person:
        #     alllinks += PersonVideoLinks.objects.filter(person=person).order_by('id')
        alllinks += DailyNewsVideos.objects.all().order_by('id')
        alllinks += PersonVideoLinks.objects.all().order_by('id')


        for x in range(3):              
            course_json = {}
            try:
                names = ''
                a = alllinks[(int(idx)+1)*3+int(x)]
                course_json['img'] = a.imgLink
                course_json['video'] = a.link
                # course_json['description'] =  a.person.name + ' - '+a.person.designation+'' +  ' - '+a.person.country.name
                if a.txt != '':
                    course_json['description'] = a.txt.split('.')[0]
                else:

                    try:    
                        course_json['description'] =  a.person.country.name
                    except:
                        course_json['description'] = a.person


                course_json['contentType'] = a.txt 
                course_json['count'] = count
                # news = self.allNews(a.person.name)
                # if news == "":
                #     news = self.allNews(a.person.country.name)         
                course_json['news'] = ''
            except Exception as e:
                count = 9999  
                course_json['count'] = count
                break
            results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)    


class TmailView(FormView):
    def get(self,request,*args,**kwargs):
        results = []
        data = request.GET
        img = data.get("img")
        title = (data.get("title")).capitalize()
        to = data.get("to")
        # tmailfrom = data.get("from")
        email_body = """\
    <html>
      <head></head>
      <body>
        <a href='http://teklrn.com/financial'>Teklrn.com AI News Engine: </a>
        <h1 href='http://teklrn.com/financial' style='font-size: x-large;'>%s</h1>
        <img href='http://teklrn.com/financial' src='%s'/>
        
           </body>
    </html>
    """ % (title, img)
        email_test = EmailMessage(
            title,
            email_body,
            'teklrn.inc@gmail.com',
            [to],
        )
        email_test.content_subtype = "html"
        email_test.send(fail_silently=False)
        course_json = {}
        results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)    

class GetLatestNewsView(FormView):
    def get(self,request,*args,**kwargs):
        # try:
        #     email_test = EmailMessage(
        #         "New Visit",
        #         "New Visit",
        #         'teklrn.inc@gmail.com',
        #         ['teklrn.inc@gmail.com'],
        #     )
        #     email_test.content_subtype = "html"
        #     email_test.send(fail_silently=False)
        # except:
        #     print('Mail Exception')
        EndOfData =  False
        results= []
        data = request.GET       
        our_url = 'https://www.aljazeera.com/'
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'
                course_json['technology'] = a['href']
                if 'Opinion' in a.text or 'Jazeera' in a.text or 'www.' in a.text or '›' in a.text or "Read" in a.text or " FT " in a.text or "FT " in a.text or "Learn more" in a.text or "Middle East & North Africa" in a.text or "our newsletter" in a.text:
                    continue
                course_json['description'] =  ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("Tech Tonic.", "").strip()
                if len(course_json['description'].split(" "))<5:
                    continue 
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 
    
class SciTechMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        # nl = NewsLinks.objects.filter(link='https://www.ft.com')[0]
        # contentType = nl.category
        k = int(idx)
        count=0
        if k >= 0:
            count = 9999
        o = 1
        while o<2:
            try:
                o=o+1
                our_url = "https://www.nih.gov/news-events/news-releases?page="+str(o)
                r = requests.get(our_url)
                soup = BeautifulSoup(r.content)
                for a in ['Agricultural robotics','Closed ecological systems','Cultured meat','Atmospheric water generator','Nanotechnology in agriculture','Vertical farming','Active structure','Arcology','Domed city','6G cellular communications','Artificial general intelligence','Biometrics','Blockchain','Carbon nanotube field-effect transistor','Civic technology','Digital Infrastructure','Digital scent technology','DNA digital data storage','Electronic nose','Emerging memory technologies','Emerging magnetic data storage technologies','E-textiles','Exascale computing','Exocortex','Flexible electronics','Fourth-generation optical discs','Hybrid forensics','Li-Fi','Machine vision','Magnonics','Memristor','Molecular electronics','Multimodal contactless biometric face/iris systems','Nanoelectromechanical systems','Nanoradio','Neuromorphic engineering','Optical computing','Quantum computing','Quantum cryptography','Quantum radar','Radio-frequency identification','Software-defined radio','Solid-state transformer','Speech recognition','Spintronics','Subvocal recognition','Thermal copper pillar bump','Three-dimensional integrated circuit','Twistronics','Immersive virtual reality','Synthetic media','Laser video display','Holography','Optical transistor','Screenless display','Volumetric  display','Airborne wind turbine','Americium battery','Artificial photosynthesis','Concentrated solar power','Double-layer capacitor','Energy harvesting','Flywheel energy storage','Fusion power','Generation IV nuclear reactor','Gravity battery','Home fuel cell','Lithium–air battery','Lithium iron phosphate battery','Lithium–sulfur battery','Magnesium battery','Molten salt reactor','Nanowire battery','Nantenna','Ocean thermal energy conversion','Solid-state battery','Smart grid','Space-based solar power','Thorium nuclear fuel cycle','Vortex engine','Wireless energy transfer','Zero-energy building','4D printing','Aerogel','Amorphous metal','Bioplastic','Compositionally complex materials','Conductive polymers','Cryogenic treatment','Directional freezing','Electric armour','Fullerene','Graphene','Lab-on-a-chip','High-temperature superconductivity','Magnetic nanoparticles','Magnetorheological fluid','Microfluidics','High-temperature superfluidity','Metamaterials','Metal foam','Multi-function structures','Nanomaterials: carbon nanotubes','Quantum dot','Self-healing materials','Silicene','Superalloy','Synthetic diamond','Time crystal','Translucent concrete','Artificial uterus','Body implant, prosthesis','Cryonics','De-extinction','Electronic medical records','Human DNA vaccination and mRNA vaccination','Enzybiotics','Genetic engineering of organisms and viruses','Hibernation or suspended animation','Life extension, strategies for engineered negligible senescence','Nanomedicine','Nanosensors','Omni Processor','Oncolytic virus','Personalized medicine, full genome sequencing','Phage therapy','Plantibody','Regenerative medicine','Robotic surgery','Senolytic','Stem cell treatments','Synthetic biology, synthetic genomics','Tissue engineering','Tricorder','Virotherapy','Vitrification or cryoprotectant','Artificial brain','Brain–computer interface','Brain-reading, neuroinformatics','Electroencephalography','Head transplant','Memory erasure','Neuroprosthetics','Wetware computer','Caseless ammunition','Cloaking device','Directed-energy weapon','Electrolaser','Electrothermal-chemical technology','Force field','Green bullet','Hypersonic cruise missile','Laser weapon','MAHEM','Precision-guided firearm','Railgun','Stealth technology','Telescoped ammunition','Lightweight Small Arms Technologies','Artificial gravity','Asteroid mining','Inflatable space habitat','Reusable launch vehicle','Starshot','Stasis chamber','Android, gynoid','Gastrobot','Molecular nanotechnology, nanorobotics','Powered exoskeleton','Self-reconfiguring modular robot','Swarm robotics','Uncrewed vehicle','Airless tire','Atmospheric satellite','Autonomous Rail Rapid Transit','Flexible wings , fluidic flight controls','Distributed propulsion','Flying car','Fusion rocket','Ground-level power supply','Hoverbike','Hovertrain, Ground effect train, Ground effect vehicle','Ion-propelled aircraft','Jet pack or backpack helicopter','Low Cost Semi-High speed Rail','Regional Rapid Transit System','Maglev train','Magnetic levitation','Magnetohydrodynamic drive','Mass driver','Orbital propellant depot','Personal rapid transit','Physical Internet','Scooter-sharing system','Vactrain','Plasma propulsion','Pulse detonation engine','Self-driving car','Space elevator','Spaceplane','Vehicular communication systems']:
                # for a in soup.find_all("h4", class_ = "teaser-title" ):
                    # data=a.find('a').text
                    data=a
                    href  = 'https://www.nih.gov'
                    if 'NIH' not in data and "National Institute" not in data:
                        all_p_ele = ""
                        if not 'NIH' in data:                            
                            soup1 = BeautifulSoup(requests.get(str(href)).content)
                            try:
                                for a2 in soup1.find_all("p"):
                                    if "NIH" not in a2.text and "National Institute" not in a2.text and "More »" not in a2.text and "Quick Links" not in a2.text and "News Release" not in a2.text:
                                            
                                            paradata= ' '.join(a2.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("Tech Tonic.", "").strip()
                                            if len(paradata.split(" "))<5:
                                                continue 
                                            all_p_ele+=paradata
                            except:
                                continue
                        course_json = {}
                        img = '/static/image/test/certificate.jpg'
                        course_json['technology'] = data + ' | Latest Technolologies 2024'
                        course_json['description'] =  data+ ' | Latest Technolologies 2024'
                        course_json['contentType'] = 'Financial'
                        course_json['count'] = count
                        course_json['para'] = ''
                        course_json['link'] = href
                        results.append(course_json)
            except:
                continue
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 
    
class FinancialMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        try:
            if FinancialRelatedNews.objects.count() > 0:
                for val in FinancialRelatedNews.objects.all():
                    course_json = {}
                    course_json['technology'] = val.url
                    course_json['description'] = val.txt
                    course_json['contentType'] = True
                    course_json['count'] = 0
                    course_json['imgLink'] = val.imgLink
                    results.append(course_json)
                random.shuffle(results)
                data = json.dumps(results)
                mimetype = 'application/json'
                return HttpResponse(data, mimetype) 
        except:
            kl = 0
        nl = NewsLinks.objects.filter(link='https://www.ft.com')[0]
        contentType = nl.category
        k = int(idx)
        if k >= 0:
            try:
                anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = AllNewsLinks.objects.filter(newLinks=nl).count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.link
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'
                course_json['technology'] = a['href']
                if "BBC" in a.text or "Read" in a.text or " FT " in a.text or "FT " in a.text or "Learn more" in a.text or "Middle East & North Africa" in a.text or "our newsletter" in a.text:
                    continue
                course_json['description'] =  ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("Tech Tonic.", "").strip()
                if len(course_json['description'].split(" "))<5:
                    continue 
                ful = FinancialRelatedNews(url=course_json['technology'], txt=course_json['description'])
                ful.save()
                course_json['contentType'] = contentType
                course_json['count'] = count
                course_json['contentType'] = False
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 
    
class BooksMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        # EndOfData =  False
        results= []
        # data = request.GET
        # # datasplit = data.get("search_string").split('---')
        # c = data.get("search_string")
        # l = data.get("lang")
        # idx = data.get("idx")
        # # codeC = datasplit[0]
        # # our_url = datasplit[1]
        # nl = NewsLinks.objects.filter(link='https://www.ft.com')[0]
        # contentType = nl.category
        # k = int(idx)
        # if k >= 0:
        #     try:
        #         anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
        #         nl = anl
        #     except:
        #         EndOfData = True
        # count = 0
        # try:
        #     count = AllNewsLinks.objects.filter(newLinks=nl).count()
        # except:
        #     count = 0
        # if EndOfData:
        #     count = 9999
        # our_url = nl.link
        # r = requests.get(our_url)
        # soup = BeautifulSoup(r.content)
        # for a in soup.find_all('a'):
        #     if len(a.text.strip().split(' '))>4:
        #         course_json = {}
        #         img = '/static/image/test/certificate.jpg'
        #         course_json['technology'] = a['href']
        #         if "BBC" in a.text or "Read" in a.text or " FT " in a.text or "FT " in a.text or "Learn more" in a.text or "Middle East & North Africa" in a.text or "our newsletter" in a.text:
        #             continue
        #         course_json['description'] =  ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("Tech Tonic.", "").strip()
        #         if len(course_json['description'].split(" "))<5:
        #             continue 
        #         course_json['contentType'] = contentType
        #         course_json['count'] = count
        #         results.append(course_json)
        books = Books.objects.all()
        for b in books:
            course_json = {}
            course_json['technology'] = b.pdf_link
            course_json['description'] = b.name
            course_json['contentType'] = b.imageLink
            course_json['count'] = 10
            results.append(course_json)
           
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 

class MatchingTheSearchNewView1(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        searchData = data.get("srch").replace(" ", "+")
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        nl = NewsSearchUrls.objects.all()[2]
        contentType = 'Search Results: '+data.get("srch")
        k = int(idx)
        if k >= 0:
            try:
                anl = NewsSearchUrls.objects.all()[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = NewsSearchUrls.objects.all().count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.url
        r = requests.get(our_url+searchData)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all(nl.rule):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'
                course_json['technology'] = a.text
                if "BBC" in a.text or "Read" in a.text or " FT " in a.text or "Learn more" in a.text or "Middle East & North Africa" in a.text or "our newsletter" in a.text:
                    continue
                course_json['description'] =  ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("tech tonic.", "").strip()
                if len(course_json['description'].split(" "))<5:
                    continue 
                course_json['contentType'] = contentType
                course_json['count'] = count
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 
    
class MatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        # EndOfData =  False
        results= []
        data = request.GET
        searchData = data.get("srch").replace(" ", "+")
        headers = {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
        }
        contentType= 'Search Results: '+data.get("srch")
        r = requests.get('https://apnews.com/search?q='+searchData, headers=headers)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('span', {'class' : 'PagePromoContentIcons-text'}):    
            if len(a.text.strip().split(' '))>6:
                course_json = {}
                course_json['technology'] = a.text.strip()
                course_json['description'] =  course_json['technology']                 
                course_json['contentType'] = contentType
                course_json['count'] = 9999
                results.append(course_json)
        if not results:
            url  = "https://search.yahoo.com/search?p="+searchData
            r = requests.get(url, headers=headers)
            soup = BeautifulSoup(r.content)
            for a in soup.find_all('a'):
                if len(a.text.strip().split(' '))>5 and 'www.' not in a.text and '›' not in a.text and 'See All' not in a.text:
                    course_json = {}
                    # img = '/static/image/test/certificate.jpg'
                    course_json['technology'] = ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("\"", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("tech tonic.", "").strip()
                    course_json['description'] =  course_json['technology']                 
                    course_json['contentType'] = contentType
                    course_json['count'] = 9999
                    results.append(course_json)
            # results=[]
            if not results:
                url  = "https://search.yahoo.com/search?p="+searchData
                r = requests.get(url, headers=headers)
                for a in soup.find_all('span'):
                    # if len(a.text.strip().split(' '))>4 and 'www.' not in a.text and '›' not in a.text:
                    if len(a.text.strip().split(' '))>5 and 'www.' not in a.text and '›' not in a.text:
                        course_json = {}
                        # img = '/static/image/test/certificate.jpg'
                        course_json['technology'] = ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("\"", "").replace("’", "").replace(",", " ").replace(":", " ").replace("opinion content.", "").replace("review.", "").replace("video content.", "").replace("tech tonic.", "").strip()
                        course_json['description'] =  course_json['technology'] 
                        if len(course_json['description'].split(" "))<5:
                            continue 
                        course_json['contentType'] = contentType
                        course_json['count'] = 9999
                        results.append(course_json)

        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 


class TechnologyMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        nl = NewsLinks.objects.filter(category='TECHNOLOGY')[0]
        contentType = nl.category
        k = int(idx)
        if k >= 0:
            try:
                anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = AllNewsLinks.objects.filter(newLinks=nl).count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.link
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'                
                datatoshow = ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").strip()
                course_json['description'] = datatoshow
                if len(datatoshow.split(" "))<5:
                    continue 
                course_json['technology'] = a['href']
                course_json['contentType'] = contentType
                course_json['count'] = count
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 

class EntertainmentMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        nl = NewsLinks.objects.filter(category='ENTERTAINMENT')[3]
        contentType = nl.category
        k = int(idx)
        if k >= 0:
            try:
                anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = AllNewsLinks.objects.filter(newLinks=nl).count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.link
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'
                try:
                    course_json['technology'] = a['href']
                except:
                    continue
                course_json['description'] = ' '.join(a.text.split()).replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").strip()
                if len(course_json['description'].split(" "))<5:
                    continue 
                course_json['contentType'] = contentType
                course_json['count'] = count
                results.append(course_json)
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 


class TechnologiesMatchingTheSearchNewView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        try:
            nl = NewsLinks.objects.filter(country=Country.objects.get(name=c), language=Language.objects.get(name='en'))[0]
        except:
            try:
                nl = NewsLinks.objects.filter(country=Country.objects.get(name=c), language=Language.objects.get(name='en-US'))[0]
            except:
                try:
                    nl = NewsLinks.objects.filter(country=Country.objects.get(name=c), language=Language.objects.get(name='en-GB'))[0]
                except:
                    nl = NewsLinks.objects.filter(country=Country.objects.get(name=c))[0]
        contentType = nl.country.name.upper() + ' [' + nl.language.name + ']'
        k = int(idx)
        if k >= 0:
            try:
                anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = AllNewsLinks.objects.filter(newLinks=nl).count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.link
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                course_json = {}
                img = '/static/image/test/certificate.jpg'
                try:
                    course_json['technology'] = a['href']
                    course_json['description'] = a.text.replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").strip()
                    course_json['contentType'] = contentType
                    course_json['count'] = count
                    results.append(course_json)
                except:
                    continue
        
        random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype) 

class TechnologiesMatchingTheSearchNewWithLanguageView(FormView):
    def get(self,request,*args,**kwargs):
        EndOfData =  False
        results= []
        data = request.GET
        # datasplit = data.get("search_string").split('---')
        c = data.get("search_string")
        l = data.get("lang")
        idx = data.get("idx")
        # codeC = datasplit[0]
        # our_url = datasplit[1]
        nl = NewsLinks.objects.filter(country=Country.objects.get(name=c), language=Language.objects.get(name=l))[0]
        contentType = nl.country.name.upper() + ' [' + nl.language.name + ']'
        k = int(idx)
        if k >= 0:
            try:
                anl = AllNewsLinks.objects.filter(newLinks=nl)[k]                
                nl = anl
            except:
                EndOfData = True
        count = 0
        try:
            count = AllNewsLinks.objects.filter(newLinks=nl).count()
        except:
            count = 0
        if EndOfData:
            count = 9999
        our_url = nl.link
        r = requests.get(our_url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('a'):
            if len(a.text.strip().split(' '))>4:
                try:
                    course_json = {}
                    img = '/static/image/test/certificate.jpg'
                    course_json['technology'] = a['href']
                    course_json['description'] = a.text.replace("'", "").replace("‘", "").replace("’", "").replace(",", " ").replace(":", " ").strip()
                    course_json['contentType'] = contentType
                    course_json['count'] = count
                    results.append(course_json)
                except:
                    continue
        random.shuffle(results)
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

class NewsMatchingTheSearchViewRandom(FormView):
    def get(self,request,*args,**kwargs):
        cate = 'GENERAL'
        results= []
        data = request.GET
        topic = data.get("search_string")  
        typeOfNews = data.get("type")  
        technologies = re.split(r'[;,\s]\s*', topic.strip())
        results = []
        for technology in technologies:
            if typeOfNews == 'Financial':
                courses =  NewsFinancial.objects.filter(name__icontains=technology).order_by("-id")[:6]
            elif typeOfNews == 'Technology':
                courses =  NewsTechnology.objects.filter(name__icontains=technology).order_by("-id")
            elif typeOfNews == 'Entertainment':
                courses =  NewsEntertainment.objects.filter(name__icontains=technology).order_by("-id")
            elif typeOfNews == 'News':
                courses =  NewsFinancial.objects.filter(name__icontains=technology).order_by("-id")[:6]
    
            if courses:
                for tech in courses:
                    course_json = {}
                    if len(tech.name.split(" "))<5:
                        continue
                    course_json['name'] = tech.name                    
                    course_json['category'] = tech.category
                    course_json['contentType'] = tech.contentType
                    course_json['imageLink'] = tech.imageLink

                    #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
                    results.append(course_json)

        if not results:
            if typeOfNews == 'Financial':
                technologies = NewsFinancial.objects.all().order_by("-id")[:6] 
            elif typeOfNews == 'Technology':
                technologies = NewsTechnology.objects.all().order_by("-id")
            elif typeOfNews == 'Entertainment':
                technologies = NewsEntertainment.objects.all().order_by("-id")
            elif typeOfNews == 'News':
                technologies =  NewsFinancial.objects.filter(name__icontains=technology).order_by("-id")[:6]
                
            for technology in technologies:
                course_json = {}
                if len(technology.name.split(" "))<5:
                        continue
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

class AllAdvertisementsForUserView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        import boto3
        from pprint import pprint
        import pathlib
        import os

        """
        Uploads file to S3 bucket using S3 client object
        :return: None
        """
        from django.core.files.storage import FileSystemStorage
        user_email = request.user.email
        # count=int(request.POST['cnt'])+1
        # webaddress = request.POST['web']
        # fs = FileSystemStorage()
        # filename = fs.save(request.FILES['file'].name, request.FILES['file'])
        s3=''
        s3_client = ''
        s3_client = boto3.client("s3") 
        
        session=''
        if settings.AWS_ACCESS_KEY_ID=='1':
            session = boto3.Session()
            s3_client = boto3.client("s3") 
            
        else:
            session = boto3.Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            s3_client = boto3.client("s3",
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID, 
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, 
                        region_name=settings.AWS_DEFAULT_REGION
                            )        
        #aws_access_key_id='<your_access_key_id>', aws_secret_access_key='<your_secret_access_key>')
        s3 = session.resource('s3')
        bucket_name = "tekl-rn-img"
        my_bucket = s3.Bucket(bucket_name)
        for s in StudentAds.objects.filter(student=Student.objects.get(email=request.user.email)):
                response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': s.ad_name},
                                                    ExpiresIn=3600)
                course_json = {}
                course_json['link'] = 'Advertisement ' +str(s.ad_name.split('|')[2])
                course_json['image_url'] = response
                course_json['url'] = ' Link to Ad ['+ s.ad_name.split('|')[1]+']'
                if s.expiry_date > datetime.datetime.now():
                    course_json['isActive'] =  True
                else:
                    course_json['isActive'] =  False

                results.append(course_json)
        # object_name = "akhil_resume.docx"
        # # print(request.FILES)
        # file_name = request.FILES['file']
        # print(fs.path(filename))
        # print(request.user.username+'|'+webaddress+'|'+str(count-1)+'|'+request.FILES['file'].name)
        # try:
        #     response = s3.upload_file(fs.path(filename), bucket_name, request.user.username+'|'+webaddress+'|'+str(count-1)+'|'+'.'+request.FILES['file'].name.split('.')[-1])
        # except:
        #     count=count-1
        #     request.session['display'] = '** Advertisement ' +str(count) + '  (Optional) Upload Failed Try again'
        #     fs.delete(filename)
        #     return render(request, 'webapp/businesslogin.html', {'skip':True,'display': request.session['display'], 'count': count})
        

        # cate = 'GENERAL'
        # results= []
        # data = request.GET
        # topic = data.get("search_string")  
        # technologies = re.split(r'[;,\s]\s*', topic.strip())
        # results = []
        # for technology in technologies:
        #     courses =  News.objects.filter(name__icontains=technology).order_by("-id")
        #     if courses:
        #         for tech in courses:
        #             course_json = {}
        #             course_json['name'] = tech.name
        #             course_json['category'] = tech.category
        #             course_json['contentType'] = tech.contentType
        #             course_json['imageLink'] = tech.imageLink

        #             #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
        #             results.append(course_json)

        # if not results:

        #     technologies = News.objects.all().order_by("-id")
        #     for technology in technologies:
        #         course_json = {}
        #         course_json['name'] = technology.name
        #         course_json['category'] = technology.category
        #         course_json['contentType'] = technology.contentType
        #         course_json['imageLink'] = technology.imageLink
        #         #course_json['videoLink'] = CourseLevel.objects.get(course=tech, level_number=1).videoLink
        #         results.append(course_json)
        # random.shuffle(results)
        data = json.dumps(results)
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

class AutoCompleteSearchTopicsViewNewNewsForImgRelated(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get('titles')  
        langg = data.get('lang') 
        stringVal = data.get('strVal') 
        NonEnglish = False
        if langg not in ('us', 'gb', 'nz', 'au', 'ca'):
            NonEnglish = True
        if NonEnglish: 
            translator = Translator() 
            course_json = {} 
            e = unquote(stringVal)
            course_json['title'] = topic
            # URLTITLE = topic.split('---')[1]
            srch_text = translator.translate(e.lstrip(digits), dest='en').text.replace(':', ' ').replace('-', ' ').replace(',', ' ').replace('"', '').replace('\'', '').replace('’', '')
            try:
                course_json['src'] =  bing_image_urls(srch_text, limit=1)[0]
            except:
                    try:
                        course_json['src'] =  bing_image_urls(srch_text, limit=4)[2]
                    except:
                        try:
                            course_json['src'] =  bing_image_urls(srch_text, limit=10)[1]
                        except:
                            try:
                                course_json['src'] =  bing_image_urls(srch_text[:len(e)//2], limit=1)[0]
                            except:
                                course_json['src'] =  '/static/image/test/certificate.jpg'    
            UrlTitle = data.get('UrlTitle') 
            urlLink = ''
            try:
                try:
                    urlLink = UrlLink.objects.get(name=UrlTitle)
                    rn  = RelatedNews(NewsLink = urlLink, imgLink = str(course_json['src']), txt = srch_text)
                    rn.save() 
                except UrlLink.DoesNotExist:
                    try:
                        urlLink = UrlLink(name=UrlTitle)
                        urlLink.save()
                    except:
                        urlLink = UrlLink.objects.get(name=UrlTitle)
                    
                    rn  = RelatedNews(NewsLink = urlLink, imgLink = str(course_json['src']), txt = srch_text)
                    rn.save()       
            except:
                kl=11                         
            results.append(course_json)
        else: 
            course_json = {} 
            e = unquote(stringVal)
            course_json['title'] = topic
            try:
                course_json['src'] =  bing_image_urls(srch_text, limit=1)[0]
            except:
                course_json['src'] =  '/static/image/test/certificate.jpg'
            UrlTitle = data.get('UrlTitle')  
            urlLink = ''
            try:
                try:
                    urlLink = UrlLink.objects.get(name=UrlTitle)
                    rn  = RelatedNews(NewsLink = urlLink, imgLink = str(course_json['src']), txt = srch_text)
                    rn.save()    
                except UrlLink.DoesNotExist:
                    try:
                        urlLink = UrlLink(name=UrlTitle)
                        urlLink.save()
                    except:
                        urlLink = UrlLink.objects.get(name=UrlTitle)
                rn  = RelatedNews(NewsLink = urlLink, imgLink = str(course_json['src']), txt = str(course_json['title']))
                rn.save()      
            except:
                ksdjhsk=1      
            results.append(course_json)
       # random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)
    

class AdsView(FormView):
    def get(self,request,*args,**kwargs):
        return HttpResponse("google.com, pub-3671375601838095, DIRECT, f08c47fec0942fa0")

class AutoCompleteSearchTopicsViewNewNewsForImg(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        topic = data.get('titles')  
        langg = data.get('lang') 
        stringVal = data.get('strVal') 
        NonEnglish = False
        if langg not in ('us', 'gb', 'nz', 'au', 'ca'):
            NonEnglish = True 
        alltitles = topic.split('---')
        if NonEnglish: 
            translator = Translator() 
            for entry in alltitles:
                course_json = {} 
                e = unquote(entry.replace(stringVal+'-img-', ''))
                course_json['title'] = stringVal+'-img-'+e
                try:
                    srch_txt = translator.translate(e.lstrip(digits), dest='en').text.replace(':', ' ').replace('-', ' ').replace(',', ' ').replace('"', '').replace('\'', '').replace('’', '')
                except:
                    continue
                try:
                    course_json['src'] =  bing_image_urls(srch_txt, limit=1)[0]
                except:
                    try:
                        course_json['src'] =  bing_image_urls(srch_txt, limit=4)[2]
                    except:
                        try:
                            course_json['src'] =  bing_image_urls(srch_txt, limit=10)[1]
                        except:
                            try:
                                course_json['src'] =  bing_image_urls(srch_txt[:len(e)//2], limit=1)[0]
                            except:
                                course_json['src'] =  '/static/image/test/certificate.jpg'         
                try:
                    ful = FinancialRelatedNews.objects.filter(txt=e.lstrip(digits).replace(stringVal+'-img-', ''))[0]
                    
                    ful.imgLink = course_json['src']
                    ful.save()  
                except:
                    kl=0
                results.append(course_json)
        else:            
            for entry in alltitles:
                course_json = {} 
                e = unquote(entry.replace(stringVal+'-img-', ''))
                course_json['title'] = stringVal+'-img-'+e
                try:
                    course_json['src'] =  bing_image_urls(srch_txt, limit=1)[0]
                except:
                    course_json['src'] =  '/static/image/test/certificate.jpg'
                try:
                    ful = FinancialRelatedNews.objects.filter(txt=e.lstrip(digits).replace(stringVal+'-img-', ''))[0]   
                    
                    ful.imgLink = course_json['src']
                    ful.save()  
                except:
                    kl=0
                results.append(course_json)
       # random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class NewsContentAdditional(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET        
        if data.get('heading'):
            heading = data.get('heading')
        urlLink = ''
        try:
            urlLink = UrlLink.objects.get(name=heading)
            course_json = {}
            if urlLink.para:
                course_json['para'] = urlLink.para
                results.append(course_json)
                data = json.dumps(results)
                mimetype = 'application/json'
                return HttpResponse(data, mimetype)
        except UrlLink.DoesNotExist:
            kl=0
            
        try:
            search = heading
            url = 'https://www.google.com/search'

            headers = {
                'Accept' : '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82',
            }
            parameters = {'q': search}

            content = requests.get(url, headers = headers, params = parameters).text
            soup = BeautifulSoup(content, 'html.parser')

            search = soup.find(id = 'search')
            f = 0
            for link in search.find_all('a'):               
                d = link['href']
                # print(d)
                if "wikipedia" in d or "ft-com" in d or "ft.com" in d or "twitter.com" in d or "youtube.com" in d  or "linkedin.com" in d:
                    continue
                try:
                    r = requests.get(d)
                    soup = BeautifulSoup(r.content, features="lxml")
                    pElement = '<hr>'
                    pElement1 = '<div style="font-size:1.4em !important;">'
                    
                    i=0
                    for all_p in soup.find_all('p'):
                        lower_p = re.sub("[\(\[].*?[\)\]]", "", all_p.text.lower().replace('/n', ' ').replace('\r', ' '))
                        if len(all_p.text.strip().split())>=10 and 'updated on:' not in lower_p  and 'weekly newsletter' not in lower_p and 'the information you requested is not available at this time' not in lower_p  and 'photograph:' not in lower_p and 'website uses cookies' not in lower_p and 'disable the ad blocking' not in lower_p and 'financial times' not in lower_p and 'sign up for' not in lower_p and 'daily newsletter' not in lower_p and '©' not in lower_p and 'www.' not in lower_p and 'privacy policy' not in lower_p and 'subscription' not in lower_p and 'subscribe' not in lower_p and 'all rights reserved' not in  lower_p:
                          pElement = pElement+ '<p style="font-size: 1.2em !important;font-family: -apple-system !important;padding-top:1% !important;padding-bottom:1% !important;color:black;">'+all_p.text.strip()+'</p>'
                          pElement1 = pElement1+ '<p style="font-size: 1.2em !important;font-family: -apple-system !important;padding-top:1% !important;padding-bottom:1% !important;color:black;">'+all_p.text.strip()+'</p>'

                    if len(pElement.split())>=200:
                        # if f==0:
                        #     f=f+1                            
                        #     continue  
                        f=f+1
                        course_json = {}
                        course_json['para'] = re.sub("[\(\[].*?[\)\]]", "", pElement1)
                        try:
                            urlLink = UrlLink.objects.get(name=heading)            
                        except UrlLink.DoesNotExist:
                            urlLink = UrlLink(name=heading)
                            urlLink.save()
                        urlLink.para = urlLink.para+re.sub("[\(\[].*?[\)\]]", "", pElement)
                        urlLink.save()
                        results.append(course_json)
                except:
                    continue
        except Exception as e:
            pElement = ''
            course_json = {}
            course_json['para'] = pElement
            results.append(course_json)
                
       # random.shuffle(results)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class NewsContentPre(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET        
        if data.get('heading'):
            heading = data.get('heading')
        urlLink = ''
        try:
            urlLink1 = UrlLink.objects.get(name=heading)
            if not urlLink1.para:
                urlLink = RandomTechNews.objects.order_by("?").first()
                course_json = {}
                course_json['para'] = urlLink.txt
                results.append(course_json)
                data = json.dumps(results)
                mimetype = 'application/json'
            else:
                course_json = {}
                course_json['para'] = ''
                results.append(course_json)
                mimetype = 'application/json'
        except UrlLink.DoesNotExist:
            urlLink = RandomTechNews.objects.order_by("?").first()
            course_json = {}
            course_json['para'] = urlLink.txt
            results.append(course_json)
            data = json.dumps(results)
            mimetype = 'application/json'
        
        return HttpResponse(data, mimetype)

class NewsContent(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET        
        if data.get('heading'):
            heading = data.get('heading')
        urlLink = ''
        try:
            urlLink = UrlLink.objects.get(name=heading)
            course_json = {}
            course_json['para'] = urlLink.para
            results.append(course_json)
            data = json.dumps(results)
            mimetype = 'application/json'
            return HttpResponse(data, mimetype)
        except UrlLink.DoesNotExist:
            kl=0
            
        try:
            url = 'https://www.google.com/search'

            headers = {
                'Accept' : '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82',
            }
            parameters = {'q': heading}

            content = requests.get(url, headers = headers, params = parameters).text
            soup = BeautifulSoup(content, 'html.parser')

            search = soup.find(id = 'search')
            
            for link in search.find_all('a'):
                d = link['href']
                if "wikipedia" in d or "ft-com" in d or "ft.com" in d or "twitter.com" in d or "youtube.com" in d  or "linkedin.com" in d or "reddit" in d:
                    continue
                try:
                    soup = BeautifulSoup(requests.get(d).content, features="lxml")
                    pElement = '<div style="font-size:1.4em !important;">'
                    i=0
                    for all_p in soup.find_all('p'):
                        lower_p = re.sub("[\(\[].*?[\)\]]", "", all_p.text.lower().replace('/n', ' ').replace('\r', ' '))
                        if len(all_p.text.strip().split())>=10 and 'updated on:' not in lower_p  and 'weekly newsletter' not in lower_p and 'the information you requested is not available at this time' not in lower_p  and 'photograph:' not in lower_p and 'website uses cookies' not in lower_p and 'disable the ad blocking' not in lower_p and 'financial times' not in lower_p and 'sign up for' not in lower_p and 'daily newsletter' not in lower_p and '©' not in lower_p and 'www.' not in lower_p and 'privacy policy' not in lower_p and 'subscri' not in lower_p and 'all rights reserved' not in  lower_p:
                          pElement = pElement+ '<p style="font-size: 1.2em !important;font-family: -apple-system !important;padding-top:1% !important;padding-bottom:1% !important;color:black;">'+all_p.text.strip()+'</p>'
                    if len(pElement.split())>=200:
                        course_json = {}
                        course_json['para'] = re.sub("[\(\[].*?[\)\]]", "", pElement)
                        try:
                            urlLink = UrlLink.objects.get(name=heading)            
                        except UrlLink.DoesNotExist:
                            urlLink = UrlLink(name=heading)
                            urlLink.save()
                        urlLink.para = course_json['para']
                        urlLink.save()
                        results.append(course_json)
                        break
                except:
                    continue
        except Exception as e:
            course_json = {}
            course_json['para'] = ''
            results.append(course_json)
                
       # random.shuffle(results)
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
        temp=unquote(c)
        googlenews = GoogleNews(lang=langg, period='1d')
        googlenews.search(temp)
        alldata = googlenews.results(sort=True)
        NonEnglish = False
        if langg not in ('us', 'gb', 'nz', 'au', 'ca'):
            NonEnglish = True 
        if NonEnglish:            
            translator = Translator() 
            for entry in alldata:
                course_json = {}                
                course_json['description'] = entry["desc"].replace('\'', '')
                course_json['link'] = entry["link"]
                course_json['title'] = entry["title"]
                titles = translator.translate(titles, dest="en").text                                    
                try:
                    course_json['imgLink'] =  '/static/image/test/certificate.jpg' #bing_image_urls(titles.replace(':', ' ').replace('-', ' ').replace(',', ' ').replace('"', '').replace('\'', '').replace('’', ''), limit=1)[0]
                except:
                    course_json['imgLink'] =  '/static/image/test/certificate.jpg'

                results.append(course_json)
        else:
            for entry in alldata:
                course_json = {}                
                course_json['description'] = entry["desc"].replace('\'', '')
                course_json['link'] = entry["link"]
                course_json['title'] = entry["title"].replace('\'', '')
                    
                try:
                    course_json['imgLink'] =  '/static/image/test/certificate.jpg' #bing_image_urls(titles.replace(':', ' ').replace('-', ' ').replace(',', ' ').replace('"', '').replace('\'', '').replace('’', ''), limit=0)[0]
                except:
                    course_json['imgLink'] =  '/static/image/test/certificate.jpg'

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
    
class RelatedNewsView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        courseName = data.get("titles")
        try:
            urlLink = UrlLink.objects.get(name=courseName)
            listNews = RelatedNews.objects.filter(NewsLink=urlLink)
            if len(listNews)>0:
                for ns in listNews:
                    course_json = {}
                    course_json['newtitle'] = ns.txt
                    course_json['img'] = ns.imgLink
                    results.append(course_json)
                data = json.dumps(results)
                mimetype = 'application/json'
                return HttpResponse(data, mimetype)
        except UrlLink.DoesNotExist:
            urlLink = UrlLink(name=courseName)
            urlLink.save()
        url  = "https://search.yahoo.com/search?p="+courseName
        r = requests.get(url)
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('span'):
            data_text = a.text.lower()
            datatotest = data_text.split('.')[0].replace("'", "").strip()
            if len(datatotest.split(' '))>4 and 'www.' not in data_text and '›' not in data_text and 'searches related to' not in data_text and ' ago' not in data_text:
                course_json = {}
                course_json['newtitle'] = datatotest
                results.append(course_json)
        if len(results)<10:
            url = 'https://www.google.com/search'
            headers = {
                'Accept' : '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82',
            }
            parameters = {'q': courseName}
            content = requests.get(url, headers = headers, params = parameters).text
            soup = BeautifulSoup(content, 'html.parser')
            search = soup.find(id = 'search')
            for a in search.find_all('span'):
                 data_text = a.text.lower()
                 datatotest = data_text.split('.')[0].replace("'", "").strip()
                 if len(datatotest.split(' '))>4 and 'www.' not in data_text and '›' not in data_text and 'searches related to' not in data_text and ' ago' not in data_text:
                    course_json = {}
                    course_json['newtitle'] = datatotest
                    course_json['img'] = False
                    results.append(course_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class AutoCompleteViewNew(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        courseName = data.get("term")
        courses = []
        headers = {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582"
        }
        #response = requests.get('http://google.com/complete/search?client=chrome&q='+courseName, headers=headers)
        wikidetails = wikipedia.search(courseName)
        for a in wikidetails:
                    course_json1 = {}
                    course_json1['value'] = a
                    course_json1['name'] = a
                    course_json1['description'] = a
                    results.append(course_json1)
        
        r = requests.get('https://apnews.com/search?q='+courseName, headers=headers)
        #for course in json.loads(response.text)[1]:
        soup = BeautifulSoup(r.content)
        for a in soup.find_all('span', {'class' : 'PagePromoContentIcons-text'}):    
            if len(a.text.strip().split(' '))>6:
                course = a.text.strip()
                course_json = {}
                course_json['value'] = course
                course_json['name'] = course
                course_json['description'] = course
                results.append(course_json)
        if not results:        
            r = requests.get('https://globalnews.ca/?s='+courseName, headers=headers)
            #for course in json.loads(response.text)[1]:
            soup = BeautifulSoup(r.content)

            for a in soup.find_all('span'):            
                if courseName.upper() in a.text.upper() and len(a.text.strip().split(' '))>6:
                    course = a.text.split('.')[0].strip()
                    course_json = {}
                    course_json['value'] = course
                    course_json['name'] = course
                    course_json['description'] = course
                    results.append(course_json)
        # if not results:
                # print("No results"+courseName)
        
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
        if(request.user.is_authenticated):
            request.session['display'] = '** Advertisement ' +'1' + '   (Required)'
            return render(request, 'webapp/businesslogin.html', {'skip':True,'display': request.session['display'], 'count': '1'})
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
            return render(request, 'webapp/login.html', {'course': 'Java'})
            # return HttpResponseRedirect(HOSTNAME+'login?email='+email_id)
        try:
            teacher = Teacher.objects.get(email=email_id)
        except ObjectDoesNotExist:
            teacher = None
        if teacher:
            return HttpResponseRedirect(HOSTNAME+'loginForm?email='+email_id)
        # render(request, page, {'email': request.session['email']})
        request.session['email']=email_id
        return HttpResponseRedirect(HOSTNAME+'register?email='+email_id)


def logout_view(request): 
        logout(request)    
        defaultTechnology='Tensorflow'        
        return render(request, "webapp/businessdashboard.html", {'technology':'Tensorflow', 'technology_desc':defaultTechnology})

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
class LoginViewBusiness(FormView):
    def get(self,request,*args,**kwargs):
        page = "webapp/emailBusiness.html"
        if(request.user.is_authenticated):
            request.session['display'] = '** Advertisement ' +'1' + '   (Required)'
            return render(request, 'webapp/businessdashboard.html', {'skip':True,'display': request.session['display'], 'count': '1'})
        return render(request, page, {'name':  'name'})

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

class AddAdvertisementsView(FormView):    
    def get(self,request,*args,**kwargs):
        if not request.user.is_authenticated:           
           return render(request, "webapp/emailBusiness.html", {'name':  'name'})
        skip = False
        ad_count=0
        try:
            if request.session['upd_file']=='':
                ad_count = Student.objects.get(email=request.user.email).advertisement_count+1             
            else:
                ad_count = Student.objects.get(email=request.user.email).advertisement_count+1+len(request.session['upd_file'].split('----'))             
        except:
            ad_count = Student.objects.get(email=request.user.email).advertisement_count+1
        request.session['count'] = ad_count
        if ad_count == 1:
            request.session['display'] = '** Advertisement ' +str(ad_count) + '   (Required)'
        else:
            request.session['display'] = '** Advertisement ' +str(ad_count) + '   (Optional)'
            ad_count_existing = Student.objects.get(email=request.user.email).advertisement_count
            if int(ad_count_existing) !=  (int(ad_count)-1):
                skip = True
        return render(request, 'webapp/businesslogin.html', {'skip':skip, 'display': request.session['display'], 'count': ad_count})

class LoginBusinessView(FormView):
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        student = Student.objects.get(email=email_id)
        page = "webapp/businessdashboard.html"
        if student is not None:
            user = authenticate(request, username = email_id, password = pwd)
            if user is not None:
                login(request, user)
                tz = Student.objects.get(email=user.email).time_zn
                now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(days=10)
                dt = now.strftime('%Y-%m-%dT%H:%M')
                max_v = now + relativedelta(months=2)
                dt_max = max_v.strftime('%Y-%m-%dT%H:%M')
                name = student.user.first_name
                email_id = student.user.username
                request.session['name']=name
                request.session['email']=email_id
                request.session['business_name']=Student.objects.get(email=user.email).business_name
                request.session['advertisement_count']=Student.objects.get(email=user.email).advertisement_count

        return render(request, page, {'email': request.session['email'], 'name': request.session['name']})

class UploadFileUsingClientView(FormView):
    def post(self,request,*args,**kwargs):
        import boto3
        from pprint import pprint
        import pathlib
        import os

        """
        Uploads file to S3 bucket using S3 client object
        :return: None
        """
        from django.core.files.storage import FileSystemStorage
        count=int(request.POST['cnt'])+1
        try:
            if len(request.session['upd_file'].split('----'))>0:
                for d in request.session['upd_file'].split('----'):
                    if int(d.split('|')[2])==int(request.POST['cnt']):
                        request.session['count'] =count
                        request.session['display'] = '** Advertisement ' +str(count) + '  (Optional)'
                        return render(request, 'webapp/businesslogin.html', {'skip':True,'display': request.session['display'], 'count': count})

        except:
            ji = 'Error'
        webaddress = request.POST['web']
        fs = FileSystemStorage()
        filename = fs.save(request.FILES['file'].name, request.FILES['file'])
        s3=''
        if settings.AWS_ACCESS_KEY_ID=='1':
            s3 = boto3.client("s3") 
        else:
            s3 = boto3.client("s3",
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID, 
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY, 
                        region_name=settings.AWS_DEFAULT_REGION
                            )        
        bucket_name = "tekl-rn-img"
        f_name = request.user.username+'|'+webaddress+'|'+str(count-1)+'|'+'.'+request.FILES['file'].name.split('.')[-1]
        try:
            if request.session['upd_file']=='':
                request.session['upd_file'] = f_name    
            else:
                request.session['upd_file'] = request.session['upd_file']+'----'+f_name
        except:
            request.session['upd_file']=f_name
        try:
            response = s3.upload_file(fs.path(filename), bucket_name, f_name)
        except:
            count=count-1
            request.session['count'] =count
            request.session['display'] = '** Advertisement ' +str(count) + '  (Optional) Upload Failed Try again'
            fs.delete(filename)
            return render(request, 'webapp/businesslogin.html', {'skip':True,'display': request.session['display'], 'count': count})
        
        fs.delete(filename)
        request.session['count'] =count
        request.session['display'] = '** Advertisement ' +str(count) + '  (Optional)'
        return render(request, 'webapp/businesslogin.html', {'skip':True,'display': request.session['display'], 'count': count})

        # pprint(response)  # prints None

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
            return render(request, 'webapp/login.html', {'email' : request.session['email']})
            # return  HttpResponseRedirect(HOSTNAME+'?redirecttologinT')
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
            return render(request, 'webapp/loginActivate.html', {'email' : request.session['email']})

            # return  HttpResponseRedirect(HOSTNAME+'?redirecttologin')
        return HttpResponseRedirect(HOSTNAME+'?toerror')

class RegisterStudentView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        if 'course' not in request.POST:
          course_name = "Tensorflow"
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

class ProceedToCheckout(FormView):
    def post(self,request,*args,**kwargs):
        course_description = 'Tensorflow'
        course_name = 'Tensorflow'
        course_level = '1'
        request.session['datetimeval']='2'
        request.session['name']=request.user.first_name
        request.session['course']='Tensorflow'
        request.session['contentType'] = 'Tensorflow'
        request.session['level']='1'
        request.session['description'] = 'Tensorflow'
        current_count = Student.objects.get(email = request.user.email).advertisement_count
        request.session['count']=request.session['count']-1-current_count
        request.session['amount'] = request.session['count'] * 0.00
        request.session['Pay'] = request.session['amount']*100
        return render(request, "webapp/buyCheckout.html", {'count':current_count, 'name': request.user.first_name, 'course': request.session['course'], 'level': request.session['level'], 'email': request.user.email})


class ProceedToPay(FormView):
    def post(self,request,*args,**kwargs):
        context={}
        course_description = 'Tensorflow'
        course_name = 'Tensorflow'
        course_level = '1'
        request.session['datetimeval']='2'
        request.session['name']=request.user.first_name
        request.session['course']='Tensorflow'
        request.session['contentType'] = 'Tensorflow'
        request.session['level']='1'
        request.session['description'] = 'Tensorflow'
        user_profile = Student.objects.get(email = request.user.email)
        current_count = user_profile.advertisement_count
        request.session['count']=len(request.session['upd_file'].split('----'))
        request.session['amount'] = request.session['count'] * 0.00
        request.session['Pay'] = request.session['amount']*100
        if user_profile.one_click:
            cards = stripe.Customer.list_sources(
                user_profile.cust_id,
                limit=3,
                object='card'
            )
            card_list=cards['data']
            if len(card_list)>0:
                context.update({
                    'card': card_list[0]
                })
        return render(request, "webapp/buy.html", context, {'count':request.session['count'], 'name': request.user.first_name, 'course': request.session['course'], 'level': request.session['level'], 'email': request.user.email})

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
