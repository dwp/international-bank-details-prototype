
// ------------- functions


function clearAccountData(request) {
    try {
      request.session.data['chosenCard'] = null
    request.session.data['location'] = null
    request.session.data['account-type'] = null
    request.session.data['accountHolderName'] = null
    request.session.data['bankName'] = null
    request.session.data['bankAddress'] = null
    request.session.data['countryCode'] = null
    request.session.data['bicSwift'] = null
    request.session.data['ibanNumber'] = null
    } catch (error) {
      // intentionally blank
    }
    
  }
function getScenarioData(request) {
    var nino = request.session.data['nino']
    switch (nino) {
      case 'QQ123456B':
        return request.session.data['allData'][0]
      case 'AB123456B':
        return  request.session.data['allData'][1]
      case 'CD123456B':
        return  request.session.data['allData'][2]
      case 'EF123456B':
        return  request.session.data['allData'][3]
      default:
        return null;
    }
  }
  
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
  
  function createAllData() {
  
  return [
    {
      name:"Marjory Pilks",
      cards:[
      {
        benefit: "State pension",
        location: 'No',
        accountType: "CURRENT",
        accountHolderName: "Marjory Pilks",
        bankName: "BANQUE DE FRANCE",
        bankAddress: "39 RUE CROIX DES PETITS CHAMPS, PARIS, France",
        countryCode: "FRA",
        bicSwift: "BDFEFRPPXXX",
        ibanNumber: "FR1420041010050500013M02606"
      }
    ]
  },
  {
    name:"Thomas Freeman",
    cards:[
    
      
    {
      benefit: "State pension",
      location: 'Yes',
      accountHolderName: "Thomas Freeman",
      bankName: "Lloyds",
      sortCode: "209778",
      accountNumber: "70372609",
      rollOrMembershipNumber: ""
    },
    {
      benefit: "Winter fuel",
      location: 'No',
      accountType: "CURRENT",
      accountHolderName: "Thomas Freeman",
      bankName: "DEUTSCHE BANK AG",
      bankAddress: "Taunusanlage 12 60325 FRANKFURT AM MAIN, 60262, Germany",
      countryCode: "DEU",
      bicSwift: "DEUTDEFFXXX",
      ibanNumber: "DE89370400440532013000"
    }
  ]
  },
  
  {
    name:"Gupta Basu",
    cards:[
    
    {
      benefit: "State pension",
      location: 'Yes',
      accountHolderName: "Gupta Basu",
      bankName: "Tipton and Coseley building society",
      sortCode: "202733",
      accountNumber: "70885096",
      rollOrMembershipNumber: "5746984251"
    }, 
    {
      benefit: "Winter fuel",
      location: 'Yes',
      accountHolderName: "Gupta Basu",
      bankName: "HSBC",
      sortCode: "404246",
      accountNumber: "20433122",
      rollOrMembershipNumber: ""
    }
  ]
  },
  {
    name:"Briony Fitzgerald",
    cards:[
      {
        benefit: "State pension",
        location: 'No',
        accountType: "CURRENT",
        accountHolderName: "Briony Fitzgerald",
        bankName: "BANCA NAZIONALE DEL LAVORO S.P.A.",
        bankAddress: "Viale Altiero, Spinelli, 30 - 00157, Roma",
        countryCode: "ITA",
        bicSwift: "BNLIITRRXXX",
        ibanNumber: "IT620108000000099999999"
      },
      {
        benefit: "Winter fuel",
        location: 'No',
        accountType: "CURRENT",
        accountHolderName: "Briony Fitzgerald",
        bankName: "replace",
        bankAddress: "replace",
        countryCode: "ITA",
        bicSwift: "replace",
        ibanNumber: "replace"
      },
  ]
  },
  
  ]
  }

  module.exports = {
    createAllData,
    convertAccountTypeToDisplayText,
    isAChangeRequest,
    getScenarioData,
    clearAccountData
  };