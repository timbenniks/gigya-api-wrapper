require( 'es6-promise/auto' );
require( 'es6-object-assign' ).polyfill();

/**
 * GigyaWrapper JS API wrapper class
 * @class GigyaWrapper
 */
export default class GigyaWrapper{

  /**
   * GigyaWrapper constructor.
   * @param {object} options Object of options
   * @constructs GigyaWrapper
   */
  constructor( options ){
    /**
     * API key for Gigya.
     * @member GigyaWrapper#apiKey
     */
    this.apiKey = options.apiKey;

    /**
     * DOM node to use for screensets
     * Defaults to wrapper
     * @member GigyaWrapper#containerID
     */
    this.containerID = options.containerID || 'wrapper';

    /**
     * Which screen set to use
     * Defaults to Default-RegistrationLogin
     * @member GigyaWrapper#screenSet
     */
    this.screenSet = options.screenSet || 'Default-RegistrationLogin';


    /**
     * Language of error messages
     * Defaults to en
     * @member GigyaWrapper#lang
     */
    this.lang = options.lang || 'en';

    /**
     * Try to automatically login a user
     * Defaults to true
     * @member GigyaWrapper#autoLogin
     */
    this.autoLogin = options.autoLogin || true;

    /**
     * Add a debug panel to the page
     * Defaults to false
     * @member GigyaWrapper#debug
     */
    this.debug = options.debug || false;

    this.noop = ()=>{};

    if( !this.apiKey ){
      throw new Error( 'No API key given' );
    }
  }

  onLibraryReady(){
    return new Promise( ( resolve, reject )=>{
      let script = document.createElement( 'script' );

      script.type = 'text/javascript';
      script.async = true;
      script.src = `http://cdn.gigya.com/js/gigya.js?apiKey=${this.apiKey}&lang=${this.lang}`;
      script.text = `{lang: "${this.lang}", autoLogin: ${this.autoLogin}`;

      document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

      window.onGigyaServiceReady = ( serviceName )=>{
        this.gigya = window.gigya;

        if( this.debug ){
          this.gigya.showDebugUI();
        }

        resolve( this.gigya );
      };
    } );
  }

  logout(){
    return new Promise( ( resolve, reject )=>{
      this.gigya.accounts.logout( {
        callback: resolve
      } );
    } );
  }

  showLoginScreen( opts ){
    this.showScreenSet( {
      startScreen: 'gigya-login-screen'
    } );
  }

  // http://developers.gigya.com/display/GD/Customizing+Screen-Set+Error+Messages
  // customLang: {}
  showScreenSet( opts ){
    let screensetProps = Object.assign( {
      screenSet: this.screenSet,
      containerID: this.containerID,
      startScreen: 'gigya-login-screen',
      customLang: {},
      onBeforeScreenLoad: this.noop,
      onAfterScreenLoad: this.noop,
      onAfterSubmit: this.noop,
      onBeforeSubmit: this.noop,
      onFieldChanged: this.noop
    }, opts );

    this.gigya.accounts.showScreenSet( screensetProps );
  }

  hideScreenSet( opts ){
    let screensetProps = Object.assign( {
      screenSet: this.screenSet,
      containerID: this.containerID
    }, opts );

    this.gigya.accounts.hideScreenSet( screensetProps );
  }

  registerEventListeners( eventListeners ){
    let listeners = Object.assign( {
      onLogin: this.noop,
      onLogout: this.noop,
      onConnectionAdded: this.noop,
      onConnectionRemoved: this.noop,
      onLinkback: this.noop
    }, eventListeners );

    this.gigya.accounts.addEventHandlers( listeners );
  }

  getAccountInfo( include = 'profile, data' ){
    return new Promise( ( resolve, reject )=>{
      this.gigya.accounts.getAccountInfo( {
        include: include,
        callback: ( response )=>{
          if( response.errorCode === 0 ){
            resolve( response );
          } else {
            reject( { code: response.errorCode, error: response.errorMessage, status: response.status } );
          }
        }
      } );
    } );
  }

  checkLoggedInStatus(){
    return new Promise( ( resolve, reject )=>{
      this.gigya.accounts.getAccountInfo( {
        callback: ( response )=>{
          let result = {
            loggedIn: ( response.errorCode === 0 ),
            errorCode: response.errorCode,
            errorMessage: response.errorMessage,
            rawResponse: response
          };

          resolve( result );
        }
      } );
    } );
  }

  share( opts ){
    let shareProps = Object.assign( {
      provider: 'facebook',
      url: '',
      title: '',
      subtitle: '',
      description: '',
      imageurl: '',
      actionAttributes: {},
      popupHeight: 300,
      popupWidth: 400,
      providerKey: false,
      shortURLs: 'never',
      facebookDialogType: 'feed',
      tags: false,
      target: false
    }, opts );

    let userAction = new this.gigya.socialize.UserAction();

    userAction.setLinkBack( shareProps.url );
    userAction.setTitle( shareProps.title );
    userAction.setSubtitle( shareProps.subtitle );
    userAction.setDescription( shareProps.description );
    userAction.addActionLink( shareProps.title, shareProps.url );

    userAction.addMediaItem( {
      type: 'image',
      src: shareProps.imageurl,
      href: shareProps.url
    } );

    shareProps.userAction = userAction;
    shareProps.cid = `${shareProps.provider} share`;

    this.gigya.socialize.postBookmark( shareProps );
  }

  getSchema( opts ){
    return new Promise( ( resolve, reject )=>{
      let schemaProps = Object.assign( {
        context: {},
        callback: ( response )=> this.cb( resolve, reject, response )
      }, opts );

      this.gigya.accounts.getSchema( schemaProps );
    } );
  }

  getPolicies( opts ){
    return new Promise( ( resolve, reject )=>{
      let policiesProps = Object.assign( {
        sections: 'registration,gigyaPlugins,passwordComplexity,security',
        context: {},
        callback: ( response )=> this.cb( resolve, reject, response )
      }, opts );

      this.gigya.accounts.getPolicies( policiesProps );
    } );
  }

  getScreenSets( opts ){
    return new Promise( ( resolve, reject )=>{
      let screenSetsProps = Object.assign( {
        screenSetIDs: 'Default-RegistrationLogin',
        include: 'Default-RegistrationLogin,html,css',
        context: {},
        callback: ( response )=> this.cb( resolve, reject, response )
      }, opts );

      this.gigya.accounts.getScreenSets( screenSetsProps );
    } );
  }

  cb( resolve, reject, response ){
    if( response.status !== 'OK' ){
      reject( { code: response.errorCode, error: response.errorMessage, details: response.errorDetails, status: response.status } );
    }
    resolve( response );
  }
}
