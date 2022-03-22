from cmath import pi
import json
from functools import partial
from operator import eq
from tokenize import group
from urllib import response
from django.contrib.auth.models import User
from django.http import Http404
from .models import Group, Interest, Profile, Tag
from .serializers import InterestSerializer, UserSerializer, ProfileSerializer, GroupSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import status


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token, created = Token.objects.get_or_create(user_id=response.data["user"]["id"])
        response.data["token"] = str(token)
        return response

class GroupView(APIView):
    #Autentication-token required to access
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def post(self, request):
        data = request.data
        user_id = Token.objects.get(key=request.auth.key).user_id
        data["admin"] = user_id
        serializer = GroupSerializer(data=data, partial=True)
        if serializer.is_valid():
            group = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        queryset = request.user.member_groups
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data) 
    
class GroupDetailView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        group = self.get_object(pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)

    def put(self, request, pk):
        data = request.data
        if "JSON" in request.data and (not "image" in json.loads(request.data["JSON"]).keys()):
            data = json.loads(request.data["JSON"])
        group = self.get_object(pk)
        serializer = GroupSerializer(group, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            #print(serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class ProfileView(APIView):
    #Autentication-token required to access
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, request):
        #Fetching user object related to token
        queryset = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(queryset)
        return Response(serializer.data)

class TagView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, _):
        return Response(Tag.tag_name.field.choices)

class InterestView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, _):
        queryset = Interest.objects.all()
        serializer = InterestSerializer(queryset, many=True)
        return Response(serializer.data)

class UsersView(APIView):
    #Autentication-token required to access
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, request):
        #Fetching user object related to token
        queryset = Profile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)