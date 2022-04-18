require('dotenv').config();
const express = require('express');
const axios = require('axios');
const request = require('request');
const { response } = require('express');

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


app.get('/', (req, res) => {
    res.send('Hello world');
})

/** 
 * Generates a random string containing letters and numbers
 * @param {number} length The length of the string
 * @return {string} The generated string
*/
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWQYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      }).toString());
})


app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },    
    })
        .then(response => {
            if(response.status === 200) {
                const {access_token, refresh_token} = response.data;
                const queryParams = new URLSearchParams({
                    access_token,
                    refresh_token
                }).toString();
                // Redirect to react app
                res.redirect(`http://localhost:3000/?${queryParams}`);
                // Pass token along in query params
                
            } else {
                res.redirect(`/?${new URLSearchParams({error: 'invalid token'}).toString()}`);
            }
        })
        .catch(error => {
            res.send(error);
        })   
})

// Generates new access token once token has expired
app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(`${CLIENT_ID}` + ':' + `${CLIENT_SECRET}`).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });



const port = 8888;
app.listen(port, (req, res) => {
    console.log(`Express app listening on http://localhost:${port}`);
})