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
router.get('/flow4/search', function(request, response){
    functions.clearAccountData(request);
    request.session.data['allData'] = functions.createAllData();
    response.render("/flow4/search");
  })
  
  
  // detect if we're coming from check answers
  router.get('/flow4/country-code', function(request, response){
    response.render("/flow4/country-code");
  })
  
  router.get('/flow4/select-benefit', function(request, response){
    try {
        functions.clearAccountData(request);
  
      var option = parseInt(request.query['option']);
     request.session.data['cardNumber'] = option;
      var card = request.session.data['scenarioData']['cards'][option];
      var benefit = card['benefit'];
     
      request.session.data['chosenCard'] = card;
      request.session.data['benefit'] = benefit;
     
      response.render("/flow4/location", {benefit});    
    }
    catch(err) {
      //request.session.destroy();
      response.redirect("/flow4/error");
    }
    
  })
  
  
  // start the flow with the right data
  router.get('/flow4/location', function(request, response){
    var benefit = request.session.data['benefit'];
    response.render("/flow4/location", {benefit});
    
  })
  
  // start the flow with the right data
  router.get('/flow4/change', function(request, response){
    try {
      var isChange = true;
      var destination = request.query['destination'];
      switch (destination) {
        case 'location':
          var benefit = request.session.data['benefit'];
          response.render("/flow4/location", {benefit, isChange});
          break;
          case 'country-code':
            response.render("/flow4/country-code", {isChange}); 
            break;
            case 'bank-details':
              response.render("/flow4/bank-details", {isChange}); 
              break;
        default:
          response.render("/flow4/error"); 
          break;
      }
       
    }
    catch(err) {
      //request.session.destroy();
      response.redirect("/flow4/error");
    }
    
  })
  // detect if we're coming from check answers
  router.get('/flow4/bank-details', function(request, response){
    response.render("/flow4/bank-details");
  })
  
  // get check answers ready
  router.get('/flow4/check-answers', function(request, response){
    console.log('getting display type and rendering check answers')
    
    accountDisplayText = functions.convertAccountTypeToDisplayText(request.session.data['account-type'])
    response.render("/flow4/check-answers", {accountDisplayText});
    
  })
  
  
  
  // ------------- posts
  router.post('/flow4/search', function(request, response) {
  
    var scenarioData = functions.getScenarioData(request)
    request.session.data['scenarioData'] = scenarioData;
  
    if (scenarioData == null)
    {
      response.redirect("/flow4/end-unhappy")
    } else {
      response.redirect("/flow4/benefit-selection");
    }
  })
  router.post('/flow4/location', function(request, response) {
    var location = request.session.data['location']
    var isChange = request.query['change'];
    if (location == "Yes"){
        response.redirect("/flow4/end-unhappy")
    } else {
      if (isChange) {
        response.redirect("/flow4/check-answers")
      } else {
        response.redirect("/flow4/country-code")
      }
    }
  })
  
  
  
  router.post('/flow4/country-code', function(request, response) {
    try {
    var code = request.session.data['countryCode'].toUpperCase();

    const codes = ["AUT", "BEL", "BGR", "CYP", "FIN", "FRA", "DEU", "GRC", "IRL", "ITA", "LUX", "MLT", "NLD", "PRT", "ESP", "CHE"];
    if (!/^[a-z]+$/i.test(code))
    {
      response.redirect("/flow4/country-code-error-numeric")
    } else if (!codes.includes(code))
    {
      response.redirect("/flow4/country-code-error-no-match")
    } else {

    var isChange = request.query['change'];
    if (isChange) {
      response.redirect("/flow4/check-answers")
    } else {
      response.redirect("/flow4/bank-details")
      }
    }
  }

    catch(err) {
      console.log("££££££££££££££££££££ an error has happened " + JSON.stringify(err, null, 2))
  
      response.redirect("/flow4/error");
    }
    
 })
  
  router.post('/flow4/bank-details', function(request, response) {
    response.redirect("/flow4/check-answers")
  })
  
  router.post('/flow4/check-answers', function(request, response) {
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
      // this is also where it could go wrong:
      
      request.session.data['scenarioData']['cards'][parseInt(request.session.data.option)] = card;
      response.redirect("/flow4/benefit-selection")
      //response.redirect("/")
    }
    catch(err) {
      console.log("££££££££££££££££££££ an error has happened " + JSON.stringify(err, null, 2))
  
      response.redirect("/flow4/error");
    }
    
  
      
  })
  router.post('/flow4/error', function(request, response) {
    response.redirect("/flow4/search")
  })
  

  
  module.exports = router;