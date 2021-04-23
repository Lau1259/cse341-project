const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 3000

const app = express();


// Add routes. Note that I only added these other routes so that I can use the team activities dropdown without issues
const ta01Routes = require('./routes/ta01');
const ta02Routes = require('./routes/ta02');
const ta03Routes = require('./routes/ta03');
const ta04Routes = require('./routes/ta04');
const prove01Routes = require('./routes/prove01-routes');

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({
    extended: false
  }))
  .use('/', prove01Routes)
  .use('/ta01', ta01Routes)
  .use('/ta02', ta02Routes)
  .use('/ta03', ta03Routes)
  .use('/ta04', ta04Routes)
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', {
      title: '404 - Page Not Found',
      path: req.url
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));