from importlib.metadata import requires
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ("username", "password", "email", "id")

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email = validated_data["email"],
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
        fields = ("username", "email", "id")

    def create(self, validated_data):
        user = User.objects.create()
        return user