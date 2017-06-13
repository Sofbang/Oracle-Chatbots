"use strict"

const isEmpty = function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

module.exports.isEmpty = isEmpty;
