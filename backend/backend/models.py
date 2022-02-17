from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    age = models.IntegerField(null=False, blank=False)

class Group(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="member_groups")
    members = models.ManyToManyField(User, related_name="admin_groups")
    name = models.CharField(max_length=50)