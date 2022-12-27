// Node.js program to demonstrate the
// x509.publicKey APi

// Importing crypto module
const {X509Certificate} = require('crypto')

// Importing fs module
const fs = require('fs')

// Getting object of a PEM encoded X509 Certificate.
const x509 = new X509Certificate(fs.readFileSync('public-cert.pem'));

// Getting publicKey included in this certificate.
// by using x509.publicKey api
const value = x509.publicKey

// Display the result
console.log("Type of public key :- " + value.asymmetricKeyType)


// Node.js program to demonstrate the  
// x509.publicKey APi

// Display the result
console.log((new X509Certificate(fs.readFileSync('public-cert.pem'))).publicKey)