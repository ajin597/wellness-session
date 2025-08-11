from django.urls import path
from .views import RegisterView, MeView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),   
    path('me/', MeView.as_view(), name='me'),                     
    path('login/', LoginView.as_view(), name='custom-login'),     
]
