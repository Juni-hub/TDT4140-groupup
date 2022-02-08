import imp
from django.contrib import admin
from django.urls import path
from .views import createUser

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', createUser)
]
