'use strict';

const express = require('express');
const simpleOauthModule =  require('simple-oauth2');
const http = require('http');
const app = express();
const oauth2 = simpleOauthModule.create({
  client: {
    id: 'a1fcef8c10b2972c8fd4',
    secret: '9bc01f8a6af4383465c9b695e37a4afc7a1c638a',
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'repo',
  state: '3(#0/!~',
});

console.log(authorizationUri);

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const options = {
    code,
  };
  // http.request({
  //   method:"POST",
  //   host:"https://github.com/login/oauth/access_token",
  //   data: {"client_id":"a1fcef8c10b2972c8fd4", "client_secret":"9bc01f8a6af4383465c9b695e37a4afc7a1c638a", "redirect_url":"http://localhost:3000/success","code":code}
  // });
  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
  
});

app.get('/success', (req, res) => {
  res.send('');
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.listen(3000, () => {
  console.log('Express server started on port 3000'); // eslint-disable-line
});


// Credits to [@lazybean](https://github.com/lazybean)