/**
 * Add Copyright 2018 YangShiHong
 * Copyright 2016 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use strict';

const commUtils = require('../comm/util');
const fs = require('fs');
const request = require('request-promise');
const NodeRSA = require('node-rsa');


/**
 * send Post request to Peer to Register Contract's version
 * @param {Object} resolve promise resolve object
 * @param {string} joinVersionLink Register Contract's version URL
 * @param {string} reqMsg request body msg
 * @param {Object} intervalID object for the request interval
 * @param {Object} timeoutID object for the request timeout
 * @returns {Promise}  The promise for the result of the execution
 */
function joinChainRequest(resolve,joinVersionLink,reqMsg,intervalID,timeoutID) {

    let msgJson = JSON.parse(reqMsg);
    let options = {
        url: joinVersionLink,
        method: 'POST',
        body: JSON.stringify(msgJson),
        headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    };
    return request(options)
        .then(function(body) {
            let code = (JSON.parse(body)).code;
            if(code === '0000'){
                let txid = (JSON.parse(body)).txid;
                commUtils.log(' ==> txID [ ' + txid + ' ]');
                clearInterval(intervalID);
                clearTimeout(timeoutID);
                return resolve(txid);
            }
        })
        .catch(function (err) {
            commUtils.log(' ==> Register chain request failed, ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
}

/**
 * Join contract version to chainManager
 * @param {string} config_path  config path
 * @returns {Promise} The promise for the result of the execution
 */
function joinChain(config_path) {
    let config = require(config_path);
    let restApiUrl = config.uchains.network.restapi.url;
    let chainId = config.uchains.contract.fileName;
    let version = config.uchains.contract.version;
    let cmdType = config.uchains.contract.joinChainCmdType;
    let appSecEnabled = config.uchains.contract.appSecEnabled;
    let txPoolEnabled = config.uchains.contract.txPoolEnabled;
    let dbType = config.uchains.contract.dbType;
    let chainType = config.uchains.contract.chainType;
    let ConsensusType = config.uchains.contract.ConsensusType;
    let bftNum = config.uchains.contract.bftNum;
    let geneBftNameStr = config.uchains.contract.geneBftName;
    let geneBftNameArr = geneBftNameStr.split(',');
    let startStr = '[';
    let endStr = ']';
    for (let i = 0; i < geneBftNameArr.length; i++ ){
        startStr = startStr + '"' + geneBftNameArr[i] + '",';
    }
    let geneBftName = startStr.substr(0,startStr.length-1) + endStr;


    //sign by private Key
    let msg = ['regChainId='+chainId, 'cmdType='+cmdType, 'appSecEnabled='+appSecEnabled,
        'dbType='+dbType,'chainType='+chainType,'txPoolEnabled='+txPoolEnabled].join('&');
    commUtils.log(' ==> sign [ ' + msg + ' ]');
    let key = config.uchains.contract.key;
    let privateKey = fs.readFileSync(key).toString();
    const singkey = new NodeRSA(privateKey,'pkcs1-private',{b:256,signingScheme:'sha1'});
    let signture = singkey.sign(new Buffer(msg)).toString('hex');
    commUtils.log(' ==> signture [ ' + signture + ' ]');

    // send register chain request to peer node
    commUtils.log(' ==> Join Chain: [' + chainId + ']');
    const joinChainLink = restApiUrl + '/UChains/chain/chainmgr';
    let reqMsg = '{"regChainId": "'+ chainId +'","cmdType": '+ cmdType +',"chainConfig": {"appSecEnabled": "'+ appSecEnabled +
        '","dbType": "'+ dbType +'","chainType": '+ chainType +',"version": "'+ version +
        '","txPoolEnabled": "'+ txPoolEnabled +'","ConsensusType": '+ ConsensusType +
        ',"chainTDMConfig":{"tenderConsensus":{"bftNum":' + bftNum +',"geneBftName":'+geneBftName+'}}'+
        '},"signature":"' + signture + '"}';

    let intervalID = 0;
    let timeoutID = 0;

    let txId = '';

    let repeat = (ms,txId) => {
        return new Promise((resolve) => {
            intervalID = setInterval(function(){
                return joinChainRequest(resolve,joinChainLink,reqMsg, intervalID, timeoutID);
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

    return Promise.race([repeat(5000,txId), timeout(10000)])
        .then(function (txId) {
            return Promise.resolve(txId);
        })
        .catch(function (error) {
            commUtils.log(' ==> Join version error: ' + error);
            return Promise.resolve(txId);
        });
}


module.exports.run = function (config_path) {
    commUtils.log(' #### Start Join Chains ####' + '');
    return joinChain(config_path).then(()=>{
        commUtils.log(' #### Join Chains OK '+' ####');
        commUtils.log(' *** UChains.installSmartContract() OK , Sleep 30s...... ' + '***');
        return commUtils.sleep(30000);
    })
        .catch((err) => {
            commUtils.log(' ==>Join Chains failed, ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
};

