"use strict";

// External deps
const log4js = require('log4js');
const SDK = require('./sdk');

// Module-scoped resources
const registry = require('./registry'); // specifies component names/impls
const logger = log4js.getLogger();

module.exports = {

    /**
     * Returns an array of metadata for all components.
     */
    getAllComponentMetadata: function() {
        const allMetadata = [];
        for (var componentName in registry) {
            allMetadata.push(registry[componentName].metadata());
        }
        return allMetadata;
    },

    /**
     * Invokes the named component.
     *
     * componentName is the name of the component (as a string) [required].
     * requestBody is the body of the invocation request (as an object) [required].
     * sdkMixin is an object that will be mixed in with the SDK instance that is made
     *  available to the invoked component [optional].  This mixin allows environment
     *  specific functionality to be made available to component implementations,
     *  and the ability override or extend existing SDK functionality.
     *
     *  For example, if a component service is built in MCS custom code, the MCS
     *  custom code SDK can be passed as a property in sdkMixin, and then component
     *  implementations can check for its existence and use it as desired.
     *
     * callback is a standard error-first callback [required].
     *   On success, the data passed to the callback is the invocation response.
     *   On error, the following error names may be used:
     *     'unknownComponent'
     *     'badRequest'
     *   Component implementations may cause arbitrary errors to be propagated
     *   through.
     */
    invokeComponentByName: function(componentName, requestBody, sdkMixin, callback) {

        sdkMixin = sdkMixin ? sdkMixin : {};

        // Resolve component
        const component = registry[componentName];
        var sdk;

        if (!component) {
        	  logger.error('Unknown component ' + componentName);
            let err = new Error('Unknown component ' + componentName);
            err.name = 'unknownComponent';
            callback(err);
            return;
        }

        // Build an SDK object for this invocation, applying mixin
        try {
            sdk = Object.assign(new SDK(requestBody), sdkMixin);
        }
        catch (err) {
            logger.info('Error in request, details=' + JSON.stringify(err.details, null, 2));
            callback(err);
            return;
        }

        // Invoke component
        logger.info('Invoking component=' + componentName + ' reqBody=' + JSON.stringify(requestBody, null, 2));
        try {
            // Component may throw an error with details
            // TODO: change the component callback signature to standard error-first,
            //       no reason to have sdk in the callback signature (it's in closure here)
            component.invoke(sdk, () => {
                logger.info('Component response=' + JSON.stringify(sdk.response(), null, 2));
                callback(null, sdk.response());
            });
        }
        catch (err) {
            logger.error('Error in component, details=' + JSON.stringify(err, null, 2));
            if (err.stack) {
                console.log(err, err.stack.split("\n"));
            }
            else {
                console.log(err);
            }
            callback(err);
        }
    }
};
