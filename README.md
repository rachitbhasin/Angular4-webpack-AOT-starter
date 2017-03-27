# Angular 4 Ahead-of-Time (AoT) Compilation

A minimal example using the Angular compiler cli to pre-compile component templates.

Files & Directories
-------------------

```
build/           // contains results of AoT compilation
dist/            // contains final minified production artifacts
src/
 |__app/
 |__index.html
 |__main.aot.ts  // entry point for production (AoT) builds
 |__main.jit.ts  // entry point for development (JiT) builds
 |__polyfills.ts
```


Generating Production Artifacts
-------------------------------

Executing `npm run build` will:

1. Perform AoT compilation and output the results to the **./build** folder
2. Bundle and minify the app sources to the **./dist** folder


Serving Production Artifacts
----------------------------

The AOT build is served using express and spdy(http/2). 
This requires self-signed SSL certificate to be created as the application is served over https.

1. Use the following commands to create a certificate.
2. Place the certificates in the **server/certs** folder

```
$ openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
...
$ openssl rsa -passin pass:x -in server.pass.key -out server.key
writing RSA key
$ rm server.pass.key
$ openssl req -new -key server.key -out server.csr
...
Country Name (2 letter code) [AU]:IN
State or Province Name (full name) [Some-State]:Delhi
...
A challenge password []:
...
$ openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```


NPM Commands
------------

|Command|Description|
|---|---|
|npm start|Start the webpack development server @ **localhost:3000**|
|npm run build|Perform AoT compilation; bunde and minify to **./dist** folder|
|npm run clean|Delete **./dist** & **./build** folders|
|npm run server|Serve the production artifacts from **./dist** folder @ https:localhost:3000|
|npm run clean:build|Run in serial **npm run clean** and **npm run build**|
|npm run cbs|Run in serial **npm run clean**, **npm run build** and **npm run server**|
