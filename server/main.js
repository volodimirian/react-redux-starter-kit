const express = require('express')
const path = require('path')
const webpack = require('webpack')
const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const project = require('../project.config')
const compress = require('compression')
const crypto = require('crypto')

const app = express()
app.use(compress())

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function calculateRandTimesTamp() {
  let year = getRandomInt(2017, 2018);
  let month;
  let day;
  if (year === 2017) {
    month = getRandomInt(0, 11)
  } else {
    month = getRandomInt(0, 4)
  }

  if (month !== 1) {
    day = getRandomInt(1, 29)
  } else {
    day = getRandomInt(1, 31)
  }

  return new Date(year, month, day).getTime()
}

function generateStateAndStatus() {
  let states = [
    {
      state: 'warehouse_processing',
      descr: 'Delay in delivery'
    }, 
    {
      state: 'tracking',
      descr: 'Delivery process is well'
    },
    {
      state: 'completed',
      descr: 'Delivery is finished'
    }
  ]

  return states[getRandomInt(0, 3)] 
}

function calculateCoords() {
  let latFrom = 59703;
  let latTill = 78519;
  let lngFrom = 05640;
  let lngTill = 39192;
  let lat = '37.7';
  let lng = '-122.4';  
  return {
    lat: parseFloat(lat + getRandomInt(latFrom, latTill)),
    lng: parseFloat(lng + getRandomInt(lngFrom, lngTill))
  }
}

function generateData(count) {
  let data = [];
  
  for (let i = 0; i < count; i++) {
    let st = generateStateAndStatus();
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    
    data.push({
      id: getRandomInt(12000, 90000),
      date: calculateRandTimesTamp(),
      tracking_number: crypto.createHash('sha1').update(current_date + random).digest('hex').slice(0, 10), 
      delivery_state: st.state,
      delivery_status: st.descr,
      delivery_date: calculateRandTimesTamp(),
      exact_delivery_date: calculateRandTimesTamp(),
      coord: calculateCoords()
    }) 
  }

  return data;
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  logger.info('Enabling webpack development and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : path.resolve(project.basePath, project.srcDir),
    hot         : true,
    quiet       : false,
    noInfo      : false,
    lazy        : false,
    stats       : 'normal',
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(path.resolve(project.basePath, 'public')))
  
  app.get('/api/orders', function(req, res, next) {
    res.set('contnet-type', 'application/json')
    res.send({
      data: generateData(100),
      pages: 1
    })
    res.end();
  })
  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  /* app.use('/', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  }) */

} else {
  logger.warn(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = app
