const compression = require('compression');
const express = require('express');
const logger = require('winston');


//=========================================================
//  SETUP
//---------------------------------------------------------
const HOST = '0.0.0.0';
const PORT = 3000;

const ROOT_DIR = process.cwd();
const DIST_DIR = `${ROOT_DIR}/dist`;

const app = express();

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
app.listen(PORT, HOST, error => {
  if (error) {
    logger.error(error);
  }
  else {
    logger.info(`Server listening @ ${HOST}:${PORT}`);
  }
});
