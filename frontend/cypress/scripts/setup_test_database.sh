#Assuming makemigrations have been run successfully
cd ../../../backend
export DJANGO_DATABASE='test'
rm test_db.sqlite3
./manage.py migrate
./manage.py runserver