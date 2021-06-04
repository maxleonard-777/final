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
      let companyName = positionInput.companyName.value
      let transactionDate = positionInput.transactionDate.value
      let avgPurchasePrice = positionInput.avgPurchasePrice.value
      let quantity = positionInput.quantity.value
      let buy = positionInput.buy.value
      let salePrice = positionInput.salePrice.value
      console.log(ticker)
     
      // Build the URL for our order API
      let url = `.netlify/functions/create_holding?ticker=${ticker}&companyName=${companyName}&transactionDate=${transactionDate}&avgPurchasePrice=${avgPurchasePrice}&quantity=${quantity}&buy=${buy}&salePrice=${salePrice}`

      // // Fetch the url, wait for a response, store the response in memory
      let response = await fetch(url)
      console.log(response)

      // // refresh the page
      location.reload()

      // //End create position / order area
    })

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

  let test = 1
  console.log(test)
})
