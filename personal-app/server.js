import express from 'express'; // express
import dotenv from 'dotenv'; // dotenv
import axios from 'axios';
import queryString from 'query-string';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 3000; // port
const app = express();

// dotenv configuration
dotenv.config({ path: './.env' });

// Spotify API credentials
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;



// de static files met express.static
app.use(express.static('personal-app'));
app.use(express.json()); //For JSON requests
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // ejs view engine
app.use(cookieParser());


const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

var stateKey = 'spotify_auth_state';

app.get('/', (req, res) => {
  // Check if access token already exists in cookie
  if (req.cookies && req.cookies.access_token) {
    // Access token exists, perform appropriate action (e.g., redirect to a different route)
    res.redirect('/profile');
    console.log(req.cookies, req.cookies.access_token);
  } else {
    // Access token doesn't exist, initiate authorization flow
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';
  
    res.cookie(stateKey, state);
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
      }));
  }
});


app.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      queryString.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      params: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
      }
    };

    // Make request to exchange code for token
    axios.post(authOptions.url, queryString.stringify(authOptions.params), {
        headers: authOptions.headers
      })
      .then(response => {
        if (response.status === 200) {
          var access_token = response.data.access_token;
          var refresh_token = response.data.refresh_token;

          res.cookie('access_token', access_token, { maxAge: response.data.expires_in * 1000 }); // Set the cookie's max age to token's expiration time


          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            json: true
          };

          // Use the access token to access the Spotify Web API
          axios.get(options.url, {
              headers: options.headers
            })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error('Error accessing Spotify Web API:', error);
            });

          // Redirect with tokens to the client
          res.redirect('/#' +
            queryString.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            queryString.stringify({
              error: 'invalid_token'
            }));
        }
      })
      .catch(error => {
        console.error('Error exchanging code for token:', error);
        res.redirect('/error'); // Redirect to error page or handle error accordingly
      });
  }
});


app.get('/profile', (req, res) => {
  // Retrieve access token from cookie
  const accessToken = req.cookies.access_token;
  // Pass the access token to the profile template for rendering

  console.log(accessToken);
  res.render('profile', { accessToken });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// export default app; // Export express app
