from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Session
from .serializers import SessionSerializer

class PublicSessionsView(generics.ListAPIView):
    queryset = Session.objects.filter(is_published=True).order_by('-updated_at')
    serializer_class = SessionSerializer
    permission_classes = [permissions.AllowAny]

class MySessionsView(generics.ListAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Session.objects.filter(owner=self.request.user).order_by('-updated_at')

class MySessionDetailView(generics.RetrieveAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Session.objects.filter(owner=self.request.user)

class SaveDraftSession(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        data = request.data.copy()
        session_id = data.get('id')
        if session_id:
            try:
                session = Session.objects.get(id=session_id, owner=request.user)
            except Session.DoesNotExist:
                return Response({'detail':'Not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = SessionSerializer(session, data=data, partial=True)
        else:
            serializer = SessionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(owner=request.user, is_published=False)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublishSession(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        session_id = request.data.get('id')
        try:
            session = Session.objects.get(id=session_id, owner=request.user)
            session.is_published = True
            session.save()
            return Response({'detail':'Session published'})
        except Session.DoesNotExist:
            return Response({'detail':'Not found'}, status=status.HTTP_404_NOT_FOUND)
