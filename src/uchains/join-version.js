/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */


'use strict';

const commUtils = require('../comm/util');
const crypto = require('crypto');
const fs = require('fs');
const request = require('request-promise');
const NodeRSA = require('node-rsa');

/**
 * send Post request to Peer to Register Contract's version
 * @param {Object} resolve promise resolve object
 * @param {string} joinVersionLink Register Contract's version URL
 * @param {string} chainId contract Id
 * @param {string} version contract version
 * @param {string} flleHash contract file Hash
 * @param {string} cmdType type
 * @param {string} signature signature
 * @param {Object} intervalID object for the request interval
 * @param {Object} timeoutID object for the request timeout
 * @returns {Promise}  The promise for the result of the execution
 */
function joinContractRequest(resolve,joinVersionLink,chainId,version,flleHash,cmdType,signature,intervalID,timeoutID) {
    let msgStr = '{"regChainId":"' + chainId + '","cmdType":"' + cmdType + '","currVersion":"' + version +
        '","fileHash":"' + flleHash + '","signature":"' + signature + '"}';
    let msgJson = JSON.parse(msgStr);
    //commUtils.log(JSON.stringify(msgJson));
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
            commUtils.log(' ==> Register contrect version request failed, ' + (err.stack ? err.stack : err));
            return Promise.reject(err);
        });
}

/**
 * Join contract version to chainManager
 * @param {string} config_path  configPath
 * @param {string} fileHash contract hash
 * @returns {Promise}  The promise for the result of the execution
 */
function joinContract(config_path,fileHash) {
    let config = require(config_path);
    let restApiUrl = config.uchains.network.restapi.url;
    const joinVersionLink = restApiUrl + '/UChains/contract/ver/entry/contractmgr';
    let chainId = config.uchains.contract.fileName;
    let version = config.uchains.contract.version;
    let cmdType = config.uchains.contract.joinVersionCmdTye;
    commUtils.log(' ==> Join Contract: [' + chainId + '] version: [' + version + ']');
    let msg = ['regChainId='+chainId, 'currVersion='+version, 'cmdType='+cmdType, 'fileHash='+fileHash].join('&');
    commUtils.log(' ==> sign [ ' + msg + ' ]');
    let key = config.uchains.contract.key;
    let privateKey = fs.readFileSync(key).toString();
    const singkey = new NodeRSA(privateKey,'pkcs1-private',{b:256,signingScheme:'sha1'});
    let signture = singkey.sign(new Buffer(msg)).toString('hex');
    commUtils.log(' ==> signture [ ' + signture + ' ]');

    let intervalID = 0;
    let timeoutID = 0;

    let txId = '';

    let repeat = (ms,txId) => {
        return new Promise((resolve) => {
            intervalID = setInterval(function(){
                return joinContractRequest(resolve,joinVersionLink,chainId, version, fileHash, cmdType, signture, intervalID, timeoutID);
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

/**
 * get contract Hash
 * @param {string} config_path config path
 * @returns {Promise}  The promise for the result of the execution
 */
function getFileHash(config_path){
    let config = require(config_path);
    let filePath = config.uchains.contract.filePath;
    let fileName = config.uchains.contract.fileName;
    let version = config.uchains.contract.version;
    commUtils.log(' ==> filePath : [' + filePath + ' ] , fileName : [ ' + fileName + ' ] , version : [ ' + version + ' ]');
    let buffer = fs.readFileSync(filePath + '/' + fileName + '_' + version + '.so');
    let fsHash = crypto.createHash('sha256');
    let fileHash = fsHash.update(buffer).digest('hex');
    commUtils.log(' ==> fileHash : [ ' + fileHash + ' ]');
    return Promise.resolve(fileHash);
}

module.exports.run = function (config_path) {
    commUtils.log(' #### Start Join Contract Version ' + '####');

    return getFileHash(config_path).then((contractHash) => {
        return joinContract(config_path,contractHash).then((txId) => {
            commUtils.log(' #### Join Contract Version OK txId : [ ' + txId + ' ], Sleep 10s......' + ' ####');
            return commUtils.sleep(10000);
        })
            .catch((err) => {
                commUtils.log(' ==> Join Contract Version failed, ' + (err.stack ? err.stack : err));
                return Promise.reject(err);
            });
    });




};
