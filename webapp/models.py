from django.db import models
from django.contrib.auth.models import User
from phone_field import PhoneField



# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=100, default='Hi')  
    levels = models.IntegerField(default=170)    
    category = models.CharField(max_length=30, default='Java')
    contentType = models.CharField(max_length=30, default='Tech') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    def __str__(self):
        return self.name

#extend user model
class Student(models.Model):
    email = models.CharField(max_length=30)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time_zn = models.CharField(max_length=30)
    courses = models.ManyToManyField(Course, through='StudentCourse')
    def __str__(self):
        return self.user.username


class Teacher(models.Model):
     email = models.CharField(max_length=30)
     dob = models.DateField(max_length=8)     
     user = models.OneToOneField(User, on_delete=models.CASCADE)
     phone = PhoneField(blank=True, help_text='Contact phone number')
     time_zn = models.CharField(max_length=30)
     courses = models.ManyToManyField(Course, through='TeacherCourse')
     meetingLink = models.URLField(max_length=400)
     is_teklrn_authorized = models.BooleanField(default=False)


class StudentCourse(models.Model):    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    level = models.IntegerField(default=170)   
    date_joined = models.DateTimeField()
    status = models.CharField(max_length=1)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, blank=True, null=True)

class StudentCourseVideoBookings(models.Model):    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    level = models.IntegerField(default=170)       
    videoPresent = models.BooleanField(default=False)

class TeacherCourse(models.Model):    
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course =  models.ForeignKey(Course, on_delete=models.CASCADE)

class CourseLevel(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)   
    description = models.CharField(max_length=100)
    rating = models.IntegerField(default=4)
    reviewCount = models.IntegerField(default=46739)
    videoPresent = models.BooleanField(default=False)
    videoFree = models.BooleanField(default=0)
    videoLink =  models.CharField(max_length=400, default='Hi')
    class Meta:
        ordering = ["level_number"]

class CareerRoles(models.Model):
    name = models.CharField(max_length=30) 
    courses = models.ManyToManyField(Course)
    def __str__(self):
        return self.name

class CourseCategory(models.Model):
    name = models.CharField(max_length=50) 
    courses = models.ManyToManyField(Course)
    def __str__(self):
        return self.name

class News(models.Model):
    name = models.CharField(max_length=30)
    category = models.CharField(max_length=30, default='General')
    contentType = models.CharField(max_length=30, default='WORLD NEWS') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=400, default='Hi')
    def __str__(self):
        return self.name

class NewsLevel(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=400, default='')

    class Meta:
        ordering = ["level_number"]

class NewsTechnology(models.Model):
    name = models.CharField(max_length=30)
    category = models.CharField(max_length=30, default='General')
    contentType = models.CharField(max_length=30, default='TECHNOLOGY NEWS') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=400, default='Hi')
    def __str__(self):
        return self.name

class NewsTechnologyLevel(models.Model):
    news = models.ForeignKey(NewsTechnology, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=400, default='')

    class Meta:
        ordering = ["level_number"]

class NewsEntertainment(models.Model):
    name = models.CharField(max_length=30)
    category = models.CharField(max_length=30, default='General')
    contentType = models.CharField(max_length=30, default='CELEBRITY') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=400, default='Hi')
    def __str__(self):
        return self.name

class NewsEntertainmentLevel(models.Model):
    news = models.ForeignKey(NewsEntertainment, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=400, default='')

    class Meta:
        ordering = ["level_number"]

class CountryCode(models.Model):
    country = models.CharField(max_length=400, default='')
    code = models.CharField(max_length=400, default='') 

    class Meta:
        ordering = ["code"]