/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */

'use strict';

const request = require('request-promise');
const Util = require('../../src/comm/util');


/**
 * Send a request to UChains network to get peer count
 * @param {Object} resolve promise resolve object
 * @param {String} link request uri
 * @param {Object} intervalID object for the request interval
 * @param {Object} timeoutID object for the request timeout
 * @return {Promise<object>} The promise for the result of the execution.
 */
function checkNetByRequest(resolve, link, intervalID, timeoutID) {
    let options = {
        url: link,
        method: 'GET',
        gzip: true,
        headers: {
            'User-Agent': 'request',
            'Connection': 'keep-alive'
        }
    };
    return request(options)
        .then(function(body) {
            let code = (JSON.parse(body)).code;
            if(code === '0000'){
                let peerInfo = (JSON.parse(body)).data;
                let peerCount = peerInfo.peerCount;
                Util.log(' ==> Has [ ' + peerCount + ' ] Peers in UChains Network , PeerInfo :');
                Util.log(JSON.stringify(peerInfo,null,2));
                clearInterval(intervalID);
                clearTimeout(timeoutID);
                return resolve();
            }
        })
        .catch(function (err) {
            Util.log(' ==> Get PeerInfo request failed, ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
}

/**
 * check UChains NetWork is OK ?
 * @param {string} config_path config Path
 * @returns {Promise<object>} result is a Promise object
 */
function checkNet(config_path){
    let config = require(config_path);
    let restApiUrl = config.uchains.network.restapi.url;
    const peerInfoLink = restApiUrl + '/UChains/peerinfo';
    let intervalID = 0;
    let timeoutID = 0;

    let repeat = (ms) => {
        return new Promise((resolve) => {
            intervalID = setInterval(function(){
                return checkNetByRequest(resolve, peerInfoLink, intervalID, timeoutID);
            }, ms);

        });
    };

    let timeout = (ms) => {
        return new Promise((resolve) => {
            timeoutID = setTimeout(function(){
                clearInterval(intervalID );
                return resolve();
            }, ms);
        });
    };


    return  Promise.race([repeat(120000), timeout(150000)])
        .then(function () {
            return Promise.resolve();
        })
        .catch(function(error) {
            Util.log(' ==> Check Net error: ' + error);
            return Promise.resolve();
        });
}


module.exports.run = function (config_path) {
    Util.log(' #### Check UChains Network Has Already ####'+'');
    return checkNet(config_path).then(()=>{
        Util.log(' #### UChains Network has Already !!!!'+' ####');
        return Promise.resolve();
    })
        .catch((err) => {
            Util.log(' ==> UChains Network has failed : ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
};