from enum import unique
from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.forms import CharField

def imagePath(instance, filename):
    return '/'.join(['images', str(instance.name), filename])

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, related_name="profile")
    age = models.IntegerField(null=False, blank=False)

    class Meta:
        verbose_name = "profile"
        verbose_name_plural = "profiles"

    def __str__(self):
        return self.user.username

class Interest(models.Model):
    interest_name = models.CharField(max_length=30)

class Tag(models.Model):

    TAG_NAME_CHOICES = [
        ("CHILL", "Rolig"),
        ("SPORTY","Sporty"),
        ("ACADEMIC", "Akademisk"),
        ("MUSICAL", "Musikalsk"),
        ("CULTURAL", "Kulturell")
    ]
    
    tag_name = models.CharField(choices=TAG_NAME_CHOICES, max_length=30)

class Location(models.Model):

    LOCATION_NAME_CHOICES = [
        ("AGDER", "Agder"),
        ("VIKEN","Viken"),
        ("OSLO", "Oslo"),
        ("VESTFOLD_OG_TELEMARK", "Vestfold og Telemark"),
        ("VESTLAND", "Vestland"),
        ("ROGALAND", "Rogaland"),
        ("NORDLAND", "Nordland"),
        ("TROMS_OG_FINNMARK", "Troms og Finnmark"),
        ("TRONDELAG", "Trøndelag"),
        ("MORE_OG_ROMSDAL", "Møre og Romsdal"),
        ("INNLANDET", "Innlandet"),
    ]
    
    location_name = models.CharField(choices=LOCATION_NAME_CHOICES, max_length=30)

class Group(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="admin_groups")
    members = models.ManyToManyField(User, related_name="member_groups")
    name = models.CharField(max_length=50)

    description = models.TextField(null=True)
    interests = models.ManyToManyField(Interest, default=[])
    member_limit = models.PositiveIntegerField(null=True, blank=True)
    minimum_age = models.PositiveIntegerField(default=18)
    activity_date = models.DateField(null=True)
    tags = models.ManyToManyField(Tag, default=[])
    location = models.ForeignKey(Location, null=True, default=None, on_delete=models.SET_DEFAULT)

    super_liked_groups = models.ManyToManyField("self", default=[], related_name="super_liked_by_groups", symmetrical=False)
    liked_groups = models.ManyToManyField("self", default=[], related_name="liked_by_groups", symmetrical=False)

    is_gold = models.BooleanField(default=False)

    image = models.ImageField(upload_to=imagePath, blank=True, null=True)


    def __str__(self):
        return self.name + " (" + str(len(self.members.all())) + " members)"
