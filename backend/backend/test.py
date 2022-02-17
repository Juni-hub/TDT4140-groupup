from json import JSONDecoder
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Group, Profile, User
from django.contrib.auth.models import User

class UserTest(APITestCase):   
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
        
    def test_age_check(self):
        """
        Ensure we can't create new profile objects with age under 18'
        """
        url = reverse('register')
        data = {
            "username":"trond",
            "password":"password",
            "email":"trond@gmail.com",
            "profile":{"age":17},
            "first_name":"Trond",
            "last_name":"Kristiansen"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Profile.objects.count(), 0)
        self.assertEqual(User.objects.count(), 0)

    def test_get_user(self):
        """
        Ensure we can fetch user information
        """
        #SetUp
        url = reverse('register')
        data = {
            "username":"trondk",
            "password":"password",
            "email":"trondk@gmail.com",
            "profile":{"age":20},
            "first_name":"Trond",
            "last_name":"Kristiansen"
        }
        registerResponse = self.client.post(url, data, format='json')
        token= registerResponse.data["token"]
        
        #Test
        url = reverse('user')
        response = self.client.get(url, HTTP_AUTHORIZATION = f'Token {token}').json()
        
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
        
class GroupTest(APITestCase):
    def setUp(self):
        url = reverse('register')
        for j in range(0,3):
            i = ascii(j+65)
            data = {
                "username":i,
                "password":i,
                "email":f'{i}@{i}.com',
                "profile":{"age":20},
                "first_name":i,
                "last_name":i
            }
            response = self.client.post(url, data, format="json")
        self.token = response.data["token"]
    
    def test_post_group(self):
        url = reverse("group")
        data = {
            "name":"grupp1",
            "members":[1,2]
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Group.objects.count(), 1)
        group = Group.objects.get()
        self.assertEqual(group.name, "grupp1")
        self.assertEqual(group.admin.id, 3)
        
