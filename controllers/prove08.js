/**********************************************************
 Prove 08 Controllers
**********************************************************/
// Controller for W08
// import https for use in the processJson method
const https = require('https')

// Set limit of items per page.
const ITEMS_PER_PAGE = 10;

const renderIndex = (req, res, json) => {
  // Handle for GET, POST or neither
  // This is a clever way to get a value regardless of the http method used
  let searchedValue = req.body.searchValue || req.query.searchValue || '';
  // Get the page passed in as a query item or go to first
  let page = req.query.page || 1;

  /* You do minus 1 to ensure you start counting at the right number
  2*10 = 20 which should be the last index on page 2
  2-1 = 1; 1*10 = 10 which is the starting point */
  const indexStart = (page - 1) * ITEMS_PER_PAGE
  const indexEnd = page * ITEMS_PER_PAGE

  /* Both lowercased to ensure that case doesn't matter in the search.
  Clever use of a filter since the response will be an array */
  const filteredData = global.jsonResponse.filter(x =>
    x.name.toLowerCase().includes(searchedValue.toLowerCase())
  )

  // This makes it a lot easier to read the values passed into the page. I felt it increases readability
  let stuff = {
    data: filteredData.slice(indexStart, indexEnd),
    path: 'prove/08',
    title: 'Week 8 - Pagination',
    searchedValue: searchedValue,
    page: page,
    numPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  }
  // previous scaffolding makes this line very clean
  res.render('pages/prove/prove08.ejs', stuff)
}

exports.processJson = (req, res, next) => {
  const url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json'

  /* basically works like this:
  1) request data
  2) use a buffer to read it
  3) store it in a variable
  4) save it to a global var as an array by parsing the JSON
  5) Render a view using the data requested and the filters and logic above
  */
  https
    .get(url, function (response) {
      let body = ''

      response.on('data', function (chunk) {
        body += chunk
      })

      response.on('end', function () {
        global.jsonResponse = JSON.parse(body)
        renderIndex(req, res, global.jsonResponse)
      })
    })
    .on('error', function (e) {
      console.log('Got an error: ', e)
    })
}

// This is exported to be used in the routes
exports.getIndex = (req, res, next) => {
  renderIndex(req, res, global.jsonResponse) // Render page.
}