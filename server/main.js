const compression = require('compression');
const express = require('express');
const spdy = require('spdy');
const logger = require('winston');
const fs = require('fs');
const path = require('path');
const url = require('url');

//=========================================================
//  SETUP
//---------------------------------------------------------
const HOST = '0.0.0.0';
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

let files = []
if(NODE_ENV === 'http2'){
  fs.readdir(`${DIST_DIR}`, (error, data)=>{
    data.forEach(name=>{
        if(`${name}` != 'index.html') files.push(`${name}`);
    })
    console.log(files);
  })
}

router.all('*', (req, res) => {
  if(NODE_ENV === 'http2'){
    let urlName = 'index.html';
      console.log("Index file")
        let assets = files.filter(name=>(name.substr(0,4)!='http'))
        .map((fileToPush)=>{
        let fileToPushPath = path.join(`${DIST_DIR}`, fileToPush)
        console.log("File to push: " + fileToPushPath);
        return (cb)=>{
          fs.readFile(fileToPushPath, (error, data)=>{
            if (error) return cb(error)
            console.log('Will push: ', fileToPush, fileToPushPath)
            try {
              res.push(`/${fileToPush}`, {}).end(data)
              cb()
            } catch(e) {
              cb(e)
            }
          })
        }
      })
      
      assets.unshift((cb)=>{
        fs.readFile(path.join(`${DIST_DIR}`, urlName), (error, data)=>{
          if (error) return cb(error)
          res.write(data)
          cb()
        })
      })

      require('neo-async').parallel(assets, (results)=>{
        res.end()
      })
    
  }else{
    res.sendFile(`${DIST_DIR}/index.html`);
  }
  //res.sendFile(`${DIST_DIR}/index.html`);
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
    }
  });
}

