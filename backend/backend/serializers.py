from importlib.metadata import requires
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    class Meta:
        model = User
        fields = ("username", "password", "email", "id","first_name", "last_name")

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            email = validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("age",)

    def create(self, validated_data):
        profile = User.objects.create(
            age=validated_data["age"],
        )
        profile.save()
        return profile
    
    