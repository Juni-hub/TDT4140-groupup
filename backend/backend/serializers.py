from importlib.metadata import requires
from types import MemberDescriptorType
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password 
from .models import Profile, Group

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("age",)
        
        #Validates the age field
    def validate_age(self, value):
        if value >= 18:
            return value
        raise serializers.ValidationError(
            'User must be 18 or over')

class UserSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer()

    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ("username", "password", "email", "id", "first_name", "last_name", "profile")

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(
            username=validated_data["username"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            email = validated_data["email"],
        )
        Profile.objects.create(
            user=user,
            **profile_data
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class GetUserData(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ("username", "email", "id", "first_name", "last_name")

    def create(self, validated_data):
        user = User.objects.create()
        return user


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
