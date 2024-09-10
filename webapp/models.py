from django.db import models
from django.contrib.auth.models import User
from phone_field import PhoneField
from django.utils import timezone 
from datetime import timedelta



# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100, default='Hi')  
    levels = models.IntegerField(default=170)    
    category = models.CharField(max_length=100, default='Java')
    contentType = models.CharField(max_length=40, default='Tech') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    def __str__(self):
        return self.name

#extend user model
class Student(models.Model):
    email = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time_zn = models.CharField(max_length=30)
    courses = models.ManyToManyField(Course, through='StudentCourse')
    business_name=models.CharField(max_length=60, default='Default')
    advertisement_count=models.IntegerField(default=0) 
    cust_id=models.CharField(max_length=50, blank=True, null=True)
    one_click = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username


class Teacher(models.Model):
     email = models.CharField(max_length=100)
     dob = models.DateField(max_length=8)     
     user = models.OneToOneField(User, on_delete=models.CASCADE)
     phone = PhoneField(blank=True, help_text='Contact phone number')
     time_zn = models.CharField(max_length=30)
     courses = models.ManyToManyField(Course, through='TeacherCourse')
     meetingLink = models.URLField(max_length=400)
     is_teklrn_authorized = models.BooleanField(default=False)

class StudentAds(models.Model):    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    ad_name = models.CharField(max_length=1000)
    payed = models.BooleanField(default=False)  
    expiry_date = models.DateTimeField(default=timezone.now()+timedelta(days=30))


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
    description = models.CharField(max_length=1000)
    rating = models.IntegerField(default=4)
    reviewCount = models.IntegerField(default=46739)
    videoPresent = models.BooleanField(default=False)
    videoFree = models.BooleanField(default=0)
    videoLink =  models.CharField(max_length=400, default='Hi')
    class Meta:
        ordering = ["level_number"]

class CareerRoles(models.Model):
    name = models.CharField(max_length=100) 
    courses = models.ManyToManyField(Course)
    def __str__(self):
        return self.name

class CourseCategory(models.Model):
    name = models.CharField(max_length=50) 
    courses = models.ManyToManyField(Course)
    def __str__(self):
        return self.name
    
class Books(models.Model):
    name = models.CharField(max_length=1000)
    category = models.CharField(max_length=40, default='General')
    imageLink =  models.CharField(max_length=1000, default='Hi')
    pdf_link =  models.CharField(max_length=1000, default='Hi')
    def __str__(self):
        return self.name

class News(models.Model):
    name = models.CharField(max_length=1000)
    category = models.CharField(max_length=40, default='General')
    contentType = models.CharField(max_length=40, default='WORLD NEWS') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=1000, default='Hi')
    def __str__(self):
        return self.name

class NewsLevel(models.Model):
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=1000, default='')

    class Meta:
        ordering = ["level_number"]

class NewsTechnology(models.Model):
    name = models.CharField(max_length=10000)
    category = models.CharField(max_length=100, default='General')
    contentType = models.CharField(max_length=100, default='TECHNOLOGY NEWS') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=1000, default='Hi')
    def __str__(self):
        return self.name

class NewsTechnologyLevel(models.Model):
    news = models.ForeignKey(NewsTechnology, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=1000, default='')

    class Meta:
        ordering = ["level_number"]

class NewsEntertainment(models.Model):
    name = models.CharField(max_length=1000)
    category = models.CharField(max_length=100, default='General')
    contentType = models.CharField(max_length=100, default='CELEBRITY') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=1000, default='Hi')
    def __str__(self):
        return self.name

class NewsEntertainmentLevel(models.Model):
    news = models.ForeignKey(NewsEntertainment, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=1000, default='')

    class Meta:
        ordering = ["level_number"]

class NewsFinancial(models.Model):
    name = models.CharField(max_length=1000)
    category = models.CharField(max_length=100, default='General')
    contentType = models.CharField(max_length=100, default='FINANCIAL [en]') # Tech - Certification Course, Edu - Education Content, General - General Video on a topic .
    imageLink =  models.CharField(max_length=1000, default='Hi')
    def __str__(self):
        return self.name

class NewsFinancialLevel(models.Model):
    news = models.ForeignKey(NewsFinancial, on_delete=models.CASCADE)
    level_number = models.IntegerField(default=1)    
    description = models.TextField(max_length=None, default='Hi')
    imageLink =  models.CharField(max_length=1000, default='')

    class Meta:
        ordering = ["level_number"]

class CountryCode(models.Model):
    country = models.CharField(max_length=400, default='')
    code = models.CharField(max_length=400, default='') 

    class Meta:
        ordering = ["code"]

class Language(models.Model):
    name = models.CharField(max_length=30)
    def __str__(self):
        return self.name

class Country(models.Model):
    name = models.CharField(max_length=90)
    def __str__(self):
        return self.name

class NewsLinks(models.Model):
    link = models.CharField(max_length=400)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, default='NEWS')
    def __str__(self):
        return self.link
        
class AllNewsLinks(models.Model):
    link = models.CharField(max_length=10000)
    newLinks = models.ForeignKey(NewsLinks,
     on_delete=models.CASCADE)
    def __str__(self):
        return self.link

class Person(models.Model): 
    name = models.CharField(max_length=400)
    designation = models.CharField(max_length=400)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    instagram = models.CharField(max_length=400, default='')
    facebook = models.CharField(max_length=400, default='')
    twitter = models.CharField(max_length=400, default='')
    def __str__(self):
        return self.name
        
class PersonVideoLinks(models.Model): 
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    link = models.CharField(max_length=10000, default='')
    imgLink = models.CharField(max_length=10000, default='')
    txt = models.CharField(max_length=10000, default='')

    def __str__(self):
        return self.link

class NewsSearchUrls(models.Model): 
    url = models.CharField(max_length=1000, default='')
    rule = models.CharField(max_length=5, default='')
    def __str__(self):
        return self.url

class DailyNewsVideos(models.Model): 
    link = models.CharField(max_length=1000, default='')
    person = models.CharField(max_length=100, default='')
    imgLink = models.CharField(max_length=1000, default='')
    txt = models.CharField(max_length=1000, default='')

    def __str__(self):
        return self.link
    
class UrlLink(models.Model):
    name = models.CharField(max_length=10001)
    para = models.CharField(max_length=10000)
    def __str__(self):

        return self.name
    
class RelatedNews(models.Model): 
    NewsLink = models.ForeignKey(UrlLink, on_delete=models.CASCADE)
    imgLink = models.CharField(max_length=10001, default='')
    txt = models.CharField(max_length=10000, default='')
    def __str__(self):
        return self.txt  
    
class FinancialRelatedNews(models.Model): 
    url = models.CharField(max_length=10001, default='')
    imgLink = models.CharField(max_length=10001, default='')
    txt = models.CharField(max_length=10000, default='')
    def __str__(self):
        return self.txt
    
class RandomTechNews(models.Model): 
    txt = models.CharField(max_length=10000)
    def __str__(self):
        return self.txt
    
