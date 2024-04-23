from django.urls import path, include
from django.conf.urls import url
from . import views
from agora.views import Agora
from django.contrib import admin
from django.contrib.auth import views as auth_views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('agora/', Agora.as_view(app_id='77295eb8cbfb49c086f1ff4dd6322cff',  channel='teklrn_conference'), name="agora"),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('activate/<uidb64>/<token>', views.ActivateStudentView.as_view(), name="activate"),    
    path('activateT/<uidb64>/<token>', views.ActivateTrainerView.as_view(), name="activateT"),
    path('contact/', views.contact, name='contact-Page'),
    path('about/', views.about, name='about-Page'),
    path('test/', views.test, name='hi-Test-Page'),
    path('books/', views.books, name='Book-Page'),
    path('hi/', views.hi, name='hi-Page'),
    path('news/technology/', views.news, name='news-Page'),
    path('Science-and-technology-research-and-findings/news/title/', views.scitechnews, name='news-Pagescitech'),
    path('media/news/', views.medianews, name='newsmedia-Page'),
    path('technologynews/technology/', views.technologynews, name='t-news-Page'),
    path('entertainmentnews/technology/', views.entertainmentnews, name='e-news-Page'),
    path('trendingnews/technology/', views.trendingnews, name='news-Page'),
    path('info/technology/', views.info, name='info-Page'),
    path('news/technology/read/', views.newsread, name='news-read'),    
    path('entertainmentnews/technology/read/', views.entertainmentread, name='e-news-read'),    
    path('trendingnews/technology/read/', views.trendingread, name='news-read'),    
    path('technologynews/technology/read/', views.technologyread, name='news-read'),  
    path('technologies/technology/', views.gotToTechnology, name='gotToTechnology-Page'),
    path('technologies/', views.hiPre, name='hi-pre-Page'),
    path('news/', views.newsPre, name='hi-pre-Page'),
    path('financial/', views.financialPre, name='financial-pre-Page'),
    path('Science-and-technology-research-and-findings/', views.scitechPre, name='scitech-pre-Page'),
    path('Space-exploration-technologies-latest-2024/', views.scitechSpacePre, name='scitech-space-pre-Page'),
    path('latest-emerging-technologies-2024/', views.scitechLatestTechPre, name='scitech--latest-pre-Page'),
    path('media/', views.videoPre, name='hi-pre-Page'),
    path('worldnews/', views.worldNews, name='hi-pre-Page'),
    path('technologynews/', views.technologyNews, name='t-pre-Page'),
    path('entertainmentnews/', views.entertainmentNews, name='e-pre-Page'),
    path('financialnews/', views.financialNews, name='f-pre-Page'),    
    path('careers/', views.careers, name='careers-Page'),
    path('teach/', views.teach, name='teach-Page'),
    path('press/', views.press, name='press-Page'),
    path('business/', views.business, name='business-Page'),
    path('help/', views.help, name='help-Page'),
    path('terms/', views.terms, name='terms-Page'),    
    path('refund/', views.refund, name='refund-Page'),
    path('privacy/', views.privacy, name='privacy-Page'),
    path('', views.home, name='Home-Page'),
    path('getRelatedNews/',views.RelatedNewsView.as_view()),
    path('autocomplete/',views.AutoCompleteViewNew.as_view()), #Previously AutoCompleteView
    path('searchtopics/',views.AutoCompleteSearchTopicsView.as_view()),
    path('Ads.txt', views.AdsView.as_view()),
    path('ads.txt', views.AdsView.as_view()),
    path('searchtopicsnew/',views.AutoCompleteSearchTopicsViewNew.as_view()),
    path('searchtopicsnewnews/',views.AutoCompleteSearchTopicsViewNewNews.as_view()),
    path('newsContent/',views.NewsContent.as_view()),
    path('searchtopicsnewnewsForImg/',views.AutoCompleteSearchTopicsViewNewNewsForImg.as_view()),
    path('searchtopicsnewnewsForImgRelated/',views.AutoCompleteSearchTopicsViewNewNewsForImgRelated.as_view()),
    path('searchtopicsnewtrending/',views.AutoCompleteSearchTopicsViewNewTrending.as_view()),
    path('searchtopicsnewentertainment/',views.AutoCompleteSearchTopicsViewNewEntertainment.as_view()),
    path('searchtopicsnewtechnology/',views.AutoCompleteSearchTopicsViewNewTechnology.as_view()),
    path('getTechnologiesMatchingTheSearch/',views.TechnologiesMatchingTheSearchView.as_view()),
    path('getTechnologiesMatchingTheSearchNew/',views.TechnologiesMatchingTheSearchNewView.as_view()),
    path('getFianncialMatchingTheSearchNew/',views.FinancialMatchingTheSearchNewView.as_view()),
    path('getBooksMatchingTheSearchNew/',views.BooksMatchingTheSearchNewView.as_view()),
    path('getSciTechMatchingTheSearchNew/',views.SciTechMatchingTheSearchNewView.as_view()),
    path('getLatestNews/',views.GetLatestNewsView.as_view()),
    path('getMatchingTheSearchNew/',views.MatchingTheSearchNewView.as_view()),
    path('getTechnologyMatchingTheSearchNew/',views.TechnologyMatchingTheSearchNewView.as_view()),
    path('getEntertainmentMatchingTheSearchNew/',views.EntertainmentMatchingTheSearchNewView.as_view()),
    path('getVideosMatchingTheSearchNew/',views.VideosMatchingTheSearchNewView.as_view()),
    path('tmail/',views.TmailView.as_view()),
    path('getTechnologiesMatchingTheSearchWithLangNew/',views.TechnologiesMatchingTheSearchNewWithLanguageView.as_view()),
    path('getCountries/',views.CountriesView.as_view()),
    path('getLanguages/',views.LanguagesView.as_view()),
    path('getTechnologiesMatchingTheSearchFiltered/',views.TechnologiesMatchingTheSearchViewFiltered.as_view()),
    path('getNewsMatchingTheSearchRandom/',views.NewsMatchingTheSearchViewRandom.as_view()),
    path('getNewsMatchingTheSearch/',views.NewsMatchingTheSearchView.as_view()),
    path('getAllAdvertisementsForUser/',views.AllAdvertisementsForUserView.as_view()),
    path('getNewsMatchingTheSearchFiltered/',views.NewsMatchingTheSearchViewFiltered.as_view()),
    path('getEntertainmentNewsMatchingTheSearchFiltered/',views.EntertainmentNewsMatchingTheSearchViewFiltered.as_view()),
    path('getEntertainmentNewsMatchingTheSearch/',views.EntertainmentNewsMatchingTheSearchView.as_view()),
    path('getTechnologyNewsMatchingTheSearch/',views.TechnologyNewsMatchingTheSearchView.as_view()),
    path('getTechnologyNewsMatchingTheSearchFiltered/',views.TechnologyNewsMatchingTheSearchViewFiltered.as_view()),
    path('getTechnologiesForDesignations/',views.TechnologiesMatchingTheDesignationView.as_view()),
    path('checkout/',views.Checkout.as_view()),
    path('checkout_removeAdd/',views.CheckoutRemoveAdd.as_view()),
    path('getTrendingNewsForNews/',views.TrendingNewsForNews.as_view()),
    path('getEntertainmentNewsForNews/',views.EntertainmentNewsForNews.as_view()),
    path('getTechnologyNewsForNews/',views.TechnologyNewsForNews.as_view()),
    path('getSupportedDesignations/',views.SupportedDesignationsView.as_view()),
    path('loginFormForVideoAccess/',views.LoginViewForVideoAccess.as_view()),
    path('loginForm/',views.LoginView.as_view()),
    path('loginFormT/',views.LoginTView.as_view()), 
    path('loginFormBusiness/',views.LoginViewBusiness.as_view()),   
    path('book_course_form/',views.BookCourseFormView.as_view()), 
    path('bookingForm/',views.BookCourseFormView.as_view()),    
    path('checkuser/',views.CheckUserExistsView.as_view()),
    path('logout/',views.logout_view, name='logout'),
    path('logout_t/',views.logout_t_view, name='logout_t'),
    path('register_student',views.RegisterStudentView.as_view()),
    path('registerBack/', views.registerBack, name='registerBack'), 
    path('register/', views.register, name='register'), 
    path('registerT/', views.register_t, name='registerT'), 
    path('userProfile/', views.user_profile, name='user_profile'), 
    path('userProfileT/', views.user_profile_t, name='user_profile_t'), 
    path('uploadCourse/', views.upload_course, name='upload_course'), 
    path('login/', views.login_page, name='login'), 
    path('loginT/', views.login_page_t, name='loginTA'), 
    path('loginA/', views.login_page_a, name='loginA'), 
    path('loginTA/', views.login_page_t_a, name='loginT'), 
    path('accounts/', include('django.contrib.auth.urls')),
    path('back_to_landing_page/',views.LandingBackView.as_view()),
    path('back_to_landing_login_page/',views.LandingBackLoginView.as_view()),
    path('reset_password/',auth_views.PasswordResetView.as_view(template_name='webapp/resetPassword.html'), name='reset_password'),
    path('reset_password_sent/',auth_views.PasswordResetDoneView.as_view(template_name='webapp/passwordResetConfirm.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name='webapp/resetPasswordEnter.html'), name='password_reset_confirm'),
    path('reset_password_complete/', views.RedirectToLandingStudentView, name='password_reset_complete'),
    path('reset_password_t/',views.ResetPasswordTView.as_view()),
    path('login_student',views.LoginStudentView.as_view()),
    path('upload_file_using_client',views.UploadFileUsingClientView.as_view()),
    path('login_business',views.LoginBusinessView.as_view()),
    path('add_advertisements', views.AddAdvertisementsView.as_view()),
    path('redirect_to_landing_page/', views.RedirectToLandingStudentView, name='redirectToLandingStudentView'),
    path('reset_student_password',views.ResetStudentPwdView.as_view(), name='reset'),
    path('reset_trainer_password',views.ResetStudentPwdView.as_view()),
    path('book_course',views.BookCourseView.as_view()),
    path('proceed_to_pay',views.ProceedToPay.as_view()),
    path('proceed_to_checkout',views.ProceedToCheckout.as_view()),
    path('book_video',views.BookVideoView.as_view()),
    path('checkTrainer/',views.CheckTeacherExistsView.as_view()),
    path('register_teacher',views.RegisterTeacherView.as_view()),
    path('login_teacher',views.LoginTeacherView.as_view()),
    path('login_teacher_authorize',views.login_teacher_authorize, name='login_authorize'),
    path('upload_complete',views.upload_complete, name='upload_complete'),
    path('get_pending_course_assignments',views.TeacherPickCourseView.as_view()),
    path('get_associated',views.AssociatedTechView.as_view()),
    path('get_most_sought',views.MostSoughTechView.as_view()),
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
    path('chargevideo/', views.chargevideo, name='chargeVideo'), # new
]


