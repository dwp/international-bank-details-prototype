//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const functions = require('./functions.js')


// ***************************************************************************



// flow 1


// ------------- gets

// detect if we're coming from check answers
router.get('/flow1/account-type-alt1', function(request, response){
  var isChange = functions.isAChangeRequest(request)
  response.render("/flow1/account-type-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/flow1/location-alt1', function(request, response){
  var isChange = functions.isAChangeRequest(request)
  response.render("/flow1/location-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/flow1/bank-details', function(request, response){
  var isChange = functions.isAChangeRequest(request)
  response.render("/flow1/bank-details", {isChange});
})

// get check answers ready
router.get('/flow1/check-answers', function(request, response){
  console.log('getting display type and rendering check answers')
  
  accountDisplayText = functions.convertAccountTypeToDisplayText(request.session.data['account-type'])
  response.render("/flow1/check-answers", {accountDisplayText});
  
})


// ------------- posts

router.post('/flow1/location', function(request, response) {

  var location = request.session.data['location']
  if (location == "Yes"){
      response.redirect("/flow1/end-unhappy")
  } else {
      response.redirect("/flow1/account-type-alt1")
  }
})
router.post('/flow1/location-change', function(request, response) {

  var location = request.session.data['location']
  if (location == "Yes"){
      response.redirect("/flow1/end-unhappy")
  } else {
    response.redirect("/flow1/check-answers")
  }
})

router.post('/flow1/account-type-change', function(request, response) {
    response.redirect("/flow1/check-answers")
})

router.post('/flow1/account-type', function(request, response) {
  response.redirect("/flow1/bank-details")
})

router.post('/flow1/bank-details', function(request, response) {
  response.redirect("/flow1/check-answers")
})

router.post('/flow1/bank-details-change', function(request, response) {
  response.redirect("/flow1/check-answers")
})

router.post('/flow1/check-answers', function(request, response) {
    response.redirect("/flow1/complete")
})

// return to the start once the usability test is completed
router.post('/flow1/completed', function(request, response) {
  request.session.destroy();
  response.redirect("/")
})

module.exports = router;