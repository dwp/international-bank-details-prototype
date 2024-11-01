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

// ***************************************************************************


// set up the initial data
router.get('/', function(request, response){
  
  request.session.data['allData'] = createAllData(request);
  request.session.save();
  response.render("index.html");
})

// flow 1


// ------------- gets

// detect if we're coming from check answers
router.get('/flow1/account-type-alt1', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/flow1/account-type-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/flow1/location-alt1', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/flow1/location-alt1", {isChange});
})
// detect if we're coming from check answers
router.get('/flow1/bank-details', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/flow1/bank-details", {isChange});
})

// get check answers ready
router.get('/flow1/check-answers', function(request, response){
  console.log('getting display type and rendering check answers')
  
  accountDisplayText = convertAccountTypeToDisplayText(request.session.data['account-type'])
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


// ***************************************************************************
// flow 2


// ------------- gets



// detect if we're coming from check answers
router.get('/flow2/account-type-alt1', function(request, response){
  try {
    // todo: refactor to use param
    var isChange = isAChangeRequest(request)
  response.render("/flow2/account-type-alt1", {isChange});
}
catch(err) {
  request.session.destroy();
  response.redirect("/")
  }
})
// detect if we're coming from check answers
router.get('/flow2/location-alt5', function(request, response){
  try {
    var isChange = isAChangeRequest(request)
  response.render("/flow2/location-alt5", {isChange});    
}
  catch(err) {
    request.session.destroy();
    response.redirect("/")
    }

})
// detect if we're coming from check answers
router.get('/flow2/country-code', function(request, response){
  try {
    // todo: refactor to use param
    var isChange = isAChangeRequest(request)
  response.render("/flow2/country-code", {isChange});
}
catch(err) {
  request.session.destroy();
  response.redirect("/")
  }
})

// start the flow with the right data
router.get('/flow2/location', function(request, response){
  try {
    var option = parseInt(request.query.option);
    request.session.data['cardNumber'] = option;
    
    request.session.data['chosenCard'] = request.session.data['scenarioData']['cards'][option]
    //request.session.data['chosenCard'] = request.session.data['scenarioData']['cards'][];
    response.redirect("/flow2/location-alt5");
    }
  catch(err) {
    request.session.destroy();
    response.redirect("/")
    }
  
})

// detect if we're coming from check answers
router.get('/flow2/bank-details', function(request, response){
  var isChange = isAChangeRequest(request)
  response.render("/flow2/bank-details", {isChange});
})

// get check answers ready
router.get('/flow2/check-answers', function(request, response){
  console.log('getting display type and rendering check answers')
  
  accountDisplayText = convertAccountTypeToDisplayText(request.session.data['account-type'])
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
  // todo: commit the answers given
  try {
    var card = {
      benefit: request.session.data['chosenCard']['benefit'],
      location: "No",
      accountType: request.session.data['account-type'],
      accountHolderName: request.session.data['accountHolderName'],
      bankName: request.session.data['bankName'],
      bankAddress: request.session.data['bankAddress'],
      countryCode: request.session.data['countryCode'],
      bicSwift: request.session.data['bicSwift'],
      ibanNumber: request.session.data['ibanNumber']
  }
  request.session.data['chosenCard'] = null;
  request.session.data['location'] = null;
  request.session.data['account-type'] = null;
  request.session.data['accountHolderName'] = null;
  request.session.data['bankName'] = null;
  request.session.data['bankAddress'] = null;
  request.session.data['countryCode'] = null;
  request.session.data['bicSwift'] = null;
  request.session.data['ibanNumber'] = null;


  console.log("^^^^^^^^^^^^^^^^^  card = " + JSON.stringify(card, null, 2))
  request.session.data['scenarioData']['cards'][parseInt(request.session.data.option)] = card;
  response.redirect("/flow2/benefit-selection")
  //response.redirect("/")
}
  catch(err) {
    console.log("££££££££££££££££££££ an error has happened " + JSON.stringify(err, null, 2))

    //request.session.destroy();
    response.redirect("/")
    }
  

    
})

// return to the start once the usability test is completed
router.post('/flow2/completed', function(request, response) {
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
function isAChangeRequest(request) {
  if (typeof request.get('Referrer') == 'undefined') return false;
  if (request.get('Referrer').endsWith('check-answers')) return true;
  return false;
}

function createAllData(request) {

return [
  {
    name:"Marjory Pilks",
  cards:[
    {
      benefit: "Maternity allowance",
      location: 'No',
      accountType: "CURRENT",
      accountHolderName: "Marjory Pilks",
      bankName: "BANQUE DE FRANCE",
      bankAddress: "39 RUE CROIX DES PETITS CHAMPS, PARIS, France",
      countryCode: "FRA",
      bicSwift: "BDFEFRPPXXX",
      ibanNumber: "FR1420041010050500013M02606"
    },
    {
      benefit: "Personal independence payment",
      location: 'Yes',
      accountHolderName: "Marjory Pilks",
      bankName: "Lloyds",
      sortCode: "209778",
      accountNumber: "70372609",
      rollOrMembershipNumber: "9123456789"
    },
    {
      benefit: "Carer's allowance",
      location: 'Yes',
      accountHolderName: "Priti Mistry",
      bankName: "Natwest",
      sortCode: "432718",
      accountNumber: "87114920",
      rollOrMembershipNumber: "5746984251"
    }
  ]
},
{
  name:"Brendan Fraser",
cards:[
  {
    benefit: "Maternity allowance",
    location: 'No',
    accountType: "CURRENT",
    accountHolderName: "Marjory Pilks",
    bankName: "BANQUE DE FRANCE",
    bankAddress: "39 RUE CROIX DES PETITS CHAMPS, PARIS, France",
    countryCode: "FRA",
    bicSwift: "BDFEFRPPXXX",
    ibanNumber: "FR1420041010050500013M02606"
  },
  {
    benefit: "Personal independence payment",
    location: 'Yes',
    accountHolderName: "Marjory Pilks",
    bankName: "Lloyds",
    sortCode: "209778",
    accountNumber: "70372609",
    rollOrMembershipNumber: "9123456789"
  },
  {
    benefit: "Carer's allowance",
    location: 'Yes',
    accountHolderName: "Priti Mistry",
    bankName: "Natwest",
    sortCode: "432718",
    accountNumber: "87114920",
    rollOrMembershipNumber: "5746984251"
  }
]
},
{
  name:"Antonio Banderas",
cards:[
  {
    benefit: "Maternity allowance",
    location: 'No',
    accountType: "CURRENT",
    accountHolderName: "Marjory Pilks",
    bankName: "BANQUE DE FRANCE",
    bankAddress: "39 RUE CROIX DES PETITS CHAMPS, PARIS, France",
    countryCode: "FRA",
    bicSwift: "BDFEFRPPXXX",
    ibanNumber: "FR1420041010050500013M02606"
  },
  {
    benefit: "Personal independence payment",
    location: 'Yes',
    accountHolderName: "Marjory Pilks",
    bankName: "Lloyds",
    sortCode: "209778",
    accountNumber: "70372609",
    rollOrMembershipNumber: "9123456789"
  },
  {
    benefit: "Carer's allowance",
    location: 'Yes',
    accountHolderName: "Priti Mistry",
    bankName: "Natwest",
    sortCode: "432718",
    accountNumber: "87114920",
    rollOrMembershipNumber: "5746984251"
  }
]
},
{
  name:"Tom Hanks",
cards:[
  {
    benefit: "Maternity allowance",
    location: 'No',
    accountType: "CURRENT",
    accountHolderName: "Marjory Pilks",
    bankName: "BANQUE DE FRANCE",
    bankAddress: "39 RUE CROIX DES PETITS CHAMPS, PARIS, France",
    countryCode: "FRA",
    bicSwift: "BDFEFRPPXXX",
    ibanNumber: "FR1420041010050500013M02606"
  },
  {
    benefit: "Personal independence payment",
    location: 'Yes',
    accountHolderName: "Marjory Pilks",
    bankName: "209778 Short Name",
    sortCode: "209778",
    accountNumber: "70372609",
    rollOrMembershipNumber: "9123456789"
  },
  {
    benefit: "Carer's allowance",
    location: 'Yes',
    accountHolderName: "Priti Mistry",
    bankName: "Natwest",
    sortCode: "432718",
    accountNumber: "87114920",
    rollOrMembershipNumber: "5746984251"
  }
]
}

]
}