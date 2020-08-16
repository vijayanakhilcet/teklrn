from django.urls import path, include
from django.conf.urls import url
from . import views
from agora.views import Agora
from django.contrib import admin



urlpatterns = [
    path('admin/', admin.site.urls),
    path('agora/', Agora.as_view(app_id='77295eb8cbfb49c086f1ff4dd6322cff',  channel='teklrn_conference'), name="agora"),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('activate/<uidb64>/<token>', views.ActivateStudentView.as_view(), name="activate"),    
    path('activateT/<uidb64>/<token>', views.ActivateTrainerView.as_view(), name="activateT"),
    path('contact/', views.contact, name='contact-Page'),
    path('about/', views.about, name='about-Page'),
    path('hi/', views.hi, name='hi-Page'),
    path('careers/', views.careers, name='careers-Page'),
    path('teach/', views.teach, name='teach-Page'),
    path('press/', views.press, name='press-Page'),
    path('business/', views.business, name='business-Page'),
    path('help/', views.help, name='help-Page'),
    path('terms/', views.terms, name='terms-Page'),
    path('refund/', views.refund, name='refund-Page'),
    path('privacy/', views.privacy, name='privacy-Page'),
    path('', views.home, name='Home-Page'),
    path('autocomplete/',views.AutoCompleteView.as_view()),
    path('loginForm/',views.LoginView.as_view()),
    path('loginFormT/',views.LoginTView.as_view()),    
    path('book_course_form/',views.BookCourseFormView.as_view()), 
    path('bookingForm/',views.BookCourseFormView.as_view()),    
    path('checkuser/',views.CheckUserExistsView.as_view()),
    path('logout/',views.logout_view, name='logout'),
    path('register_student',views.RegisterStudentView.as_view()),
    path('register/', views.register, name='register'), 
    path('registerT/', views.register_t, name='registerT'), 
    path('login/', views.login_page, name='login'), 
    path('loginT/', views.login_page_t, name='loginT'), 
    path('accounts/', include('django.contrib.auth.urls')),
    path('back_to_landing_page/',views.LandingBackView.as_view()),
    path('reset_password/',views.ResetPasswordView.as_view()),
    path('reset_password_t/',views.ResetPasswordTView.as_view()),
    path('login_student',views.LoginStudentView.as_view()),
    path('reset_student_password',views.ResetStudentPwdView.as_view(), name='reset'),
    path('reset_trainer_password',views.ResetStudentPwdView.as_view()),
    path('book_course',views.BookCourseView.as_view()),
    path('checkTrainer/',views.CheckTeacherExistsView.as_view()),
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


