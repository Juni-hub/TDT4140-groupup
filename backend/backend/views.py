from cmath import pi
import json
from functools import partial
from operator import eq
from tokenize import group
from urllib import response
from django.contrib.auth.models import User
from django.http import Http404
from .models import Group, Interest, Location, Profile, Tag
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
        data["members"].append(user_id)
        serializer = GroupSerializer(data=data, partial=True)
        if serializer.is_valid():
            group = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        queryset = request.user.member_groups
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data) 

class AllGroupsView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        group = self.get_object(pk)
        queryset = Group.objects.all()
        serializer = GroupSerializer(queryset.exclude(pk=group.id), many=True)
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

class LocationView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get(self, _):
        return Response(Location.location_name.field.choices)

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

class LikeView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, _, pk):
        group = self.get_object(pk)
        queryset = group.liked_groups.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        if pk==request.data["liked_group_id"]:
            return Response("It is not possible to like a group as the same group", status=status.HTTP_404_NOT_FOUND)
        liker_group = self.get_object(pk)
        data = {"liked_groups":[request.data["liked_group_id"]]+list(map(lambda group: group.id, list(liker_group.liked_groups.all())))}
        serializer = GroupSerializer(liker_group, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

class SuperLikeView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, _, pk):
        group = self.get_object(pk)
        if not group.is_gold:
            return Response("A non-gold group has no superlikes", status=status.HTTP_404_NOT_FOUND)
        queryset = group.super_liked_groups.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        if pk==request.data["super_liked_group_id"]:
            return Response("It is not possible to superlike a group as the same group", status=status.HTTP_404_NOT_FOUND)
        liker_group = self.get_object(pk)
        if not liker_group.is_gold:
            return Response("A non-gold group can not superlike", status=status.HTTP_404_NOT_FOUND)
        data = {"super_liked_groups":[request.data["super_liked_group_id"]]+list(map(lambda group: group.id, list(liker_group.super_liked_groups.all())))}
        serializer = GroupSerializer(liker_group, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

class AllSuperLikesView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, _, pk):
        group = self.get_object(pk)
        if not group.is_gold:
            return Response("A non-gold group can not see superlikes", status=status.HTTP_404_NOT_FOUND)
        queryset = group.super_liked_by_groups.all()
        serializer = GroupSerializer(queryset, many=True)
        return Response(serializer.data)

class MatchView(APIView):
    authentication_classes = (TokenAuthentication,) # Add this line
    permission_classes = (IsAuthenticated,)       

    def get_object(self, pk):
        try:
            return Group.objects.get(id=pk)
        except Group.DoesNotExist:
            raise Http404

    def get(self, _, pk):
        group = self.get_object(pk)
        liked = (group.liked_groups.all() | group.super_liked_groups.all())
        liked_by = (group.liked_by_groups.all() | group.super_liked_by_groups.all())
        serializer = GroupSerializer((liked & liked_by), many=True)
        return Response(serializer.data)
