Endpoint | Description | Format | Response 
--- | --- | --- |--- 
login/ | Logs a user in by supplying username and password | { username: string, password: string } | { token: string }
register/ | registers a user given profile details | { username: string, password: string, email: string  } | { token: string }