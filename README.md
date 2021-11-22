# Backend for

[https://www.edithsdev.com/] (https://www.edithsdev.com/)

## Run 'npm install' to install node package dependencies

### Server setup includes nodemailer settings

### Backend is deployed to Heroku

## Notes

- Entire portfolio was initially built to deploy on Heroku - successfully deployed client and server sides to Heroku together with the correct buildpacks, however I ran into some problems when trying to add a custom domain for free with Heroku so split the client and server.

- Client side is now deployed with Vercel.

- Nodemailer used on contact form and emails are redirected from my email host to my main email

- Email was tricky to set up. Remember ..
- Nodemailer is using my gmail account eheidmann.dev@gmail.com
- I have an app password generated in gmail that is used in the .env file for email authorisation in Nodemailer.
- I also have an app password generated for my ionos email so all emails can be 'replied using' that email address
- Ionos emails are forwarded as well
- Ionos email is contact@edithsdev.com

- 2 step verification is needed on gmail this is why I have two app passwords as Nodemailer blocks with 2 factor verification but 'send as' needs it to work properly.
