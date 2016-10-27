## Express-server Boilerplate

# This boiler plate is equiped with JWT and social logins such as facebook and google OAuth
# you need to have redis, and node  installed to use this guy please

#run npm install
#start the redis server. To start redis, run "redis-server"

#run mongod 
#then , run node server or 

available routes.

##routes:

## Home
# GET /
+ Response 200 (Json)
    Message: Welcome to express-server

#'/api/v1/auth/signin'
  	#.post
    
#'/api/v1/auth/signout'
  	#.get

#'/api/v1/users'
		#.get

#'/api/v1/users/:usersId'
		#.get
    #.put
 
##SIGNUP 

# POST /api/v1/auth/register
+ Request:
    + username
    + password
    + email
    + lastName
    + firstName

## Social logins/signup

# Facebook
 /auth/facebook

# Google
  /auth/google
  

