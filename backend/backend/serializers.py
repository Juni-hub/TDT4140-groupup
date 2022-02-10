from importlib.metadata import requires
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password 
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("age",)

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


# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ("age", "user")

#     def create(self, validated_data):
#         profile = Profile.objects.create(
#             user = validated_data.user,
#             age = validated_data.age
#         )
#         profile.save()
#         return profile
    
 