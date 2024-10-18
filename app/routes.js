//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ------------- use

// Logging session data  
// This code shows in the terminal what session data has been saved.
router.use((req, res, next) => {    
  const log = {  
    method: req.method,  
    url: req.originalUrl,  
    data: req.session.data  
  }  
  console.log(JSON.stringify(log, null, 2))  
next()  
})  

// This code shows in the terminal what page you are on and what the previous page was.
router.use('/', (req, res, next) => {  
    res.locals.currentURL = req.originalUrl; //current screen  
    res.locals.prevURL = req.get('Referrer'); // previous screen
  
    console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder + ', previousUrl = ' + res.locals.prevURL);
  
    next();  
  });

// ------------- gets

// detect if we're coming from check answers
router.get('/account-type-alt1', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/account-type-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/location-alt1', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/location-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/bank-details', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/bank-details", {isChange});
})

// get check answers ready
router.get('/check-answers', function(request, response){
  console.log('getting display type and rendering check answers')
  
  accountDisplayText = convertAccountTypeToDisplayText(request.session.data['account-type'])
  response.render("/check-answers", {accountDisplayText});
  
})

// ------------- posts

router.post('/location', function(request, response) {

  var location = request.session.data['location']
  if (location == "Yes"){
      response.redirect("end-unhappy")
  } else {
      response.redirect("account-type-alt1")
  }
})
router.post('/location-change', function(request, response) {

  var location = request.session.data['location']
  if (location == "Yes"){
      response.redirect("end-unhappy")
  } else {
    response.redirect("check-answers")
  }
})

router.post('/account-type-change', function(request, response) {
    response.redirect("check-answers")
})

router.post('/account-type', function(request, response) {
  response.redirect("bank-details")
})

router.post('/bank-details', function(request, response) {
  response.redirect("check-answers")
})

router.post('/bank-details-change', function(request, response) {
  response.redirect("check-answers")
})

router.post('/check-answers', function(request, response) {
    response.redirect("complete")
})

// return to the start once the usability test is completed
router.post('/completed', function(request, response) {
  request.session.destroy();
  response.redirect("/")
})

// ------------- functions

function isAChangeRequest(request) {
  if (typeof request.get('Referrer') == 'undefined') return false;
  if (request.get('Referrer').endsWith('check-answers')) return true;
  return false;
}

function convertAccountTypeToDisplayText(accountType) {
  switch (accountType) {
    case 'checking-current': return("Checking or current account")
    case 'savings': return("Savings account")
    case 'other': return("Other")
    case 'dont-know':return("I don't know")
  }
  return '';
}
