from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import RegisterSerializer
from rest_framework.views import APIView

# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'username': token.user.username})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"detail": "No token found for the user."}, status=status.HTTP_400_BAD_REQUEST)