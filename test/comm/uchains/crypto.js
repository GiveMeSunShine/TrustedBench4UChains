/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */


'use strict';

//const crypto = require('crypto');
const fs = require('fs');
const NodeRSA = require('node-rsa');

/**
 * get string RSA sign
 * @param {string} words string words
 * @returns {string} words's sign
 */
function getRSASign(words) {
    let privateKey = fs.readFileSync(__dirname + '/txRootCA.key').toString();
    const key = new NodeRSA(privateKey,'pkcs1-private',{b:256,signingScheme:'sha1'});
    let signture = key.sign(new Buffer(words)).toString('hex');
    return signture;
}


/**
 * test node rsa
 * @param {string} words string
 * @param {object} algorithm encory type
 */
/*function hashAlgorithm(words,algorithm) {
    let privateKey = fs.readFileSync(__dirname + '/txRootCA.key').toString();
    let shasum = crypto.createSign(algorithm).update(words).sign(privateKey,'hex');

    console.log(algorithm + ' : ' + shasum);
}*/


/**
 * the main function
 */
function main() {
    let words = 'regChainId=poeHeavy&currVersion=1-0-0&cmdType=5&fileHash=8c27cfa136e97a8ce537a7ff5e5831ff93c8592b59821b9a10c31182da640c15';
    let signStr = getRSASign(words);
    console.log('Sign words : ' + words );
    console.log('Sign result : ' + signStr + '\n');

    /*let algs = crypto.getHashes();

    algs.forEach(function (name) {
        hashAlgorithm(words,name);
    });*/

}

main();


