require( 'es6-promise/auto' );
require( 'es6-object-assign' ).polyfill();

/**
 * GigyaWrapper JS API wrapper class
 * @class GigyaWrapper
 */
export default class GigyaWrapper{

  /**
   * GigyaWrapper constructor.
   * @param {object} options - Object of options
   * @param {string} options.apiKey - Gigya API key
   * @param {string} [options.containerID='wrapper'] - DOM node to use for screensets.
   * @param {string} [options.screenSet='Default-RegistrationLogin'] - Which screen set to use. Can be local on hosted in Gigya console.
   * @param {string} [options.lang='en'] - Language of error messages.
   * @param {boolean} [options.autoLogin=true] - Try to automatically login a user.
   * @param {boolean} [options.debug=false] - Add a debug panel to the page.
   * @constructs GigyaWrapper
   */
  constructor( options ){
    /**
     * API key for Gigya.
     * @type {string}
     * @member GigyaWrapper#apiKey
     */
    this.apiKey = options.apiKey;

    /**
     * DOM node to use for screensets
     * @type {string}
     * @member GigyaWrapper#containerID
     */
    this.containerID = options.containerID || 'wrapper';

    /**
     * Which screen set to use
     * @type {string}
     * @member GigyaWrapper#screenSet
     */
    this.screenSet = options.screenSet || 'Default-RegistrationLogin';

    /**
     * Language of error messages
     * @type {string}
     * @member GigyaWrapper#lang
     */
    this.lang = options.lang || 'en';

    /**
     * Try to automatically login a user
     * @type {boolean}
     * @member GigyaWrapper#autoLogin
     */
    this.autoLogin = options.autoLogin || true;

    /**
     * Add a debug panel to the page
     * @type {boolean}
     * @member GigyaWrapper#debug
     */
    this.debug = options.debug || false;

    /**
     * The gigya library object
     * @type {object}
     * @member GigyaWrapper#gigya
     */
    this.gigya = false;

    /**
     * Empty noop function
     * @type {function}
     * @member GigyaWrapper#noop
     */
    this.noop = ()=>{};

    if( !this.apiKey ){
      throw new Error( 'No API key given' );
    }
  }

  /**
   * Adds the script to the DOM and binds to the onGigyaServiceReady funciton
   * @return {promise} resolves the gigya library object
   */
  onLibraryReady(){
    return new Promise( ( resolve, reject )=>{

      if( this.gigya ){
        reject( { error: 'Gigya has already been loaded', gigya: this.gigya } );
      }

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

  /**
   * Logout a user.
   * @see http://developers.gigya.com/display/GD/accounts.logout+JS
   * @return {promise} Resolves an object with errorCode, errorMessage. On errorCode 0, the user was sucessfully logged out.
   */
  logout(){
    return new Promise( ( resolve, reject )=>{
      this.gigya.accounts.logout( {
        callback: resolve
      } );
    } );
  }

  /**
   * Shortcut to show the login screen by using the showScreenSet function.
   */
  showLoginScreen(){
    this.showScreenSet( {
      startScreen: 'gigya-login-screen'
    } );
  }

  /**
   * @typedef CustomLang
   * @type {object}
   * @property {string} account_is_disabled - defaults to: Account is disabled
   * @property {string} account_temporarily_locked_out - defaults to:  Account temporarily locked out
   * @property {string} and - defaults to: and
   * @property {string} available - defaults to: Available
   * @property {string} checking - defaults to: Checking
   * @property {string} choose_file - defaults to: Choose File
   * @property {string} email_address_is_invalid - defaults to: E-mail address is invalid.
   * @property {string} email_already_exists - defaults to: Email already exists
   * @property {string} fair - defaults to: Fair
   * @property {string} invalid_fieldname - defaults to: Invalid %fieldname
   * @property {string} invalid_login_or_password - defaults to: Invalid login or password
   * @property {string} invalid_username_or_password - defaults to: Invalid username or password
   * @property {string} login_identifier_exists - defaults to: Login identifier exists
   * @property {string} maximum_size_of_3mb. - defaults to: Maximum size of 3MB.
   * @property {string} no_file_chosen - defaults to: No file chosen
   * @property {string} not_available - defaults to: Not available
   * @property {string} num_characters_total - defaults to: %num characters
   * @property {string} num_of_the_following_groups - defaults to: %num of the following: An uppercase letter, a lowercase letter, a number, a special symbol
   * @property {string} old_password_cannot_be_the_same_as_new_password - defaults to: Old password cannot be the same as New Password
   * @property {string} password_does_not_meet_complexity_requirements - defaults to: Password does not meet complexity requirements
   * @property {string} password_must_contain_at_least - defaults to: Password must contain at least
   * @property {string} password_strength_colon - defaults to: Password strength:
   * @property {string} passwords_do_not_match - defaults to: Passwords do not match
   * @property {string} please_enter_a_valid_fieldname - defaults to: Please enter a valid %fieldname
   * @property {string} please_enter_fieldname - defaults to: Please enter %fieldname
   * @property {string} profilePhoto_fileSizeError - defaults to: Photo format: JPG/GIF/PNG. Size: up to 3MB.
   * @property {string} sorry_we_are_not_able_to_process_your_registration - defaults to: Sorry, we are not able to process your registration
   * @property {string} strong - defaults to: Strong
   * @property {string} the_characters_you_entered_didn't_match_the_word_verification._please_try_again - defaults to: The characters you entered didn't match the word verification. Please try again
   * @property {string} there_are_errors_in_your_form_please_try_again - defaults to: There are errors in your form, please try again
   * @property {string} there_is_no_user_with_that_username_or_email - defaults to: There is no user with that username or email
   * @property {string} these_passwords_do_not_match - defaults to: These passwords do not match
   * @property {string} this_field_is_required - defaults to: This field is required
   * @property {string} too_weak - defaults to: Too weak
   * @property {string} unique_identifier_exists - defaults to: Unique identifier exists
   * @property {string} username_already_exists - defaults to: Username already exists
   * @property {string} very_strong - defaults to: Very strong
   * @property {string} weak - defaults to: Weak
   * @property {string} wrong_password - defaults to: Wrong password
   * @property {string} your_age_does_not_meet_the_minimal_age_requirement - defaults to: Your age does not meet the minimal age requirement (13+) for this site
   */

  /**
   * Shows a Gigya screen set. Either locally hosted or hosted in the Gigya console.
   * @param {object} opts - Options object for showScreenSet function
   * @param {string} [opts.screenSet=this.screenSet] - Screen set to use. Defaults to {@link GigyaWrapper#screenSet}
   * @param {string} [opts.containerID=this.containerID] - DOM id of screen set container. Defaults to {@link GigyaWrapper#containerID}
   * @param {string} [opts.startScreen="gigya-login-screen"] - The screen to show.
   * @param {CustomLang} [opts.customLang] - An object which overrules the error message for the selected language.
   * @param {function} [opts.onBeforeScreenLoad] - This function is fired on before screen load.
   * @param {function} [opts.onAfterScreenLoad] - This function is fired onAfterScreenLoad.
   * @param {function} [opts.onAfterSubmit] - This function is fired onAfterSubmit.
   * @param {function} [opts.onBeforeSubmit] - This function is fired onBeforeSubmit.
   * @param {function} [opts.onFieldChanged] - This function is fired onFieldChanged.
   * @see http://developers.gigya.com/display/GD/Customizing+Screen-Set+Error+Messages
   * @see http://developers.gigya.com/display/GD/accounts.showScreenSet+JS
   */
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

  /**
   * Hides a Gigya screen set. Either locally hosted or hosted in the Gigya console.
   * @param {object} opts - Options object for showScreenSet function
   * @param {string} [opts.screenSet=this.screenSet] - Screen set to use. Defaults to {@link GigyaWrapper#screenSet}
   * @param {string} [opts.containerID=this.containerID] - DOM id of screen set container. Defaults to {@link GigyaWrapper#containerID}
   * @see http://developers.gigya.com/display/GD/accounts.hideScreenSet+JS
   */
  hideScreenSet( opts ){
    let screensetProps = Object.assign( {
      screenSet: this.screenSet,
      containerID: this.containerID
    }, opts );

    this.gigya.accounts.hideScreenSet( screensetProps );
  }

  /**
   * register to global Gigya events like user login or logout.
   * @param {object} eventListeners - an object of functions that are fired upon global gigya events.
   * @param {function} [opts.onLogin] - This function is fired onLogin.
   * @param {function} [opts.onLogout] - This function is fired onLogout.
   * @param {function} [opts.onConnectionAdded] - This function is fired onConnectionAdded.
   * @param {function} [opts.onConnectionRemoved] - This function is fired onConnectionRemoved.
   * @param {function} [opts.onLinkback] - This function is fired onLinkback.
   * @see http://developers.gigya.com/display/GD/accounts.addEventHandlers+JS
   */
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

  /**
   * Get Account info for user.
   * @param {string} [include='profile,data'] - A comma-separated list of fields to include in the response. The possible values are: identities-active, identities-all, loginIDs, emails, profile, data, regSource, and irank.
   * @return {promise} Resolves an object with errorCode, errorMessage and user account info based on the include parameter.
   * @see http://developers.gigya.com/display/GD/accounts.getAccountInfo+JS
   */
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

  /**
   * Check if a user is logged in
   * @return {promise} Resolves an object with errorCode, errorMessage and loggedIn true or false.
   */
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

  /**
   * Share to social provider
   * @param {object} opts - Options object for the share function
   * @param {string} [opts.provider='facebook'] - Which provider to share too. Possible providers: 'facebook', 'twitter', 'googleplus', 'microsoft', 'linkedin', delicious', 'googlebookmarks', 'whatsapp', 'myaol', 'baidu', 'stumbleupon', 'qq', 'sina', 'renren', 'mixi', 'friendfeed', 'reddit', 'boxnet', 'tumblr', 'plaxo', 'technorati', 'faves', 'newsvine', 'fark', 'mixx', 'bitly', 'hatena', 'amazon', 'gmail', 'netlog', 'evernote', 'aolmail', 'currenttv', 'yardbarker', 'blinklist', 'diigo', 'dropjack', 'segnalo', 'linkagogo', 'kaboodle', 'skimbit', 'formspring', 'vkontakte', 'spiceworks', 'viadeo', 'nkpl', 'xing', 'tuenti', 'odnoklassniki', 'douban', 'pinterest'.
   * @param {string} opts.url - URL to share
   * @param {string} opts.title - Share title
   * @param {string} [opts.subtitle] - Subtitle for share (facebook only)
   * @param {string} [opts.description] - Share description
   * @param {string} [opts.imageurl] - Image to share
   * @param {object} [opts.actionAttributes] - actionAttributes contain a JSON object comprised of a series of attribute keys (categories) with associated values. You can also use a generic "tags" key.
   * @param {number} [opts.popupHeight=300] - popup height
   * @param {number} [opts.popupWidth=400] - popup width
   * @param {string} [opts.providerKey] - The provider-specific API Key. This parameter is used when calling this method for providers that require an API key.
   * @param {string} [opts.shortURLs] - Using this parameter you may determine whether to use Gigya's URL shortening service for URLs passed in the status parameter. Options: 'never', 'always', 'whenRequired'.
   * @param {string} [opts.facebookDialogType='feed'] - Applicable only for sharing through Facebook. This parameter determines which Facebook dialog will appear when clicking the share button. When using the 'share' dialog, it is required to implement open graph tags on your page.
   * @param {string} [opts.tags] - A comma separated list of tags that are used to identify the share operation.
   * @see http://developers.gigya.com/display/GD/socialize.postBookmark+JS
   */
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
      tags: false
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

  /**
   * Get the userSchema for the current {@link GigyaWrapper#apiKey}
   * @return {promise} Resolves an object with errorCode, errorMessage and the schema info.
   * @see http://developers.gigya.com/display/GD/accounts.getSchema+JS
   */
  getSchema(){
    return new Promise( ( resolve, reject )=>{
      this.gigya.accounts.getSchema( {
        callback: ( response )=> this._cb( resolve, reject, response )
      } );
    } );
  }

  /**
   * Get the Policies from the RaaS console interface
   * @param {object} opts - Options object for the share function
   * @param {string} [opts.sections='registration,gigyaPlugins,passwordComplexity,security'] - A comma-separated list specifying which sections of the policies to include in the response
   * @return {promise} Resolves an object with errorCode, errorMessage and the policies info.
   * @see http://developers.gigya.com/display/GD/accounts.getPolicies+JS
   */
  getPolicies( opts ){
    return new Promise( ( resolve, reject )=>{
      let policiesProps = Object.assign( {
        sections: 'registration,gigyaPlugins,passwordComplexity,security',
        callback: ( response )=> this._cb( resolve, reject, response )
      }, opts );

      this.gigya.accounts.getPolicies( policiesProps );
    } );
  }

  /**
   * Get the Screensets from the RaaS console interface
   * @param {object} opts - Options object for the share function
   * @param {string} [opts.screenSetIDs='Default-RegistrationLogin'] - Either a comma separated list or a JSON array of identifiers of the screen-sets to be retrieved. When not specified returns all the screen-sets associated with the site.
   * @param {string} [opts.include='Default-RegistrationLogin,html,css'] - A comma separated list of top level fields to include in the response. The default is: "screenSetID,html,css".
   * @return {promise} Resolves an object with errorCode, errorMessage and the policies info.
   * @see http://developers.gigya.com/display/GD/accounts.getScreenSets+JS
   */
  getScreenSets( opts ){
    return new Promise( ( resolve, reject )=>{
      let screenSetsProps = Object.assign( {
        screenSetIDs: 'Default-RegistrationLogin',
        include: 'Default-RegistrationLogin,html,css',
        callback: ( response )=> this._cb( resolve, reject, response )
      }, opts );

      this.gigya.accounts.getScreenSets( screenSetsProps );
    } );
  }

  /**
   * Private callback function for the promises used in this class.
   * @param {function} resolve - Function to fire as resolve.
   * @param {function} reject - Function to fire as reject.
   * @param {object} response - Teh response to use for either resolve or reject.
   * @return {promise} Resolves or rejects a response object.
   */
  _cb( resolve, reject, response ){
    if( response.status !== 'OK' ){
      reject( { code: response.errorCode, error: response.errorMessage, details: response.errorDetails, status: response.status } );
    }
    resolve( response );
  }
}
