var expect = chai.expect;

var opts = {
  apiKey: '3_G0d_tqX9wnh3EHMZmLq_zbZTPppwnz4x1eZX8FuHkTELjV6HP-pJWzv7po9KZ6dB',
  containerID: 'fixtures',
  screenSet: 'screen-set',
  lang: 'en',
  autoLogin: true,
  debug: false
}

var gigyaWrapper = new window.gigyaWrapper( opts );

describe( 'Gigya API Wrapper', function(){

  describe( 'Constructor', function(){
    it( 'Instance should be an object', function(){
      expect( gigyaWrapper ).to.be.an( 'object' );
    });
  });

  describe( 'Load gigya library async', function(){
    it( 'should load', function( done ){
      gigyaWrapper.onLibraryReady().then( ( gigya )=>{
        expect( gigya ).to.be.an( 'object' );
        expect( gigya.isGigya ).to.equal( true );
        expect( gigya.__initialized ).to.equal( true );
        done();
      });
    });
  });

  describe( 'Helper functions', function(){
    it( 'returns the user schema', function( done ){
      gigyaWrapper.getSchema().then( ( schema )=>{
        expect( schema.operation ).to.equal( '/accounts.getSchema' );
        expect( schema.dataSchema ).to.be.an( 'object' );
        done();
      });
    });

    it( 'returns the RaaS policies (registration, gigyaPlugins, passwordComplexity, security)', function( done ){
      gigyaWrapper.getPolicies().then( ( policies )=>{
        expect( policies.operation ).to.equal( '/accounts.getPolicies' );
        expect( policies.passwordComplexity ).to.be.an( 'object' );
        expect( policies.registration ).to.be.an( 'object' );
        expect( policies.security ).to.be.an( 'object' );
        done();
      });
    });

    it( 'returns the Screensets (default screenstes for this test)', function( done ){
      gigyaWrapper.getScreenSets().then( ( screenSets )=>{
        expect( screenSets.operation ).to.equal( '/accounts.getScreenSets' );
        expect( screenSets.screenSets ).to.be.an( 'array' );
        done();
      });
    });
  });

});
