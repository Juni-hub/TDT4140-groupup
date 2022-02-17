from json import JSONDecoder
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Profile

class RegisterTest(APITestCase):
    def test_register_user(self):
        """
        Ensure we can create a new profile object.
        """
        url = reverse('register')
        data = {
            "username":"trondk",
            "password":"password",
            "email":"trondk@gmail.com",
            "profile":{"age":20},
            "first_name":"Trond",
            "last_name":"Kristiansen"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get().age, 20)
        user = Profile.objects.get().user
        self.assertEqual((user.username, user.email, user.first_name, user.last_name), 
            ("trondk","trondk@gmail.com","Trond","Kristiansen")
        )
        
class GetTest(APITestCase):
    def test_fetch_user(self):
        """
        Ensure we can fetch user information
        """
            #Register user
        registerUrl = reverse('register')
        data = {
            "username":"trondk",
            "password":"password",
            "email":"trondk@gmail.com",
            "profile":{"age":20},
            "first_name":"Trond",
            "last_name":"Kristiansen"
        }
        registerResponse = self.client.post(registerUrl, data, format='json').json()
        
            #Fetch user
        userUrl = reverse('user')
        token= registerResponse['token']
        response = self.client.get(userUrl, HTTP_AUTHORIZATION = f'Token {token}').json()
        
        responseData = {
            "username":"trondk",
            "email":"trondk@gmail.com",
            "id":1,
            "first_name":"Trond",
            "last_name":"Kristiansen",
            "age": 20
        }
        
        for key,value in responseData.items():
            self.assertEqual(value,response[key])
        