const crypto = require('crypto')
const fs = require('fs');

const filePath = "./service/"

const ciphers = crypto.getCiphers()
const hashes =  crypto.getHashes()
fs.writeFile(filePath + "ciphers.txt", ciphers.toString(), function (err,data) {
    if (err) return console.log(err);
    console.log('Ciphers || Hashes > ciphers.txt', data);
  })
  fs.writeFile(filePath + "hashes.txt", hashes.toString(), function (err,data) {
    if (err) return console.log(err);
    console.log('Ciphers || Hashes > hashes.txt', data);
  })

// console.log("Ciphers: ", crypto.getCiphers())
// console.log("Hashes: ", crypto.getHashes())