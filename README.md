# chase-deposit-details-parser
This module takes the PDF downloadable from Chase's website's 'Deposit Details' page associated with a deposit and extracts the check details from it.

## Last validation of statements

The statements in this README were last validated on:

* `01-18-2018`

## Inspiration

For downloading deposit information, the Chase Business website only provides `PDF` as an option, and not any easily parsable file formats, such as a CSV.

## Usage

1. Retrieve a Chase deposit details PDF as follows:
    * Log into the Chase Business website (www.chase.com) with your credentials
    * Navigate to the `Accounts` page to view listed transactions. 
    * Among the transactions, locate a `deposit` of interest, and click on the `deposit details` associated with it, which is an icon in the shape of a `check`.
    * On the details page, click on the click on the `print` button and save the output to a `PDF`, making note of where the PDF was saved.

2. Install the package to your repository.

`npm install chase-deposit-details-parser`

3. Use the package, passing your Chase deposit details PDF location into it. 

```javascript

const detailsParser = require('chase-deposit-details-parser`');

// Extract deposit details
detailsParser('path/to/details.pdf')

.then(extractedDetails => {
  /* Ex. extractedDetails:
   
    {
      success: true,
      msg: 'Extraction complete',
      deposits: [
        { 
          num: '500920052',
          amt: '$240.00',
          acct: '658533013',
          rout: '044000037' 
        }
      ]
    }

  */

})

.catch(e => {
  console.log('Parsing error: ', e);

});



```

## Limitations

* The library can only extract what is provided in the PDF exported from Chase, which includes the following from each check:
  * Check number
  * Amount
  * Account number
  * Routing number
* The account number may NOT be enough to match a deposit with an individual. This is because if payments are made via an automated bank process, such as bill pay, the account number may be that of the bank, not of the individual. There are currently no other identifiers in the deposit detail page that would create a one-to-one relationship with an individual. To identify individuals with certainty, viewing image of the scanned check is required.