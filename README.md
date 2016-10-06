# Gigya API wrapper
This is a simple Gigya JS api wrapper which works with promises and should make life easier for developers working with Gigya markup extensions.

## Scope
Currently this library does not include the custom JS registration, login and password reset API functions as it is intended to be used next to the Gigya markup extensions. The Gigya Markup extensions deal with the registration, account linking, password reset and other flows on their own as long as you add the proper data and class attributes on their HTML.

A later release might possibly contain the other API functions so you can code a completely custom Gigya RaaS implementation.

## How to use...

```bash
  npm i gigyaWrapper
```

### Initialisation

```js
import GigyaWrapper from 'gigyaWrapper';

this.gigyaWrapperInstance = new GigyaWrapper({
  apiKey: '<api_key>',
  containerID: 'wrapper',
  screenSet: 'screen-set', // could be on gigya's servers or local
  lang: 'en',
  autoLogin: true,
  debug: false
});

// Listen to the async load event of the Gigya library.
this.gigyaWrapperInstance.onLibraryReady().then( ( gigyaObject )=>{
  // do stuffs
});
```

### A common use case
Initialise like the above code sample.

```js
// Listen to user events
this.gigyaWrapperInstance.registerEventListeners({
  onLogin: ()=>{ /* show profile */ },
  onLogout: ()=>{
    //shortcut for the showScreenSet function.
    this.gigyaWrapperInstance.showLoginScreen();
  }
});

this.gigyaWrapperInstance.checkLoggedInStatus().then( ( response )=>{
    if( response.loggedIn ){
      // show profile
    }
    else {
      this.gigyaWrapperInstance.showLoginScreen();
    }
  }
});
```

### Other common functions
Remember to always initialise (onLibraryReady()) first so the Gigya object is available.
```js

// Return promises
this.gigyaWrapperInstance.getAccountInfo();
this.gigyaWrapperInstance.logout();
this.gigyaWrapperInstance.getSchema();
this.gigyaWrapperInstance.getPolicies();
this.gigyaWrapperInstance.getScreenSets();

// ScreenSet handling
// See esdoc directory for all property explanations
this.gigyaWrapperInstance.showLoginScreen();

this.gigyaWrapperInstance.showScreenSet({
  screenSet: 'screen-set',
  containerID: 'wrapper',
  startScreen: 'gigya-login-screen'
});

this.gigyaWrapperInstance.hideScreenSet({
  screenSet: 'screen-set',
  containerID: 'wrapper'
});

// Sharing
// See esdoc directory for all property explanations
this.gigyaWrapperInstance.share({
  provider: 'facebook',
  url: 'http://timbenniks.nl',
  title: 'Tims website',
  subtitle: 'Times website subtitle',
  description: 'Tims website is pretty cool man',
  imageurl: 'http://timbenniks.nl/assets/favicon.png'
});
```

## Development
You need to have node and npm installed to be able to work on this code.
If you intend to add or change code you will need to re-render the esdoc.

Install esdoc

`npm install -g esdoc`

Run esdoc

`esdoc -c esdoc.json`

### Installation
`npm install`

### Tests
`npm run test`

### Dev
`npm run dev`

### Build
`npm run build`
