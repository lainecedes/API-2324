import express from 'express'; // express
import dotenv from 'dotenv'; // dotenv
import axios from 'axios'; // axios
import queryString from 'query-string'; // queryString
import cookieParser from 'cookie-parser'; // cookieParser

const port = process.env.PORT || 3000; // port
const app = express();

// dotenv configuration
dotenv.config({ path: './.env' });

// Spotify API credentials
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;


// serve static files with express.static
app.use(express.static('src'));
app.use(express.json()); // json
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // ejs
app.use(cookieParser());



// als dit werkt maak dan login page met styling en knop die naar authentication page gaat
// daarna style profile page met data, verander scopes later voor album data enzo
// style ook error page
// what to do with refresh token pagina?
// vergeet api credentials niet


// Spotify authentication

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
        var scope = 'user-read-private user-read-email user-library-read user-read-recently-played user-top-read';
      
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

// Login page
app.get('/login', (req, res) => { 
  res.render('login', { });
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

          res.cookie('refresh_token', refresh_token, { maxAge: response.data.expires_in * 1000 });
          res.cookie('access_token', access_token, { maxAge: response.data.expires_in * 1000 });


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


          // Redirect with tokens to client
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
        res.redirect('/error');
      });
  }
});


// refresh token if the old access token expires, remove that and set niew one in cookie
const refreshAccessToken = (refreshToken) => {
    return axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
      }
  })
    .then(response => {
      // Extract new access token from response
      const newAccessToken = response.data.access_token;
      return newAccessToken;
    })
    .catch(error => {
      console.error('Error refreshing access token:', error);
      throw error;
    });
};

app.get('/refresh_token', (req, res) => {

  // if refresh token cookie exists then redirect to login
    if (!req.cookies || !req.cookies.refresh_token) {
      console.log('Refresh token does not exist!');
      res.redirect('/login');
      return;
    }

    const refreshToken = req.cookies.refresh_token;
    
    // retrieved refresh token to refresh the access token
    refreshAccessToken(refreshToken)
      .then(newAccessToken => {
        // remove and add new old access token cookie
        res.clearCookie('access_token');

        res.cookie('access_token', newAccessToken, { maxAge: 1000 }); // 1000 = 1 uur tijd
        console.log('New access token:', newAccessToken);

        // ff send om te kijken of het werkt
        res.send('Access token refreshed');
      })

      .catch(error => {
        console.error('Error refreshing access token:', error);
        res.redirect('/error');
      });
});


const userProfileEndpoint = 'https://api.spotify.com/v1/me';
const tracksEndpoint = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10';

// Profile page with data
app.get('/profile', (req, res) => {
    // Retrieve access token from cookie
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        // If access token is not present in the cookie, redirect to login or handle accordingly
        console.log('Access token not present in cookie!');
        res.redirect('/login');
        return;
    }

    // For some reason I can't bundle this in 1 get request, this needs to be seperate otherwise I get issues with authorization access token
    axios.all([
            // user info data
            axios.get(userProfileEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }),

            // top 10 played tracks in 4 weeks data
            axios.get(tracksEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        ])
        .then(axios.spread((userProfileResponse, tracksResponse) => {
            const userProfileData = userProfileResponse.data;
            const tracksData = tracksResponse.data;

            console.log(userProfileData, tracksData);

            res.render('profile', { userProfileData, tracksData });
        }))
        .catch(error => {
            // Check if the error status code indicates unauthorized access
            if (error.response && error.response.status === 401) {
                // If access token is invalid, clear the access token cookie
                res.clearCookie('access_token');
                console.log('Access token invalid, cookie cleared, redirect to login');
                res.redirect('/login');
                return;
            }
            console.error('Error fetching user data from Spotify:', error);
            res.status(500).send('Error fetching user data from Spotify');
        });
});






// Start server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app; // Export express app