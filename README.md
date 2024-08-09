# ThinkTrove

## Tools used: Nodejs, expressjs, cors, mongoose, mongodb, joi , nodemon (back end) 
repo link for backend: 

## Tools used: Reactjs, Material UI 

- It is a application where you can have hints to remember things you have learn't.
- Helps to recall and revision.

## Modules
- SignUp: The email and password are validated using JOI , the email should be of correct pattern and password strength is validated , the user password is validated and hashed using bycrypt package.
- SingIn: The email and password is checked in the database if found and matched then user is logged in to the application.
- Home: The user can add the deck , add card to the deck , the card can have cardname , hint, answer and rating fields , the cards are sorted to the user based on the rating given to the card , the rating indicates the difficulty level of the card the user feels.
- Forgot Password: The user can reset the password. 
