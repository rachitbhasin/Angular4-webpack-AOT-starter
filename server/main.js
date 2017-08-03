const compression = require('compression');
const express = require('express');
const spdy = require('spdy');
const logger = require('winston');
const fs = require('fs');
const path = require('path');
const url = require('url');
const opn = require('opn');

//=========================================================
//  SETUP
//---------------------------------------------------------
const HOST = 'localhost';
const PORT = 3000;

const ROOT_DIR = process.cwd();
const DIST_DIR = `${ROOT_DIR}/dist`;

const NODE_ENV = process.env.NODE_ENV;

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

let indexFile = '';
let files = {};
let urlName = 'index.html';
if(NODE_ENV === 'http2'){
  // Read dist folder and get the list of files
  fs.readdir(`${DIST_DIR}`, (error, data)=>{
    // Loop over the list of files
    data.forEach(name=>{
        // Ignore if file is index.html
        if(`${name}` != 'index.html'){
          let fileToPushPath = path.join(`${DIST_DIR}`, `${name}`)
          // Read the file that needs to be pushed
          fs.readFile(fileToPushPath, (error, data)=>{
            try{
              // Push the contents of the file to files array
              files[`${name}`] = data;
            }catch(error){
              logger.error(error);
            }
          })    
        } 
    })
  })

  fs.readFile(path.join(`${DIST_DIR}`, urlName), (error, data)=>{
    if(error){
      logger.error(error)
      return;
    }
    indexFile = data;
  })
}

router.all('*', (req, res) => {
  // Only perform server push if NODE_ENV is http2
  if(NODE_ENV === 'http2'){
        //Create a list of assests to be pushed
        let assets = Object.keys(files)
                        .map((fileToPush)=>{
        logger.info("File to push: " + fileToPush);
        //Return a function that calls itself recursively 
        return (cb)=>{
            logger.info('Will push: ', fileToPush)
            try {
              // Push file to response stream
              res.push(`/${fileToPush}`, {}).end(files[fileToPush])
              cb()
            } catch(e) {
              cb(e)
            }
        }
      })
      
      // Append the function to left of the assets array.
      assets.unshift((cb)=>{
          // Write index.html to response
          res.write(indexFile);
          // start recursion
          cb();
      })

      // Execute assets array in parallel and end response. 
      require('neo-async').parallel(assets, (results)=>{
        res.end()
      })
    
  }else{
    // If NODE_ENV is not equal to http2 send index.html to browser
    res.sendFile(`${DIST_DIR}/index.html`);
  }
});


app.use(router);


//=========================================================
//  START HTTP2 SERVER
//---------------------------------------------------------
if(NODE_ENV === 'http2'){
  
  const options = {
    key: fs.readFileSync(path.resolve('server/certs') + '/server.key'),
    cert:  fs.readFileSync(path.resolve('server/certs') + '/server.crt')
  }

  spdy
    .createServer(options, app)
    .listen(PORT, HOST, error => {
    if (error) {
      logger.error(error);
      return process.exit(1)
    }
    else {
      logger.info(`Server listening @ https://${HOST}:${PORT}`);
      opn(`https://${HOST}:${PORT}`);
    }
  });
}
//=========================================================
//  START HTTP1.1 SERVER
//---------------------------------------------------------
else{
  app.listen(PORT, HOST, error => {
    if (error) {
      logger.error(error);
      return process.exit(1)
    }
    else {
      logger.info(`Server listening @ ${HOST}:${PORT}`);
      opn(`http://${HOST}:${PORT}`);
    }
  });
}

