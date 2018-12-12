/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */


'use strict';
const stringRandom = require('crypto');
//const request = require('request-promise');
/**
 * the main function
 */
function main() {
    let str = stringRandom.randomBytes(32).toString('hex');
    let index1 = stringRandom.randomBytes(8).toString('hex');
    let index2 = stringRandom.randomBytes(8).toString('hex');
    let index3 = stringRandom.randomBytes(8).toString('hex');
    let args = '{ "data": "' + str + '","index1":"'+ index1 +'","index2":"'+ index2 +'","index3":"'+index3+'"}';
    console.log( ' str is : ' + str);
    let json = JSON.parse(args);
    console.log('json is :' + JSON.stringify(json,null,2));

    let link = 'http://localhost:7051/UChains/poeHeavy/poeHeavy/transaction';
    console.log(' ==> link [ ' + link + ' ]');
    /*let options = {
        url: link,
        method: 'POST',
        json: true,
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return request(options)
        .then(function(body) {
            console.log(' ==> body [ ' + body.toString() + ' ]');
            let code = body.code;
            if(code === '0000'){
                let txid = body.txid;
                console.log(' ==> txID [ ' + txid + ' ]');
            }
        })
        .catch(function (err) {
            console.log(' ==> submit Transaction request failed, ' + (err.stack ? err.stack : err));
        });*/
}

main();
