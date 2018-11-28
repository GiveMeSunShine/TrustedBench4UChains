/**
 * Add Copyright 2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';
let bc, contx;

module.exports.init = function(blockchain, context, args) {
    bc       = blockchain;
    contx    = context;
    return Promise.resolve();
};

module.exports.run = function () {
    return bc.invokeSmartContract(contx, 'poe', 'v0', {verb: 'open', account: 'sdcarvf21vcascaf12webryujhre21evsgd', money: '100000'} , 5000);
};


module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};