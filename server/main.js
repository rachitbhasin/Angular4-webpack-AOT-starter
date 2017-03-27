const compression = require('compression');
const express = require('express');
const spdy = require('spdy')
const logger = require('winston');
const fs = require('fs')
const path = require('path');


//=========================================================
//  SETUP
//---------------------------------------------------------
const HOST = '0.0.0.0';
const PORT = 3000;

const ROOT_DIR = process.cwd();
const DIST_DIR = `${ROOT_DIR}/dist`;

const app = express();

const options = {
    key: fs.readFileSync(path.resolve('server/certs') + '/server.key'),
    cert:  fs.readFileSync(path.resolve('server/certs') + '/server.crt')
}

// gzip compression
app.use(compression());

// request logging
app.use(require('morgan')('dev'));

// static files
app.use(express.static(DIST_DIR, {index: false}));


//=========================================================
//  ROUTER
//---------------------------------------------------------
const router = new express.Router();

router.all('*', (req, res) => {
  res.sendFile(`${DIST_DIR}/index.html`);
});

app.use(router);


//=========================================================
//  START SERVER
//---------------------------------------------------------
spdy
  .createServer(options, app)
  .listen(PORT, HOST, error => {
  if (error) {
    logger.error(error);
    return process.exit(1)
  }
  else {
    logger.info(`Server listening @ ${HOST}:${PORT}`);
  }
});
