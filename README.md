# mern-shareplaces

This is a social web application like instagram where you can share places that you have visited in the past.

## Technologies Used :-
    - Node.js
    - Express.js 
    - MongoDB 
    - ReactJS library.

## How to run the application :-
 1. clone the repository.
 2. open the frontend and backend in separate windows in your editor(like VSCode).
 3. install the required dependencies by running 'npm install' in both workspace.
 4. For backend hosting, I have used 'heroku'.To know how to deploy your API.(https://id.heroku.com/) create app and follow instructions.
 5. For frontend static hosting, I have used firebase. To know how to deploy click here (https://firebase.google.com/docs/hosting/quickstart)
 6. You have to change the required environment variables in '.env.production' in frontend.
 9. for DATABASE add your credentials on Heroku or in 'nodemon.json' if hosting locally.
 7. If you are testing locally then '.env' instead.
 8. In frontend before 'firebase deploy' make sure to save changes and run 'npm run build' before.
 
## Some dependencies used :-
  - bcrypt for password encryption & hashing.
  - jsonwebtoken for creation of Token using payloads as email and userId
  - mongoose for managing mongodb commands efficiently.
  - multer for fileStorage 'Upload Image'
  
## Features :-
 1. User can view the place on google map, fetching the loaction coordinates from place address.
 2. Only creators can make the changes to their added places.
 3. JWT_Token Validation and expiration timeout for secure user authentication.
 4. Image Upload for User's Profile & Place Image. (jpg,png supported)
 5. Auto login on refreshing and logout after token's expiration.
 6. Proper Validation for User entered Data.
 
 ### LoggedIn HomePage 👇
 ![Screenshot (154)](https://user-images.githubusercontent.com/79076537/113171357-03eabe00-9265-11eb-817c-4f91188bbf41.png)
 
 ### Shared Places 👇
 ![Screenshot (155)](https://user-images.githubusercontent.com/79076537/113171724-63e16480-9265-11eb-85a7-ae3ef1582db9.png)


 
 
