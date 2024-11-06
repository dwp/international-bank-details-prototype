//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const functions = require('./functions.js')

// ***************************************************************************
// flow 2


// ------------- gets
router.get('/flow2/search', function(request, response){
    functions.clearAccountData(request);
    request.session.data['allData'] = functions.createAllData();
    
    response.render("/flow2/search");
  })
  
  
  // detect if we're coming from check answers
  router.get('/flow2/account-type-alt1', function(request, response){
    try {
      // todo: refactor to use param
      var isChange = functions.isAChangeRequest(request)
    response.render("/flow2/account-type-alt1", {isChange});
  }
  catch(err) {
   // request.session.destroy();
    response.redirect("/flow2/error");
  }
  })
  // detect if we're coming from check answers
  router.get('/flow2/location-alt5', function(request, response){
    try {
      var isChange = functions.isAChangeRequest(request)
    response.render("/flow2/location-alt5", {isChange});    
  }
    catch(err) {
      //request.session.destroy();
      response.redirect("/flow2/error");
      }
  
  })
  // detect if we're coming from check answers
  router.get('/flow2/country-code', function(request, response){
    try {
      // todo: refactor to use param
      var isChange = functions.isAChangeRequest(request)
    response.render("/flow2/country-code", {isChange});
  }
  catch(err) {
    //request.session.destroy();
    response.redirect("/flow2/error");
  }
  })
  
  // start the flow with the right data
  router.get('/flow2/location', function(request, response){
    try {
      var option = parseInt(request.query.option);
      request.session.data['cardNumber'] = option;
      var card = request.session.data['scenarioData']['cards'][option];
      
      request.session.data['chosenCard'] = card;
      request.session.data['benefit'] = card['benefit'];
  
      response.redirect("/flow2/location-alt5");
      }
    catch(err) {
     // request.session.destroy();
      response.redirect("/flow2/error");
      }
    
  })
  
  // detect if we're coming from check answers
  router.get('/flow2/bank-details', function(request, response){
    var isChange = functions.isAChangeRequest(request)
    response.render("/flow2/bank-details", {isChange});
  })
  
  // get check answers ready
  router.get('/flow2/check-answers', function(request, response){
    console.log('getting display type and rendering check answers')
    
    accountDisplayText = functions.convertAccountTypeToDisplayText(request.session.data['account-type'])
    response.render("/flow2/check-answers", {accountDisplayText});
    
  })
  
  
  // get benefits ready
  router.get('/flow2/benefit-selection', function(request, response){
    console.log('getting display type and rendering check answers')
    // pass in the correct data?
    // or just use the fact that we have the scenarioData?
    // todo: need to use the data that's been entered to get this to work
    // todo: set that at the check answers submission
    
    response.render("/flow2/benefit-selection");
    
  })
  
  // ------------- posts
  router.post('/flow2/search', function(request, response) {
  
    var nino = request.session.data['nino']
    var redirected = false;
    switch (nino) {
      case 'QQ123456B':
        request.session.data['scenarioData'] = request.session.data['allData'][0];
        break;
      case 'AB123456B':
        request.session.data['scenarioData'] = request.session.data['allData'][1];
        break;
      case 'CD123456B':
        request.session.data['scenarioData'] = request.session.data['allData'][2];
        break;
      case 'EF123456B':
        request.session.data['scenarioData'] = request.session.data['allData'][3];
        break;
      default:
        redirected = true;
        response.redirect("/flow2/end-unhappy")
        break;
    }
    if (!redirected)
    {
      response.redirect("/flow2/benefit-selection");
    }
  })
  router.post('/flow2/location', function(request, response) {
  
    var location = request.session.data['location']
    if (location == "Yes"){
        response.redirect("/flow2/end-unhappy")
    } else {
        response.redirect("/flow2/country-code")
    }
  })
  router.post('/flow2/location-change', function(request, response) {
  
    var location = request.session.data['location']
    if (location == "Yes"){
        response.redirect("/flow2/end-unhappy")
    } else {
      response.redirect("/flow2/check-answers")
    }
  })
  
  
  
  router.post('/flow2/country-code-change', function(request, response) {
      response.redirect("/flow2/check-answers")
  })
  
  router.post('/flow2/country-code', function(request, response) {
    response.redirect("/flow2/bank-details")
  })
  
  router.post('/flow2/bank-details', function(request, response) {
    response.redirect("/flow2/check-answers")
  })
  
  router.post('/flow2/bank-details-change', function(request, response) {
    response.redirect("/flow2/check-answers")
  })
  
  router.post('/flow2/check-answers', function(request, response) {
    try {
      // why might this have errored?
      // benefit is the only non-robust part
      // how would the chosenCard be cleared before?
      var card = {
        benefit: request.session.data['benefit'],
        location: "No",
        accountType: request.session.data['account-type'],
        accountHolderName: request.session.data['accountHolderName'],
        bankName: request.session.data['bankName'],
        bankAddress: request.session.data['bankAddress'],
        countryCode: request.session.data['countryCode'],
        bicSwift: request.session.data['bicSwift'],
        ibanNumber: request.session.data['ibanNumber']
      }
      functions.clearAccountData(request);
  
  
      console.log("^^^^^^^^^^^^^^^^^  card = " + JSON.stringify(card, null, 2))
      request.session.data['scenarioData']['cards'][parseInt(request.session.data.option)] = card;
      response.redirect("/flow2/benefit-selection")
      //response.redirect("/")
    }
    catch(err) {
      console.log("££££££££££££££££££££ an error has happened " + JSON.stringify(err, null, 2))
  
      //request.session.destroy();
      response.redirect("/flow2/error");
      }
    
  
      
  })
  
  // return to the start once the usability test is completed
  router.post('/flow2/completed', function(request, response) {
    //request.session.destroy();
    response.redirect("/")
  })
  module.exports = router;