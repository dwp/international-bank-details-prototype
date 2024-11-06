//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const functions = require('./functions.js')

// ***************************************************************************
// flow 3


// ------------- gets
router.get('/flow3/search', function(request, response){
    functions.clearAccountData(request);
    request.session.data['allData'] = functions.createAllData();
    response.render("/flow3/search");
  })
  
  
  // detect if we're coming from check answers
  router.get('/flow3/country-code', function(request, response){
    response.render("/flow3/country-code");
  })
  
  router.get('/flow3/select-benefit', function(request, response){
    try {
        functions.clearAccountData(request);
  
      var option = parseInt(request.query['option']);
     request.session.data['cardNumber'] = option;
      var card = request.session.data['scenarioData']['cards'][option];
      var benefit = card['benefit'];
     
      request.session.data['chosenCard'] = card;
      request.session.data['benefit'] = benefit;
     
      response.render("/flow3/location", {benefit});    
    }
    catch(err) {
      //request.session.destroy();
      response.redirect("/flow3/error");
    }
    
  })
  
  
  // start the flow with the right data
  router.get('/flow3/location', function(request, response){
    var benefit = request.session.data['benefit'];
    response.render("/flow3/location", {benefit});
    
  })
  
  // start the flow with the right data
  router.get('/flow3/change', function(request, response){
    try {
      var isChange = true;
      var destination = request.query['destination'];
      switch (destination) {
        case 'location':
          var benefit = request.session.data['benefit'];
          response.render("/flow3/location", {benefit, isChange});
          break;
          case 'country-code':
            response.render("/flow3/country-code", {isChange}); 
            break;
            case 'bank-details':
              response.render("/flow3/bank-details", {isChange}); 
              break;
        default:
          response.render("/flow3/error"); 
          break;
      }
       
    }
    catch(err) {
      //request.session.destroy();
      response.redirect("/flow3/error");
    }
    
  })
  // detect if we're coming from check answers
  router.get('/flow3/bank-details', function(request, response){
    response.render("/flow3/bank-details");
  })
  
  // get check answers ready
  router.get('/flow3/check-answers', function(request, response){
    console.log('getting display type and rendering check answers')
    
    accountDisplayText = functions.convertAccountTypeToDisplayText(request.session.data['account-type'])
    response.render("/flow3/check-answers", {accountDisplayText});
    
  })
  
  
  
  // ------------- posts
  router.post('/flow3/search', function(request, response) {
  
    var scenarioData = functions.getScenarioData(request)
    request.session.data['scenarioData'] = scenarioData;
  
    if (scenarioData == null)
    {
      response.redirect("/flow3/end-unhappy")
    } else {
      response.redirect("/flow3/benefit-selection");
    }
  })
  router.post('/flow3/location', function(request, response) {
    var location = request.session.data['location']
    var isChange = request.query['change'];
    if (location == "Yes"){
        response.redirect("/flow3/end-unhappy")
    } else {
      if (isChange) {
        response.redirect("/flow3/check-answers")
      } else {
        response.redirect("/flow3/country-code")
      }
    }
  })
  
  
  
  router.post('/flow3/country-code', function(request, response) {
    var isChange = request.query['change'];
    if (isChange) {
      response.redirect("/flow3/check-answers")
    } else {
      response.redirect("/flow3/bank-details")
      }
  })
  
  router.post('/flow3/bank-details', function(request, response) {
    response.redirect("/flow3/check-answers")
  })
  
  router.post('/flow3/check-answers', function(request, response) {
    try {
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
      functions.clearAccountData(request)
  
  
      console.log("^^^^^^^^^^^^^^^^^  card = " + JSON.stringify(card, null, 2))
      request.session.data['scenarioData']['cards'][parseInt(request.session.data.option)] = card;
      response.redirect("/flow3/benefit-selection")
      //response.redirect("/")
    }
    catch(err) {
      console.log("££££££££££££££££££££ an error has happened " + JSON.stringify(err, null, 2))
  
      response.redirect("/flow3/error");
    }
    
  
      
  })
  
  module.exports = router;