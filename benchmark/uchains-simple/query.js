/**
 * Add Copyright 2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';
let bc, contx;
let txIds;
const Util = require('../../src/comm/util');

module.exports.init = function(blockchain, context, args) {
    let commit = require('./commit.js');
    bc       = blockchain;
    contx    = context;
    txIds    = commit.txIds;
    return Promise.resolve();
};

module.exports.run = function () {
    const txId  = txIds[Math.floor(Math.random()*(txIds.length))];
    Util.log(' *** POE Query Start ***'+ ' ');
    return bc.queryState(contx, 'poe', 'v0', txId).then((result) => {
        if(result === '0000'){
            Util.log(' ==> POE query success txId : ' + txId);
            txIds.pull(txId);
        }else{
            Util.log(' ==> POE query failed txId : ' + txId);
        }
        Util.log(' *** POE Query End ***'+ ' ');
    });
};


module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};