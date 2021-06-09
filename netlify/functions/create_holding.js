// Goal: Provide a function to create a new holding in Firebase

// allows us to use firebase
let firebase = require(`./firebase`)

exports.handler = async function(event) {
    //console.log(event)
  
    // get all query string parameters and store in memory
    let ticker = event.queryStringParameters.ticker
    let userId = event.queryStringParameters.userId
    let companyName = event.queryStringParameters.companyName
    let transactionDate = event.queryStringParameters.transactionDate
    let avgPurchasePrice = event.queryStringParameters.avgPurchasePrice
    let quantity = event.queryStringParameters.quantity
    let buy = event.queryStringParameters.buy
    let salePrice = event.queryStringParameters.salePrice
  
    // establish a connection to firebase in memory
    let db = firebase.firestore()
    
    let returnValue = {
      ticker: ticker,
      userId: userId, 
      companyName: companyName,
      transactionDate: transactionDate,
      avgPurchasePrice: avgPurchasePrice,
      quantity: quantity,
      buy: buy,
      salePrice: salePrice,
      created: firebase.firestore.FieldValue.serverTimestamp()
  }
        // create a new holding
        await db.collection(`order`).add(returnValue)

    return {
      statusCode: 200,
      body: JSON.stringify(returnValue)

    }
  }
  