/**********************************************************
 Prove 08 Controllers
**********************************************************/
// Controller for W08
const https = require('https')

// Limit of 10 items per page.
const ITEMS_PER_PAGE = 10;

const renderIndex = (req, res, json) => {
  // Handle for GET, POST or neither
    let searchedValue = req.body.searchValue || req.query.searchValue || '';
    let page = req.query.page || 1;

    const indexStart = (page - 1) * ITEMS_PER_PAGE
    const indexEnd = page * ITEMS_PER_PAGE

    const filteredData = global.jsonResponse.filter(x =>
        x.name.toLowerCase().includes(searchedValue.toLowerCase())
    )

    let stuff = {
        data: filteredData.slice(indexStart, indexEnd),
        path: 'prove/08',
        title: 'Week 8 - Pagination',
        searchedValue: searchedValue,
        page: page,
        numPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    }

    res.render('pages/prove/prove08.ejs', stuff)
}

exports.processJson = (req, res, next) => {
    const url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json'

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

// New code for W08...
exports.getIndex = (req, res, next) => {
    renderIndex(req, res, global.jsonResponse) // Render page.
}