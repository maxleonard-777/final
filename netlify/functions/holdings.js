// Goal: Provide a function to return all holdings from Firebase for a given user of our choice.
//***Should this be under node modules rather than netlify functions? */
// allows us to use firebase
let firebase = require(`./firebase`)

// /.netlify/functions/holdings?userId=0KQ6sCFPYmjUW1OoznJ1
exports.handler = async function(event) {
  // define an empty Array to hold the return value from our lambda
  let returnValue = []

  // establish a connection to firebase in memory
  let db = firebase.firestore()

  // get the user being requested
  let userId = event.queryStringParameters.userId

// ask TA how to feed in the user Id dynamically from front end

// perform a query against firestore for all orders for the user we want, wait for it to return, store in memory
let ordersQuery = await db.collection('order').where('userId', '==', userId).get()

// retrieve the documents from the query
let orders = ordersQuery.docs

  // loop through the order documents for the user we want
  for (let orderIndex=0; orderIndex < orders.length; orderIndex++) {
    // get the id from the document
    let orderId = orders[orderIndex].id

    // get the data from the document
    let orderData = orders[orderIndex].data()

    // create an Object to be added to the return value of our lambda
    let orderObject = {
      id: orderId,
      avgPurchasePrice: orderData.avgPurchasePrice,
      quantity: orderData.quantity,
      buy: orderData.buy,
      salePrice: orderData.salePrice,
      assetId: orderData.assetId, // where do we want to source this from? with current setup i believe this would need to be an input
      userId: orderData.userId,
      // adding ticker, company name, transaction date to previous work - Rob 6/4/21
      ticker:orderData.ticker,
      companyName:orderData.companyName,
      transactionDate:orderData.transactionDate
    }

    // add the Object to the return value
    returnValue.push(orderObject)
  }

  // return value of our lambda
  return {
    statusCode: 200,
    body: JSON.stringify(returnValue)
  }
}