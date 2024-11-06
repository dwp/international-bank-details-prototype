//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const functions = require('./functions.js')





const flow1 = require('./flow1.js')
const flow2 = require('./flow2.js')
const flow3 = require('./flow3.js')

router.use(flow1);
router.use(flow2);
router.use(flow3);

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



// set up the initial data
router.get('/', function(request, response){
  request.session.data['allData'] = functions.createAllData();
  response.render("index.html");
})
