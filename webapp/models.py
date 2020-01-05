from django.db import models

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=30)
    levels = models.IntegerField(default=170)    
    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=30)
    courses = models.ManyToManyField(Course, through='StudentCourse')
    password = models.CharField(max_length=100)    
    def __str__(self):
        return self.email

class Teacher(models.Model):
     name = models.CharField(max_length=100)
     email = models.CharField(max_length=30)
     courses = models.ManyToManyField(Course, through='TeacherCourse')
     password = models.CharField(max_length=100)
     meetingLink = models.URLField(max_length=400)


class StudentCourse(models.Model):    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    level = models.IntegerField(default=170)   
    date_joined = models.DateTimeField()
    status = models.CharField(max_length=1)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, blank=True, null=True)

class TeacherCourse(models.Model):    
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course =  models.ForeignKey(Course, on_delete=models.CASCADE)
