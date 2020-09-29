from django.shortcuts import render
import requests
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.edit import FormView
from dal import autocomplete
from django.core.exceptions import ObjectDoesNotExist
from webapp.models import Course, Student, StudentCourse, Teacher, TeacherCourse
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

stripe.api_key = settings.STRIPE_SECRET_KEY # new
HOSTNAME = settings.APP_HOST_NAME
# Create your views here.

def get_context_data(self, **kwargs): # new
    context = super().get_context_data(**kwargs)
    context['key'] = settings.STRIPE_PUBLISHABLE_KEY
    return context

def charge(request): # new
    if request.method == 'POST':
        charge = stripe.Charge.create(
            amount=3500,
            currency='cad',
            description='A Django charge',
            source=request.POST['stripeToken']
        )
    return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
   
def about(request):
    return render(request, 'webapp/about.html')

def RedirectToLandingStudentView(request):
    return  HttpResponseRedirect(HOSTNAME+'?GFTfgTRFghHGfdjkJHGVCDSdnHHHH')


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
            dob = request.POST['start']
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
    return render(request, 'webapp/login.html')
    
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

def hi(request):
    page = 'webapp/hi.html'
    if(request.user.is_authenticated):
        try:
            s  = Student.objects.get(email=request.user.email)
            page = 'webapp/hi_login.html'
            return render(request, page)
        except Exception:
            page = 'webapp/hi_login_t.html'
            return render(request, page)    
    return render(request, page)

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

class AutoCompleteView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        courseName = data.get("term")
        if courseName:
            courses = Course.objects.filter(name__icontains=courseName)           
        else:
            courses = Course.objects.all()
            results = []
        for course in courses:
            course_json = {}
            course_json['levels'] = course.levels
            course_json['value'] = course.name
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
        return render(request, "webapp/home.html")

def logout_t_view(request): 
        logout(request)            
        return render(request, "webapp/home.html")

class CheckTeacherExistsView(FormView):
  
    def get(self,request,*args,**kwargs):
        data = request.GET
        email_id = data.get("email")
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
        request.session['email']=email_id
        return HttpResponseRedirect(HOSTNAME+'registerT')




class LoginView(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        course_name = data.get("course_name")
        course_level = data.get("course_level")
        request.session['course']=course_name
        request.session['level']=course_level
        return render(request, "webapp/email.html", {'name':  'name', 'course': course_name, 'level': course_level })

class LoginTView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/emailT.html", {'name':  'name'})

        
class BookCourseFormView(FormView):
    def get(self,request,*args,**kwargs):
        data = request.GET
        course_name = data.get("course")
        course_level = data.get("level")
        tz = Student.objects.get(email=request.user.email).time_zn
        now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(months=2)
        dt = now.strftime('%Y-%m-%dT%H:%M')
        return render(request, "webapp/bookCourse.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : 2, 'tz': tz })

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
            else:
                request.session['name']=None
                request.session['email']=email_id
        return render(request, page, {'email': request.session['email']})
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
                    now = datetime.datetime.now().astimezone(pytz.timezone(tz)) + relativedelta(months=2)
                    dt = now.strftime('%Y-%m-%dT%H:%M')
                    return render(request, "webapp/bookCourse.html", {'course_name':  course_name, 'course_level': course_level, 'dat_val' : dt, 'dat_max_val' : 2, 'tz': tz })
                else:
                    page="webapp/hi_login.html"               
                name = student.user.first_name
                email_id = student.user.username
                request.session['name']=name
                request.session['email']=email_id
            else:
                request.session['name']=None
                request.session['email']=email_id
        return render(request, page, {'email': request.session['email'], 'name': request.session['name']})
    def get(self,request,*args,**kwargs):
        page = "webapp/login.html"
        if(request.user.is_authenticated):
           page="webapp/hi_login.html"  
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
        request.session['level']=course_level
        request.session['email']=email_id
        request.session['password']=pwd
        return render(request, "webapp/hi_login.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})

class LandingBackView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/hi.html", {'name': 'name'})

class LandingBackLoginView(FormView):
    def get(self,request,*args,**kwargs):
        return render(request, "webapp/hi_login.html", {'name': 'name'})       

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
        request.session['course']=course_name
        request.session['meetingLink']=meeting_link
        return render(request, "webapp/hi_login_t.html", {'name': request.session['name'], 'email': request.session['email'], 'password': request.session['password'], 'course': request.session['course']})


class BookCourseView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        course_name = request.POST['course']
        course_level = request.POST['level']
        timeval = request.POST['datetimeval']
        tz = Student.objects.get(email=request.user.email).time_zn
        d_aware = datetime.datetime.strptime(timeval, '%Y-%m-%dT%H:%M').astimezone(pytz.timezone(tz))
        student_obj = Student.objects.get(email=request.session['email'])
        course_obj= Course.objects.get(name=course_name)
        assignCourse = StudentCourse.objects.create(student=student_obj, course=course_obj, level=course_level, status="P", date_joined=d_aware, teacher=None)
        assignCourse.save()
        request.session['name']=request.user.first_name
        request.session['course']=course_name
        request.session['level']=course_level
        return render(request, "webapp/buy.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email']})


class AssociatedTechView(FormView):
    def get(self,request,*args,**kwargs):
        d = request.GET
        course = d.get("course")
        cat = Course.objects.get(name=course).category 
        associated_techs = Course.objects.filter(category=cat)
        results = []
        
        for associated_tech in associated_techs:
         if associated_tech.name != course:
            associated_tech_json = {}
            associated_tech_json['name'] = associated_tech.name
            #studCourse_json['level'] = studCourse_obj.level
            results.append(associated_tech_json)
        data = json.dumps(results)
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
            my_ct = studCourse_obj.date_joined
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
            my_ct = studCourse_obj.date_joined
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
            studCourse_json['date'] = studCourse_obj.date_joined.isoformat()
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
