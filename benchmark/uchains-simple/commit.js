/**
 * Add Copyright 2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';
const crypto = require('crypto');
const Util = require('../../src/comm/util');

let bc, contx;

let txIds = [];

/**
 * get commit args
 * @returns {string}  return commit args
 */
function getArgs(){
    let str = crypto.randomBytes(32).toString('hex');
    let index1 = crypto.randomBytes(8).toString('hex');
    let index2 = crypto.randomBytes(8).toString('hex');
    let index3 = crypto.randomBytes(8).toString('hex');
    let args = '{ "data": "' + str + '","index1":"'+ index1 +'","index2":"'+ index2 +'","index3":"'+index3+'"}';
    Util.log( ' args is : ' + args);
    return args;
}

module.exports.init = function(blockchain, context, args) {
    bc       = blockchain;
    contx    = context;
    return Promise.resolve();
};

module.exports.run = function () {
    Util.log(' *** POE commit Start ***' + ' ');
    let args = getArgs();
    let argsJson = JSON.parse(args);
    return bc.invokeSmartContract(contx, 'poeHeavy', '1-0-0', argsJson, 50000).then((txId)=>{
        Util.log(' ==> POE commit success txId : ' + txId);
        txIds.push(txId);
    })
        .catch((err) => {
            Util.log(' ==> POE commit failed : ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
};


module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};

module.exports.txIds = txIds;