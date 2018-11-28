/**
 * Add  2018 YangShiHong. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file, definition of the UChains class, which implements the caliper's NBI for UChains
 */


'use strict';

/**
 * the main function
 */
function main() {
    let cmdType = '1';
    let appSecEnabled = '1';
    let txPoolEnabled = '0';
    let dbType = 'mysql';
    let chainType ='14';
    let chainId = 'poeheavy';
    let version = '1-0-0';
    let ConsensusType = '2';
    let bftNum = 1;
    let geneBftNameStr = 'vp0_org0,vp1_org_1';
    let geneBftNameArr = geneBftNameStr.split(',');
    let startStr = '[';
    let endStr = ']';
    for (let i = 0; i < geneBftNameArr.length; i++ ){
        startStr = startStr + '"' + geneBftNameArr[i] + '",';
    }
    let geneBftName = startStr.substr(0,startStr.length-1) + endStr;
    let signature = '2890d36affb84ab9452b01dda4f4078a82270672700487ef2095c4886e1f76eea9d73b1e5dcb0702ca97a42e62c73f7cc1d879ce12431b9b93c27225fd99daf0995e889e4902842bae8854defb9df3390445a916b87f39cceecb15ed320d2f11f46e8a24ae104eb7a07d992afc83bb70a97d95f60b8246c98167c95a02034133';
    let reqMsg = '{"regChainId": "'+ chainId +'","cmdType": '+ cmdType +',"chainConfig": {"appSecEnabled": "'+ appSecEnabled +
        '","dbType": "'+ dbType +'","chainType": '+ chainType +',"version": "'+ version +
        '","txPoolEnabled": "'+ txPoolEnabled +'","ConsensusType": '+ ConsensusType +
        ',"chainTDMConfig":{"tenderConsensus":{"bftNum":' + bftNum +',"geneBftName":'+geneBftName+'}}'+
        '},"signature":"' + signature + '"}';

    console.log(reqMsg);
    let json = JSON.parse(reqMsg);
    console.log(json);
    console.log(JSON.stringify(json));

}

main();





