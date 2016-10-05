# Gigya API wrapper
This is a simple Gigya JS api wrapper which works with promises and should make live easier for developers working with Gigya markup extensions.

## Status
The esdoc has not been written properly yet. The rest should work fine.

## How to use...

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
this.gigyaWrapperInstance.onLibraryReady().then( ()=>{

  // Listen to user events
  this.gigyaWrapperInstance.registerEventListeners({
    onLogin: ( userData )=>{ /* do something */ },
    onLogout: ()=>{ /* do something */ }
  });

  this.gigyaWrapperInstance.checkLoggedInStatus().then( ( response )=>{ /* do something */ } );

  // Helper functions
  this.gigyaWrapperInstance.logout().then( ( response )=>{ /* do something */ } );
  this.gigyaWrapperInstance.getSchema().then( ( response )=>{ /* do something */ } );
  this.gigyaWrapperInstance.getPolicies().then( ( response )=>{ /* do something */ } );
  this.gigyaWrapperInstance.getScreenSets().then( ( response )=>{ /* do something */ } );

  // Sharing
  this.gigyaWrapperInstance.share({
    provider: 'facebook',
    url: 'http://timbenniks.nl',
    title: 'Tims website',
    subtitle: 'Times website subtitle',
    description: 'Tims website is pretty cool man',
    imageurl: 'http://timbenniks.nl/assets/favicon.png'
  });

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
