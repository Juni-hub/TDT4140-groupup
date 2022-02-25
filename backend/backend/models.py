from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

def imagePath(instance, filename):
    return '/'.join(['images', str(instance.name), filename])

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    age = models.IntegerField(null=False, blank=False)

    class Meta:
        verbose_name = "profile"
        verbose_name_plural = "profiles"

    def __str__(self):
        return self.user.username

class Group(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="member_groups")
    members = models.ManyToManyField(User, related_name="admin_groups")
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=imagePath, blank=True, null=True)

    def __str__(self):
        return self.name + " (" + str(len(self.members.all())) + " members)"
