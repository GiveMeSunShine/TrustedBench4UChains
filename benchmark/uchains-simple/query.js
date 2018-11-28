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
    return bc.queryState(contx, 'poe', 'v0', '1324csva343wecasg534w');
};


module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};