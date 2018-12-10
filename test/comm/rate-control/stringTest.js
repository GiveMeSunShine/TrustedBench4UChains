/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */


'use strict';
const stringRandom = require('crypto');

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
    console.log(' data => ' + json.data + ' \n index1 => ' + json.index1 + ' \n index2 => ' + json.index2 + ' \n index3 => ' + json.index3 );
}

main();





