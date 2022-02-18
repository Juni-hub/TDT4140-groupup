from importlib.metadata import requires
from types import MemberDescriptorType
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password 
from .models import Profile, Group

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ("username", "password", "email", "id", "first_name", "last_name")

class ProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ("age", "user")
        
        #Validates the age field
    def validate_age(self, value):
        if value >= 18:
            return value
        raise serializers.ValidationError(
            'User must be 18 or over')
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(
            username=user_data["username"],
            first_name = user_data["first_name"],
            last_name = user_data["last_name"],
            email = user_data["email"],
        )
        user.set_password(user_data["password"])
        user.save()
        profile = Profile.objects.create(
            user=user,
            **validated_data
        )
        profile.save()
        return profile



class GroupSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Group
        fields = ("admin", "name", "members")

    def create(self, validated_data):
        members = validated_data.pop("members")
        members.append(validated_data["admin"])
        group = Group.objects.create(**validated_data)
        group.members.set(members)
        return group
