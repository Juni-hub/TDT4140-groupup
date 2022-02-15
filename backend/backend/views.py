from cmath import pi
from urllib import response
from django.contrib.auth.models import User
from .serializers import UserSerializer, GetUserData
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token, created = Token.objects.get_or_create(user_id=response.data["id"])
        response.data["token"] = str(token)
        return response

class UserView(APIView):
    #Autentication-token required to access
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, request):

        #Fetching user object related to token
        user_id = Token.objects.get(key=request.auth.key).user_id
        query_set = User.objects.get(id=user_id)

        #Sends user to serializer and returning user data
        serializer = GetUserData(query_set,
                                context={'request': request},)
        return Response(serializer.data)