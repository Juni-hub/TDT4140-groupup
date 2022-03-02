# Run the frontend locally
To run the frontend locally, run the following commands in your terminal:
```
cd frontend
npm install
npm run dev
```
## Frontend testing  
We use cypress to test the frontend.
To open the cypress dektop application, run
```
npx cypress open
```
To run tests that require a backend, the django server needs to be started. To start the server with an empty test database, run
```
cypress/scripts/setup_test_database.sh
```
Also run this command every time you need a new test database.  
You can return to the default database by running 
```
cypress/scripts/destroy_test_database.sh
```
