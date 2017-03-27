const forge = require('node-forge');
const fs = require('fs');

try {
    // openssl genrsa -out smime.key 2048
    console.log('Generating 2048-bit key-pair...');
    var keys = forge.pki.rsa.generateKeyPair(2048);
    console.log('Key-pair created.');

    // openssl req -new -config ../openssl.cnf -key smime.key -out smime.csr
    // Note: Doesn't actually use .cnf, read in .key or output .csr; done in-memory
    // Note: Could skip creating a CSR here if you're the one generating the keys
    console.log('Creating certification request (CSR) ...');
    var csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([{
        name: 'commonName',
        value: 'example.org'
    }, {
        name: 'countryName',
        value: 'US'
    }, {
        shortName: 'ST',
        value: 'Virginia'
    }, {
        name: 'localityName',
        value: 'Blacksburg'
    }, {
        name: 'organizationName',
        value: 'Test'
    }, {
        shortName: 'OU',
        value: 'Test'
    }]);
    // add optional attributes
    csr.setAttributes([{
     name: 'challengePassword',
     value: 'password'
     }, {
     name: 'unstructuredName',
     value: 'My company'
     }]);

    // sign certification request
    csr.sign(keys.privateKey);
    console.log('Certification request (CSR) created.');
    // verify certification request
    if(csr.verify()) {
        console.log('Certification request (CSR) verified.');
        console.log(keys);
        let pem = forge.pki.certificationRequestToPem(csr);
        let privateKey = pki.decryptRsaPrivateKey(pem, 'password');
        fs.writeFileSync(__dirname + '/server.csr', pem, {encoding: 'binary'});
        fs.writeFileSync(__dirname + '/server.key', privateKey, {encoding: 'binary'});
    }
    else {
        throw new Error('Signature not verified.');
    }
}catch(error){
    console.log('Error: ' + JSON.stringify(error, null, 2));
}