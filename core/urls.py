from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('api/contact/', views.submit_contact_api, name='submit_contact'),
    path('api/guestbook/', views.guestbook_api, name='guestbook_api'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('api/dashboard/actions/', views.dashboard_api, name='dashboard_api'),
]
