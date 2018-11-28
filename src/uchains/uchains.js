/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */

'use strict';

const BlockchainInterface = require('../comm/blockchain-interface.js');
//let configPath;
//const request = require('request-promise');
const Util = require('../../src/comm/util');
const join_version = require('./join-version.js');
const join_chain = require('./join-chain.js');
const check_net = require('./check-net.js');
/**
 * get peer info of Uchains net
 * @returns {Promise<object>} The promise for the result of the execution
 */

/**
 * get Transaction Result by txid
 * @param {string} contractID Chain ID
 * @param {string} key Transaction ID
 * @returns {Promise<object>} The promise for the result of the execution
 */
function getTransactionResult (contractID,key) {
    //TODO get Transaction Result by txid
    Util.log(' ==> [getTransactionResult] contractID [' + contractID + ']  Txid [' + key+ ']');
    return Promise.resolve(contractID);
}

/**
 * submit transaction to peer node
 * @param {string} contractID The name of the chaincode.
 * @param {Array} args Array of JSON formatted arguments for transaction(s). Each element containts arguments (including the function name) passing to the chaincode. JSON attribute named transaction_type is used by default to specify the function name. If the attribute does not exist, the first attribute will be used as the function name.
 * @param {number} timeout The timeout to set for the execution in seconds.
 * @return {Promise<object>} The promise for the result of the execution.
 */
function submitTransaction(contractID, args, timeout) {
    //TODO submit transaction to peer node
    Util.log(' ==> [submitTransaction] contractID [' + contractID + ']  Txid [' + args+ ']');
    return Promise.resolve(contractID);
}


/**
 * Implements {BlockchainInterface} for a UChains backend.
 */
class UChains extends BlockchainInterface{
    /**
     * Create a new instance of the {UChains} class.
     * @param {string} config_path The path of the UChains network configuration file.
     */
    constructor(config_path) {
        super(config_path);
        //configPath = config_path;
    }

    /**
     * Initialize the {UChains} object.
     * @return {Promise} The return promise.
     */
    init() {
        Util.log(' *** UChains.init()  ' + '***');
        return check_net.run(this.configPath).then(() => {
            Util.log(' *** UChains.init() OK, ' + '***');
        })
            .catch((err) => {
                Util.log(' *** UChains.init() failed : ' + (err.stack ? err.stack : err));
                return Promise.reject(err);
            });
    }

    /**
     * Deploy the chaincode specified in the network configuration file to all peers.
     * @return {Promise} The return promise.
     */
    installSmartContract() {
        Util.log(' *** UChains.installSmartContract()  ' + '***');
        return join_version.run(this.configPath).then(() => {
            return join_chain.run(this.configPath);
        })
            .catch((err) => {
                Util.log('UChains.init() failed, ' + (err.stack ? err.stack : err));
                return Promise.reject(err);
            });
    }

    /**
     * Return the UChains context associated with the given callback module name.
     * @param {string} name The name of the callback module as defined in the configuration files.
     * @param {object} args Unused.
     * @return {object} The assembled UChains context.
     */
    getContext(name, args) {
        return Promise.resolve();

    }

    /**
     * Release the given UChains context.
     * @param {object} context The UChains context to release.
     * @return {Promise} The return promise.
     */
    releaseContext(context) {
        return Promise.resolve();
    }

    /**
     * Invoke the given chaincode according to the specified options. Multiple transactions will be generated according to the length of args.
     * @param {object} context The UChains context returned by {getContext}.
     * @param {string} contractID The name of the chaincode.
     * @param {string} contractVer The version of the chaincode.
     * @param {Array} args Array of JSON formatted arguments for transaction(s). Each element containts arguments (including the function name) passing to the chaincode. JSON attribute named transaction_type is used by default to specify the function name. If the attribute does not exist, the first attribute will be used as the function name.
     * @param {number} timeout The timeout to set for the execution in seconds.
     * @return {Promise<object>} The promise for the result of the execution.
     */
    invokeSmartContract(context, contractID, contractVer, args, timeout) {
        return submitTransaction(contractID,args,timeout);
    }

    /**
     * Query the given chaincode according to the specified options.
     * @param {object} context The UChains context returned by {getContext}.
     * @param {string} contractID The name of the chaincode.
     * @param {string} contractVer The version of the chaincode.
     * @param {string} key The argument to pass to the chaincode query.
     * @return {Promise<object>} The promise for the result of the execution.
     */
    queryState(context, contractID, contractVer, key) {
        return getTransactionResult(contractID,key);
    }
}
module.exports = UChains;
