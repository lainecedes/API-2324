# API 2024
This course is about application programming interfaces (APIs) and their use in multiple web services and web apps, for both adding additional functionality and using information from different datasets.

In these 4 weeks, I created a web app with an suitable concept that:
- Is built with server side code
- Is fully functional and interactive with multiple pages, and is viewable online
- Uses multiple APIs in the form of Web APIs and Content APIs
- Has an engaging user experience or enhanced and nicely designed content/styling
- Does not include frameworks such as React, Vue, Angular, Svelte, etc.

## Concepts
I had a few ideas that I could use as a concept based on the API's that were available online and wanted to try out:

- A Pinterest style doom scrolling app with the Rijksmuseum API
- An Art Comparison tool with the Rijksmuseum API
- Something with the Spotify API. I thought of maybe making a most played albums/songs app that's viewed in a art gallery
- Or the Dribbble API: the same Pinterest style doom scroll app but with Dribble profile data

I've worked with content API's before, such as the Nookipedia API, and these are mainly REST API's. I wanted to challenge myself by trying out an API that has oAuth, so I went with the Spotify based API instead.

## Music Gallery

Music Gallery is a web app where you can see your top 10 listened tracks in a month, and get random playlists based on these top 10 tracks as a recommendation to let you try out and discover different tracks that you might like! This recommended playlist can also be shared with others as a link through devices and browsers that support it.

<img width="1429" alt="Music Gallery Preview" src="https://github.com/lainecedes/API-2324/assets/65594330/0ac4668c-55ee-4c74-b301-da5533f226e1">

### Features
- Authentication using your Spotify account
- Looks at your top 10 most playes tracks in a time span of 4 weeks
- In the gallery, you can get small details about the track name and artists that performed it
- In the gallery, clicking on a cover will give you an audio preview of that song (due to grid problems, no ::active state is available yet)
- Toggle button in the header will show you a recommended generated playlist based on the top 10 tracks in the gallery. Playlist is randomly generated and different each time you refresh the page
- Same as in the gallery, you can click on the cover and get an audio preview of that track.
- Playlist creation with your 10 recommended tracks
- Playlist with tracks are generated in the end with the Spotify iFrame API
- Sharing playlist with the Web Share API, if your browser supports it (Firefox does not! I noticed.)


#### API's and libraries used

- Spotify Web API
- Spotify iFrame API
- Web Share API
- GSAP library for cool animation effects
- Lenis for smooth scrolling


## Installation

This project is built with Node.js and npm to install packages, and Vite to build.
This app is also online, on [Music Gallery](lainecedes-music-gallery.onrender.com), but you can also open it locally on your pc with these steps here:

### 1. Cloning repo
First, clone your repo with HTTPS:
```git clone https://github.com/lainecedes/API-2324.git```

### 2. Install Node.js and npm
In the directory on your terminal, install all necessary dependencies that the project is dependent on (otherwise it won't work!)

``` $ npm install ```
``` $ node install ```
``` $ node -version```

### 3. Start application
Start the application by running the line in your terminal:
``` $ npm start ```

### 4. Launch in browser
Launch the app in your browser using
``` localhost:3000 ```


## The Process 

### Week 1 
In this week, I tried to build my app based on the template that was already there from the original (I forked this project). The learning curve was too steep for me, so I switched from tinyhttp and Liquid to Express.js and EJS. I wanted to keep Vite, so I reorganized my directory with Vite still included. I then downloaded the necessary packages that I wanted to use for setup and routing and then started writing the code for the Spotify authorization flow.

Spotify implements the OAuth 2.0 authorization framework.
This as a whole refers to the process of granting a user or application access permissions to Spotify data and features.
The flow in short looks like this:

1. The end user matches the Spotify user. They grant access to the protected resources that Spotify has (so, playlists, account information, listening history and more)
2. The app (Music Gallery) is the client that requests access to these protected resources.
3. The server hosts these resources, and provides authentication and authorization using OAuth 2.0.
4.  Server which hosts the protected resources and provides authentication and authorization via OAuth 2.0.

The access to these resources is determined by one or several scopes. With these, you can access specific kinds of data.

Music Gallery uses profile data, listening history for top 10 tracks and modifying playlists to get a recommended playlists. These are the scopes that I needed to use: 
```
var scope = 'user-read-private user-read-email user-library-read user-read-recently-played user-top-read playlist-modify-public playlist-modify-private';
```
The authorization process also requires: a client ID and a client secret. These are valid client credentials and need to be generated in order to then fetch the data. Once this is done, the server issues an access token, which is used to make these API fetch calls.


#### Feedback week 1 - Declan 
In the feedback convo, I presented my concept to Declan and wrote a bit of the authorization process, which worked surprisingly fast, so I was happy with it. I also made a /refresh_token route where I could make another one in case I had some issues and needed to generate another one, and it worked. I also had a issue where I generated these tokens, but wasn't stored anywhere else for further use, so I got the feedback from Declan that I could store this in a cookie to prevent this loss. This worked, and everytime I wanted to make calls on routes, I could use this line for the headers and authorize:

```
const accessToken = req.cookies.access_token;
```


### Week 2
Since the flow worked in the first week, In the second week, I made some progress with the first styling. I wanted to make a gallery, and I used grid styling to then load in the first top 10 covers. It turned out pretty good! I also tried to deploy this on Vercel to see if I got any issues, and it did: I had some errors with an invalid REDIRECT_URI.

The thing with Spotify is, to make the /callback, you have to put the localhost:3000/callback line in the Spotify app dashboard in order to get the authorization page for the user to show up. This worked locally, but not online, with Vercel. I did some troubleshooting and research and it turned out that in order for it to be deployed online, you had to add another rule with your domain and then put the callback behind, example:
- lainecedes-vercel-link.com/callback

I tried this and it also didn't work.. Then I figured it was a thing with dynamic REDIRECT_URI's, one for development, and one for production. I also wrote some code, and added the envs also in Vercel, and nothing.
Eventually I gave up (Note: Vercel also NEVER works for me for a reason) and went looking for alternatives instead.

#### Feedback week 2 - Cyd
I showed my progress (and concept) to Cyd, and she liked the gallery styling, and it reminded her of a site that had the same styling (Codrops, Tympanus). She gave me the site as inspiration and that's where I decided to use GSAP and Lenis, because these libraries were used to make the cool effects. I was a bit scared that this also would be a huge learning curve, but I tried it out and Cyd wanted to give a workshop in the 3rd week, so no worries.

![concept_image](https://github.com/lainecedes/API-2324/assets/65594330/66621073-8374-47bb-9f1f-8c91c684ee3e)


### Week 3
In this week, I did more styling, followed Cyd's GSAP workshop and made progress. I had the following tasks for myself: 
- Add Web Share API, generate playlist and get the link for use with that API
- Trying to move my data van server side to client side for my recommendedButton toggle. 
If the button is toggles,  trackData should be changed to recommendedData. I tried this (didn't work) and the I got multiple rate limits.. which meant that I was making too many requests and had to make another app again, with different credentials. So I changed my idea, and made it so that if the button is toggled, another section is shown with the already rendered recommendedData.

#### Hardcoding track ID's to dynamic
For a while, I had hardcoded the track IDs to see if the API fetch worked. This worked, but I suddenly had the thought that, if someone else wants to use my app and wants her or his recommended tracks, they will get tracks based on IDs of MY recommended tracks. (a nightmare if you like jazz and suddenly drum n' bass and hard electronic tracks would come up...) So I had to make this dynamic.

This was the hardcoded code with my top tracks

```
const topTracksIds = [
  '51uRkSahJICiVwrPe7GgzY',
  '2586qpfMle1fZxOkzffOjU',
  '3hQSct6Ay5azm9dfFxHixY',
  '64Kw68jjKqqYK5hQrCkrVT',
  '1SySDyIJAX3XsI4UVc5hOZ'
];
```
So with this, I had created 3 separate API fetch calls (userProfile, Tracks and Recommendations). But I wanted the dynamic IDs in the global scope so I could use that everywhere. I didn't know if this could be possible but it didn't work anyways, so I changed the API fetch call:

- From 1 axios.all array with 3 calls (userProfile, tracksData, recommendationsData), 
- to 1 axios.all array with 2 calls (userProfile, tracksData), and if the response from both is ok, 
- that it can only then make the call from recommendationsData. 

So here I already had the ID data during the first call, and I could put it in a variable and make another call without it giving an error.


### Feedback week 2 - Declan + extra's
I tried to add my second API, the Web Share API, for sharing the playlist link to others. For this, I wanted to pass the playlist link and ID to my client-side server code. and had some issues with this.


I had a createPlaylist function from Spotify and made this outside all routes so you could access them everywhere. I added that to my /playlist-added route and some code in EJS, so when you clicked on button to /playlist-added, you get a playlist and that it has been added. I had created a string with the id of the playlist and wanted to pass that along to the client side, and make a post request there, only thing I got was not only the string, but the ENTIRE HTML document. 

I was lost and asked Declan for help and his advice was to just handle this function in my /profile route, and instead make a form submission on my EJS template, where I pass these data values as a redirect (that are in my /profile already and generated with createPlaylist) with query parameters. This made a lot of sense, and I didn;t need to write any excess client side code and just reserve that for things like styling and libraries. So it now looks like this:

profile.ejs:
```
<form action="/createPlaylist" method="POST">
          <input type="hidden" name="recommendedUris" value="<%= JSON.stringify(recommendedUris) %>">
          <button type="submit">Create Playlist</button>
</form>
```

server.js with query parameters: 
```
res.redirect(`/playlist-added?playlistUrl=${encodeURIComponent(playlistUrl)}&playlistID=${encodeURIComponent(playlistID)}&playlistUri=${encodeURIComponent(playlistUri)}`);
```

#### Deploying on Render
In week 2 I had the issues with deploying to Vercel. I tried Render instead because of 2 reasons:
- Tried it once, it always works for me
- Vercel not and it gives me headaches

It WORKED. Okay, except for a few ESlint and Vite errors that caused it not to do a build. I removed the configurations for ESlint and the Vite ESlint configuration, and then it did build and was online. I stil had the REDIRECT_URI thing though, but due to lack of time on this project, I just decided to hardcode the domain callback url in my .env before deploying as a quick fix.

## Reflection
I liked:
- learning a lot with OAuth 2.0 authorization and how it works in general
- Seeing the difference betwen multiple API's
- Making the gallery. Bruh, just seeing the fluid animations is cool enough
- Making and drawing out concept and translating to code
- The workshops: they were fast but straight to the point
- Did I already mention the gallery?


### I struggled with:
The REDIRECT_URI issues. I feel like that issue is a bit confusing for me, and seeing the time frame for this project, it kinda wasted my time, which sucks because if I had more time, I could have perfected my app a bit more. Also the client side and server side data passing, this looks easy but it wasn't for me and it was a relief to hear that I could just pass data straight from the server side.

### I'm going to take along with me next time:
- The authorization flow: I think I made a good enough structure that can be used everywhere else, so if I ever use API's with OAuth 2.0 flows, I'll reuse this code. 
- The query parameters code technique. It seems like a fuss but it's straight to the point, just pass it as a query parameter and you can access this everywhere in your template, pretty cool.
- GSAP (and Lenis): I'm going to try and implement this for other sites such as my portfolio. It's very nice to use and I feel like you can do so much with less code

### I'm proud of: 
My gallery! And the fact that I built this in such a small amount of time. In the first week I was a bit insecure about it and kept asking myself questions: What if the flow doesn't work? And it worked in a week! This also gave me the motivation to go further and give myself more challenges and alternatives to see if it works or not.
I also have a new web app now that's actually worth showcasing. This is going to be the highlighted one on my portfolio because I like it so much! Maybe if I have time left after uni, i will perfect this to make sure that everyone can use it (because for now, if someone else logs in, it gives access token errors.)



## Resources

- Build tooling (CSS/JS) by [Vite](https://vitejs.dev/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Web Share API voor sharing content - Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Other Web API's by Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API).
- [Authorizaton Code Flow Tutorial - Spotify for Developers](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Authorization Information | Spotify for Developers](https://developer.spotify.com/documentation/web-api/concepts/authorization)
-[Scroll Animation Ideas for Image Grids - Tympanus/Codrops](https://tympanus.net/codrops/2022/05/31/scroll-animation-ideas-for-image-grids/)
- [GSAP - Animation Library](https://gsap.com/docs/v3/Installation?tab=npm&module=esm&method=private+registry&tier=free&club=false&require=false&trial=true)
- [Lenis smooth scroll by darkroom.engineering](https://lenis.darkroom.engineering/)
- Cyd's GSAP workshop
- ChatGPT for a LOT of troubleshooting
- [iFrame API - Spotify for Developers](https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)
- [Render - Deployment Service](https://dashboard.render.com/)
