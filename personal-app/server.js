import 'dotenv/config';
import express from 'express'; // express
import dotenv from 'dotenv'; // dotenv
import axios from 'axios';
import queryString from 'query-string';

// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // node-fetch
const port = process.env.PORT || 3000; // port
const app = express();

// dotenv configuration
dotenv.config({ path: './.env' });

// const apiKey = process.env.API_KEY; // retrieve API key from .env file

// Spotify API credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.set('view engine', 'ejs'); // ejs view engine


// de static files met express.static
app.use(express.static('personal-app'));
app.use(express.json()); //For JSON requests
app.use(express.urlencoded({ extended: true }));



// app.get('/', async (req, res) => {
//     let url = `https://www.rijksmuseum.nl/api/nl/collection?key=${apiKey}&involvedMaker=Rembrandt+van+Rijn`;
    
//     let options = {
//         method: 'GET',
//     };

//     let collections;

//     // let fetch wait to avoid not defined error
//       await fetch(url, options)
//       .then((res) => res.json())
//       .then((data) => {
//         collections = data;
//       })
//       .catch((err) => {
//           console.log(`error ${err}`);
//     });
//     res.render('index', { collections: collections });
// });

app.get('/', (req, res) => {
  res.send('<a href="/login">Login with Spotify</a>');
});

// Redirect user to Spotify authorization page
app.get('/login', (req, res) => {
  const queryParams = queryString.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: 'user-read-private user-read-email', // Add any necessary scopes
      redirect_uri: REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Callback route for Spotify redirection
app.get('/callback', (req, res) => {
  const { code } = req.query;

  axios.post('https://accounts.spotify.com/api/token', queryString.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
  }))
  .then(response => {
      const { access_token } = response.data;

      return axios.get('https://api.spotify.com/v1/me', {
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      });
  })
  .then(profileResponse => {
      const userProfile = profileResponse.data;
      res.json(userProfile);
  })
  .catch(error => {
      console.error('Error exchanging authorization code for access token:', error.response.data);
      res.status(500).send('Error exchanging authorization code for access token');
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; // Export express app



