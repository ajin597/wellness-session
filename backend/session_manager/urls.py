from django.urls import path
from .views import PublicSessionsView, MySessionsView, MySessionDetailView, SaveDraftSession, PublishSession

urlpatterns = [
    path('', PublicSessionsView.as_view(), name='public-sessions'),        
    path('my/', MySessionsView.as_view(), name='my-sessions'),              
    path('my/<int:pk>/', MySessionDetailView.as_view(), name='my-session'),
    path('my/save-draft/', SaveDraftSession.as_view(), name='save-draft'),  
    path('my/publish/', PublishSession.as_view(), name='publish'),          
]
