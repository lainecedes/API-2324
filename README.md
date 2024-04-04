# API @cmda-minor-web 2023 - 2024

Het web is een geweldige plek en de beschikbare technologieën ervan zijn vandaag de dag krachtiger dan ooit tevoren.
De kracht van het web ligt in het feit dat het een platform is dat voor iedereen beschikbaar is en dat het gebaseerd is
op open standaarden. De technologieën worden ontworpen en gespecificeerd op basis van consensus en zijn niet in handen
van één enkele entiteit.

Desondanks zijn er veel mensen en bedrijven die vinden dat het internet niet voldoet aan hun behoeften. Dit blijkt uit
de pogingen van grote techbedrijven om hun eigen afgesloten ecosystemen te creëren. Ze streven hiermee naar controle over
zowel de gebruikerservaring als de gegenereerde data.

**In dit vier weken durende vak zullen we de kracht van het web ervaren en kijken hoe we (mobiele) web apps kunnen maken die
net zo aantrekkelijk zijn als native mobiele apps. We beginnen met het maken van een server-side gerenderde applicatie
waarbij we geleidelijk de gebruikerservaring verbeteren met relevante beschikbare web API's.**

- geen gebruik maken van frameworks zoals React, Vue, Svelte, Angular, etc. 


## Opdracht

In dit vak zullen we een van de meest voorkomende app-concepten van vandaag gebruiken en ontdekken dat we deze kunnen
maken met moderne webtechnologie.

Voorbeelden:

- Maak je eigen streamingplatform (Netflix/Spotify).
- Maak je eigen doom-scroll-app (Instagram/TikTok).
- Maak je eigen chatapplicatie (WhatsApp/Signal).
- Een andere app die je zelf leuk vindt...

## concepten
- Pinterest style app met Rijksmuseum API data
- Kunst vergelijkings tool met Rijksmuseum data
- Iets met Spotify, most played albums/songs in een galerij, klik erop en dan speelt ie een random liedje af
- Dribbble API: Pinterest style app met profiel info portfolio style


## Week 1 
- Overgestapt van tinyhttp naar express js
- Overgestapt van liquid naar ejs
- Map reorganisatie zodat Vite ook werkt
- env in Vite
- server.js met Rijksmuseum API fetch


## Resources

- Om serverside te kunnen renderen maak ik gebruik van [TinyHttp](https://github.com/tinyhttp), maar je kan ook kiezen voor [Express](https://expressjs.com/).
- Voor templating maak ik gebruik van [LiquidJS](https://liquidjs.com/), maar je kan ook kiezen voor [EJS](https://ejs.co/).
- Voor build tooling(CSS en JS) maak ik gebruik van [Vite](https://vitejs.dev/).

Voorbeeld content API's die je kan gebruiken:

- [MovieDB API](https://developer.themoviedb.org/reference/intro/getting-started)
- [Rijksmuseum API](https://data.rijksmuseum.nl/object-metadata/api/)
- [Spotify API](https://developer.spotify.com/documentation/web-api)

Voorbeelden van Web API's die je kan gebruiken:

- [Page Transition API voor animaties tusse npagina's](https://developer.mozilla.org/en-US/docs/Web/API/Page_Transitions_API)
- [Web Animations API voor complexe animaties](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Service Worker API voor installable web apps](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push API voor push notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Server sent events voor realtime functionaliteit](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Web Share API voor sharen van content binnen de context van de gebruiker](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

De lijst is eindeloos, laat je vooral inspireren op de overzichtspagina van [MDN](https://developer.mozilla.org/en-US/docs/Web/API).
