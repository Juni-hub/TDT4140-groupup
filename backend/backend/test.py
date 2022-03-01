from json import JSONDecoder
from tokenize import group
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Group, Profile, User
from django.contrib.auth.models import User

legal_user = {
    "age":20,
    "user":{
        "username":"trondk",
        "password":"password",
        "email":"trondk@gmail.com",
        "first_name":"Trond",
        "last_name":"Kristiansen"
    }
}

illegal_user = {
    "age":17,
    "user":{
        "username":"trondk",
        "password":"password",
        "email":"trondk@gmail.com",
        "first_name":"Trond",
        "last_name":"Kristiansen"
    }
}

class UserTest(APITestCase):   
    def test_register_user(self):
        """
        Ensure we can create a new profile object.
        """
        url = reverse('register')
        data = legal_user
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
        data = illegal_user
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
        data = legal_user
        registerResponse = self.client.post(url, data, format='json')
        token = registerResponse.data["token"]
        
        #Test
        url = reverse('profile')
        response = self.client.get(url, HTTP_AUTHORIZATION = f'Token {token}').json()
        
        responseData = {
            "age":20,
            "user":{
                "id":1,
                "username":"trondk",
                "email":"trondk@gmail.com",
                "first_name":"Trond",
                "last_name":"Kristiansen"
            }
        }
        
        for key,value in responseData["user"].items():
            self.assertEqual(value,response["user"][key])

    def test_get_users(self):
        #SetUp
        url = reverse('register')
        data = legal_user
        registerResponse = self.client.post(url, data, format='json')
        token = registerResponse.data["token"]

        url = reverse('users')
        response = self.client.get(url, HTTP_AUTHORIZATION = f'Token {token}').json()
        self.assertEqual(1, len(response))
        
        
class GroupTest(APITestCase):
    def setUp(self):
        url = reverse('register')
        for j in range(0,3):
            i = ascii(j+65)
            data = {
                "age":20,
                "user":{
                    "username":i,
                    "password":i,
                    "email":f'{i}@{i}.com',
                    "profile":{"age":20},
                    "first_name":i,
                    "last_name":i
                }
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

    def test_get_groups(self):
        url = reverse("group")
        data = {
            "name":"grupp1",
            "members":[1,2]
        }
        self.client.post(url, data, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        response = self.client.get(url, None, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        self.assertEqual(len(response.data), 1)
        self.client.post(url, data, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        response = self.client.get(url, None, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        self.assertEqual(len(response.data), 2)

    def test_put_groups(self):
        url = reverse("group")
        put_url = reverse("group_detail", args=(1,))
        data = {
            "name":"grupp1",
            "members":[1,2]
        }
        put_data = {
            "description":"Vi finner på mye gøy!",
            "member_limit":"2",
            "members":[1],
            "name":"HeiHei",
            "minimum_age":18,
            "activity_date":"2022-08-01",
            "interests": [{"interest_name":"edfdw"}, {"interest_name":"zd"}],
            "tags":[{"tag_name":"CULTURAL"},{"tag_name":"CHILL"}]
        }
        self.client.post(url, data, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")
        response = self.client.put(put_url, put_data, HTTP_AUTHORIZATION = f'Token {self.token}', format="json")    
        self.assertEqual(response.status_code, status.HTTP_200_OK)