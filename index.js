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

    // Create Position/Order Area
    let costBasis = 0
    let totalProceeds = 0
    let netReturns = 0

    // get a reference to the Add Position button
    let addPositionButton = document.querySelector(`#add-position-button`)

    // event listener for the Add Position
    addPositionButton.addEventListener(`click` , async function(event) {
      // ignore the default behavior
      event.preventDefault()
      // console.log(event)

      // get a reference to the newly position input
      let positionInput = document.querySelector(`#positionInput`)
      // console.log(positionInput)

      // get the contents on the inputs
      let ticker = positionInput.ticker.value
      let userId = user.uid
      let companyName = positionInput.companyName.value
      let transactionDate = positionInput.transactionDate.value
      let avgPurchasePrice = positionInput.avgPurchasePrice.value
      let quantity = positionInput.quantity.value
      let buy = positionInput.buy.value
      let salePrice = positionInput.salePrice.value
      //console.log(ticker)
     
            // Build the URL for our order API
      let url = `/.netlify/functions/create_holding?ticker=${ticker}&userId=${userId}&companyName=${companyName}&transactionDate=${transactionDate}&avgPurchasePrice=${avgPurchasePrice}&quantity=${quantity}&buy=${buy}&salePrice=${salePrice}`
      //console.log(url)

      // // Fetch the url, wait for a response, store the response in memory
      let response = await fetch(url)
      
      // grab reference to previous order area
      let ordersDiv = document.querySelector(`#previousOrders`)

      //create some markup, insert data into the area
      
      ordersDiv.insertAdjacentHTML(`beforeend`,`
      <div class="table-row holding">
      <!-- Fill in orders with backend below, example shown here as reference only -->
      <tr style="text-align:center">
        <td class="table-cell center" id="ticker-table-cell">${ticker}</td>
        <td class="table-cell" id="company-name-table-cell">${companyName}</td>
        <td class="table-cell" id="transaction-date-table-cell">${transactionDate}</td>
        <td class="table-cell" id="transaction-price-table-cell">${avgPurchasePrice}</td>
        <td class="table-cell" id="quantity-table-cell">${quantity}</td>
        <td class="table-cell" id="order-type-table-cell">${buy}</td>
        <td class="table-cell" id="sale-price-table-cell">${salePrice}</td>
      </tr>
    </div>
      `)

    // //End create position / order area

    // YTD performance calculations code goes here, need to loop through table and make calculations


      // conditional for buy order, no sell
    if (isNaN(avgPurchasePrice) == false && quantity > 0 && isNaN(costBasis) == false) {
      costBasis = costBasis + quantity*avgPurchasePrice
    }

    //conditional for sell order, no buy
    if (isNaN(salePrice) == false && quantity > 0 && isNaN(avgPurchasePrice) == true) {
      totalProceeds = totalProceeds + quantity*salePrice
    }

    // conditional for buy and sell in same order

    if (isNaN(salePrice) == false && salePrice > 0 && quantity > 0 && isNaN(avgPurchasePrice) == false) {
      costBasis = costBasis + quantity*avgPurchasePrice
      totalProceeds = totalProceeds + quantity*salePrice
    }
    
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
