from importlib.metadata import requires
from types import MemberDescriptorType
from wsgiref.validate import validator
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password 
from .models import Interest, Location, Profile, Group, Tag

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

class InterestSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Interest
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = "__all__"

class LocationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Location
        fields = "__all__"

class GroupSerializer(serializers.ModelSerializer):

    interests = InterestSerializer(many=True)
    tags = TagSerializer(many=True)
    location = LocationSerializer()

    
    expanded_members = serializers.SerializerMethodField()
    
    def get_expanded_members(self,instance):
        serializer = UserSerializer(instance.members.all(), many = True)
        return serializer.data
        
    class Meta: 
        model = Group
        fields = "__all__"

    def create(self, validated_data):
        tags = self.get_tags_from_data(validated_data)
        interests = self.get_interests_from_data(validated_data)
        location = self.get_location_from_data(validated_data)
        members = validated_data.pop("members")
        group = Group.objects.create(**validated_data)
        group.members.set(members)
        group.interests.set(interests)
        group.location = location
        group.tags.set(tags)
        return group
    
    def update(self, instance, validated_data):
        instance.interests.set(self.get_interests_from_data(validated_data))
        instance.tags.set(self.get_tags_from_data(validated_data))
        instance.location = self.get_location_from_data(validated_data)
        super().update(instance, validated_data)
        instance.save()
        return instance
        
    def get_interests_from_data(self, validated_data):
        if "interests" in validated_data:
            interests = []
            for interest in validated_data.pop("interests"):
                interest_obj, created = Interest.objects.get_or_create(interest_name=interest["interest_name"])
                interests.append(interest_obj.id)
            return interests
        return []

    def get_tags_from_data(self, validated_data):
        if "tags" in validated_data:
            tags = []
            for tag in validated_data.pop("tags"):
                tag_obj, created = Tag.objects.get_or_create(tag_name=tag["tag_name"])
                tags.append(tag_obj.id)
            return tags
        return []

    def get_location_from_data(self, validated_data):
        if "location" in validated_data:
            location = validated_data.pop("location")
            location_obj, created = Location.objects.get_or_create(location_name=location["location_name"])
            return location_obj 
        return None 

    # def validate(self, data):
    #     member_limit = math.inf
    #     minimum_age = 18
    #     members = []
    #     admin = None
    #     if self.instance:
    #         if self.instance.member_limit:
    #             member_limit = self.instance.member_limit 
    #         if self.instance.members:
    #             members = self.instance.members.all()
    #         if self.instance.minimum_age:
    #             minimum_age = self.instance.minimum_age 
    #         admin = self.instance.admin
    #     if "member_limit" in data:
    #         member_limit = data["member_limit"]
    #     if "members" in data:
    #         members = data["members"]
    #     if "minimum_age" in data:
    #         minimum_age = data["minimum_age"]
    #     if "admin" in data:
    #         admin = data["admin"]

    #     print(members)
    #     print(admin)
            
    #     if len(set(members+[admin]))>member_limit:
    #         raise serializers.ValidationError("Memberlimit violated")

    #     for user in members:
    #         if user.profile.age < minimum_age:
    #             raise serializers.ValidationError("Some users violate age limit")
    #     return data
    
