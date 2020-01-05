from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('contact/', views.contact, name='contact-Page'),
    path('about/', views.about, name='about-Page'),
    path('hi/', views.hi, name='hi-Page'),
    path('', views.home, name='Home-Page'),
    path('autocomplete/',views.AutoCompleteView.as_view()),
    path('checkuser/',views.CheckUserExistsView.as_view()),
    path('register_student',views.RegisterStudentView.as_view()),
    path('login_student',views.LoginStudentView.as_view()),
    path('book_course',views.BookCourseView.as_view()),
    path('checkteacher/',views.CheckTeacherExistsView.as_view()),
    path('register_teacher',views.RegisterTeacherView.as_view()),
    path('login_teacher',views.LoginTeacherView.as_view()),
    path('get_pending_course_assignments',views.TeacherPickCourseView.as_view()),
    path('teacherbooking/',views.TeacherBookCourseView.as_view()),
     path('markCompletion/',views.MarkCourseCompletionView.as_view()),
    path('get_given_trainings/',views.TeacherGivenTrainingsView.as_view()),
    path('get_inprogress_trainings/',views.TeacherInProgressTrainingsView.as_view()),
    path('get_pending_trainings/',views.TeacherPendingTrainingsView.as_view()),
    path('get_pending_student_trainings/',views.PendingStudentTrainingsView.as_view()),
    path('get_inprogress_student_trainings/',views.InprogressStudentTrainingsView.as_view()),
    path('get_completed_student_trainings/',views.CompletedStudentTrainingsView.as_view()),
    path('get_accepted_student_trainings/',views.AcceptedStudentTrainingsView.as_view()),
    path('charge/', views.charge, name='charge'), # new
]


