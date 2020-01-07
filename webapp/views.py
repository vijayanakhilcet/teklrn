from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.edit import FormView
from dal import autocomplete
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

stripe.api_key = settings.STRIPE_SECRET_KEY # new

# Create your views here.

def get_context_data(self, **kwargs): # new
    context = super().get_context_data(**kwargs)
    context['key'] = settings.STRIPE_PUBLISHABLE_KEY
    return context

def charge(request): # new
    if request.method == 'POST':
        charge = stripe.Charge.create(
            amount=500,
            currency='usd',
            description='A Django charge',
            source=request.POST['stripeToken']
        )
   # return render(request, 'webapp/hi_login.html', {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})
    return HttpResponseRedirect('/')

def about(request):
    return render(request, 'webapp/about.html')

def contact(request):
    return render(request, 'webapp/contact.html')

def hi(request):
    return render(request, 'webapp/hi.html')

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

class CheckTeacherExistsView(FormView):
    def get(self,request,*args,**kwargs):
        results= []
        data = request.GET
        email_id = data.get("email")
        if email_id:
            teachers = Teacher.objects.filter(email__iexact=email_id)           
        else:
            teachers = []
            results = []
        
        for teacher in teachers:
            teacher_json = {}
            teacher_json['email'] = teacher.email
            teacher_json['name'] = teacher.name
            results.append(teacher_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)


class LoginTeacherView(FormView):
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        page=None
        teacher = Teacher.objects.get(email=email_id)   
        name = teacher.name
        email_id= teacher.email
        passwd = teacher.password
        if(pwd==passwd): 
            course_name = teacher.courses.all()[0]
            request.session['name']=name
            request.session['email']=email_id
            request.session['password']=pwd
            page = "webapp/teacher_login.html"
        else:
            page = "webapp/hi.html"
            request.session['name']=None
            request.session['email']=None
            request.session['course']=None
            request.session['password']=None
        return render(request, page, {'name': request.session['name'], 'course': course_name, 'level': '1'})


class LoginStudentView(FormView):
    @method_decorator(csrf_exempt)
    def post(self,request,*args,**kwargs):
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        if 'course' not in request.POST:
          course_name = "Java"
        else:
          course_name = request.POST['course']
        if 'level' not in request.POST:
          course_level = "1"
        else:
          course_level = request.POST['level']
        page=None
        student = Student.objects.get(email=email_id)   
        name = student.name
        email_id= student.email
        passwd = student.password
        if(pwd==passwd): 
            request.session['name']=name
            request.session['email']=email_id
            request.session['course']=course_name
            request.session['level']=course_level
            request.session['password']=pwd
            page = "webapp/hi_login.html"
        else:
            page = "webapp/hi.html"
            request.session['name']=None
            request.session['email']=None
            request.session['course']=None
            request.session['level']=None
            request.session['password']=None
        return render(request, page, {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level']})


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
        student_name = request.POST['name']
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        student =  Student.objects.create(name=student_name, email=email_id,password=pwd)
        student.save()
        request.session['name']=student_name
        request.session['course']=course_name
        request.session['level']=course_level
        request.session['email']=email_id
        request.session['password']=pwd
        return render(request, "webapp/hi_login.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})


class RegisterTeacherView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        teacher_name = request.POST['name']
        email_id = request.POST['email']
        pwd = request.POST['pwd']
        course_name =  request.POST['course']
        meeting_link = request.POST['meetingLink']
        course_obj = Course.objects.get(name=course_name)
        teacher =  Teacher.objects.create(name=teacher_name, email=email_id,password=pwd, meetingLink=meeting_link)
        teacher.save()
        teacherCourse = TeacherCourse.objects.create(teacher=teacher, course=course_obj)
        teacherCourse.save()
        request.session['name']=teacher_name
        request.session['email']=email_id
        request.session['password']=pwd
        request.session['course']=course_name
        request.session['meetingLink']=meeting_link
        return render(request, "webapp/teacher_login.html", {'name': request.session['name'], 'email': request.session['email'], 'password': request.session['password'], 'course': request.session['course']})


class BookCourseView(FormView):
    def post(self,request,*args,**kwargs):
        results= []
        course_name = request.POST['course']
        course_level = request.POST['level']
        timeval = request.POST['datetimeval']
        zone = request.POST['zone']
        timezone = pytz.timezone(zone)
        d_aware = timezone.localize(dateutil.parser.parse(timeval))
        student_obj = Student.objects.get(email=request.session['email'])
        course_obj= Course.objects.get(name=course_name)
        assignCourse = StudentCourse.objects.create(student=student_obj, course=course_obj, level=course_level, status="P", date_joined=d_aware, teacher=None)
        assignCourse.save()
        request.session['name']=request.session['name']
        request.session['course']=course_name
        request.session['level']=course_level
       # return render(request, "webapp/hi_login.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})
        return render(request, "webapp/buy.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})

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
            studCourse_json['date'] = studCourse_obj.date_joined.isoformat()
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
        mimetype = 'application/json'
        return render(request, "webapp/hi.html", {'name': request.session['name'], 'course': request.session['course'], 'level': request.session['level'], 'email': request.session['email'], 'password': request.session['password']})


class MarkCourseCompletionView(FormView):
    def get(self,request,*args,**kwargs):
        pk= request.GET['pk']
        studCourse_obj=StudentCourse.objects.get(id=pk)
        studCourse_obj.status='C'
        studCourse_obj.save()
        mimetype = 'application/json'
        return HttpResponse(None, mimetype)

class TeacherGivenTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='C')
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
        studCourse_objs = StudentCourse.objects.filter(course__in=(Teacher.objects.get(email=t_email).courses.all()), status='A')
        results = []
        
        for studCourse_obj in studCourse_objs:
            studCourse_json = {}
            studCourse_json['pk'] = studCourse_obj.id
            studCourse_json['level'] = studCourse_obj.level
            studCourse_json['course'] = studCourse_obj.course.name
            studCourse_json['date'] = studCourse_obj.date_joined.isoformat()
            studCourse_json['meetingLink'] = Teacher.objects.get(email=t_email).meetingLink
            results.append(studCourse_json)
        data = json.dumps(results)
        mimetype = 'application/json'
        return HttpResponse(data, mimetype)

class PendingStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=t_email)), status='P')
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


class AcceptedStudentTrainingsView(FormView):       
    def get(self,request,*args,**kwargs):
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=t_email)), status='A')
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
        t_email= request.session['email']
        studCourse_objs = StudentCourse.objects.filter(student=(Student.objects.get(email=t_email)), status='C')
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
