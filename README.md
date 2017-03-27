# Angular Ahead-of-Time (AoT) Compilation

A minimal example using the Angular compiler cli to pre-compile component templates.


Files & Directories
-------------------

```
build/           // contains results of AoT compilation
dist/            // contains final minified production artifacts
src/
 |__app/
 |__home/
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


NPM Commands
------------

|Command|Description|
|---|---|
|npm start|Start the webpack development server @ **localhost:3000**|
|npm run build|Perform AoT compilation; bunde and minify to **./dist** folder|
|npm run server|Serve the production artifacts from **./dist** folder @ **localhost:3000**|
