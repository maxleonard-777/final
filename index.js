firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')
    // Build the markup for the sign-out button and set the HTML in the header
    document.querySelector(`.sign-in-or-sign-out`).innerHTML = `
    <button class="text-blue-500 underline sign-out">Sign Out</button>
    `
  
    // get a reference to the sign out button
    let signOutButton = document.querySelector(`.sign-out`)

    // handle the sign out button click
    signOutButton.addEventListener(`click`, function(event) {
    // sign out of firebase authentication
    firebase.auth().signOut()

    // redirect to the home page
    document.location.href = `index.html`
    })

    // Create Position/Order Area including previous orders
    let costBasis = 0
    let totalProceeds = 0
    let netReturns = 0
    let userId = user.uid

    // build URL for the current user's data
    let dataPull = `/.netlify/functions/holdings?userId=${userId}`

    // // Fetch the url, wait for a response, store the response in memory
    let response = await fetch(dataPull)

    // Fetch URL, wait for response, store in memory
    let json = await response.json()

    // write response to console
    console.log(json)

    // grab reference to previous orders section
    let ordersDiv = document.querySelector(`#previousOrders`)

    // loop through existing data
    for (let i = 0; i < json.length; i++) {
      let order = json[i]

      // insert data into orders table
      ordersDiv.insertAdjacentHTML(`beforeend`,`
          <tr style="text-align:center">
            <td class="table-cell center" id="ticker-table-cell">${order.ticker}</td>
            <td class="table-cell" id="company-name-table-cell">${order.companyName}</td>
            <td class="table-cell" id="transaction-date-table-cell">${order.transactionDate}</td>
            <td class="table-cell" id="transaction-price-table-cell">${order.avgPurchasePrice}</td>
            <td class="table-cell" id="quantity-table-cell">${order.quantity}</td>
            <td class="table-cell" id="order-type-table-cell">${order.buy}</td>
            <td class="table-cell" id="sale-price-table-cell">${order.salePrice}</td>
          </tr>
      </div>
      `)
     
      costBasis = costBasis + order.quantity*order.avgPurchasePrice
      totalProceeds = totalProceeds + order.quantity*order.salePrice
      netReturns = totalProceeds - costBasis
     
      //replace return divs with info above

      let costBasisHTML = document.querySelector('.costBasis')
      costBasisHTML.innerHTML = `
      <div class="costBasis"> 
      Total Investment Amount ($) = ${costBasis}
      </div>
      `
      let totalProceedsHTML = document.querySelector('.totalProceeds')
      totalProceedsHTML.innerHTML = `
      <div class="totalProceeds"> 
      Total Proceeds from Investments ($) = ${totalProceeds}
      </div>
      `

      let netReturnsHTML = document.querySelector('.netReturns')
      netReturnsHTML.innerHTML = `
      <div class="netReturns"> 
      Net Returns ($) = ${netReturns}
      </div>
      `
    }
    // Add position section below       
    
    // get a reference to the Add Position button
    let addPositionButton = document.querySelector(`#add-position-button`)

    // event listener for the Add Position
    addPositionButton.addEventListener(`click` , async function(event) {
      // ignore the default behavior
      event.preventDefault()

      // get a reference to the newly position input
      let positionInput = document.querySelector(`#positionInput`)
      // console.log(positionInput)

      // // get the contents on the inputs
      let ticker = positionInput.ticker.value
      let companyName = positionInput.companyName.value
      let transactionDate = positionInput.transactionDate.value
      let avgPurchasePrice = positionInput.avgPurchasePrice.value
      let quantity = positionInput.quantity.value
      let buy = positionInput.buy.value
      let salePrice = positionInput.salePrice.value

      // Build the URL for our order API
      let url = `/.netlify/functions/create_holding?ticker=${ticker}&userId=${userId}&companyName=${companyName}&transactionDate=${transactionDate}&avgPurchasePrice=${avgPurchasePrice}&quantity=${quantity}&buy=${buy}&salePrice=${salePrice}`

      let urlResponse = await fetch(url)

      // refresh page
      location.reload()

      }


  )
  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})
