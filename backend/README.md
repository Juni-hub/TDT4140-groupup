# Backend

## To set up / sync models
```
python manage.py makemigrations   
python manage.py migrate 
```

## Run project
```
python manage.py runserver
```

## Make admin user
```
python manage.py createsuperuser
```

## Test project
```
python manage.py test
```

## Virtual environment  
We want to use a python venv to keep track of libraries we've installed. To initialize the venv, simply install venv 
```
pip install virtualenv 
```
Navigate to the outer backend folder and initialize the venv
```
python -m venv venv 
```
Now actiavte the vvnv
```
source venv/bin/activate
```

If you want to see the installed libraries, you can now optionally run
```
pip freeze
```

To install all the required libraries of the project, run 
```
pip install -r requirements.txt
```  
When you install a new library you need to add it to the requirements.txt file. The easiest way to do this is to overide the contents of the file with the output of pip freeze (you can just copy and paste).