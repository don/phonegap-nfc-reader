cordova.define("com.blackberry.invoke.client", function(require, exports, module) {/*
  Licensed to the Apache Software Foundation (ASF) under one
  or more contributor license agreements.  See the NOTICE file
  distributed with this work for additional information
  regarding copyright ownership.  The ASF licenses this file
  to you under the Apache License, Version 2.0 (the
  "License"); you may not use this file except in compliance
  with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an
  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, either express or implied.  See the License for the
  specific language governing permissions and limitations
  under the License.
 */

var channel = cordova.require("cordova/channel"),
    exec = cordova.require("cordova/exec"),
    _self = {},
    _ID = "com.blackberry.invoke",
    _invokeInterrupter,
    _invokeHandler,
    _noop = function () {},
    _events = ["onchildcardstartpeek", "onchildcardendpeek", "onchildcardclosed"],
    _invokeInterruptChannel = channel.create("invocation.interrupted");

_events.map(function (eventName) {
    var channel = cordova.addDocumentEventHandler(eventName),
        success = function (data) {
            channel.fire(data);
        },
        fail = function (error) {
            console.log("Error initializing " + eventName + " listener: ", error);
        };

    channel.onHasSubscribersChange = function () {
        if (this.numHandlers === 1) {
            exec(success, fail, _ID, "startEvent", {eventName: eventName});
        } else if (this.numHandlers === 0) {
            exec(_noop, _noop, _ID, "stopEvent", {eventName: eventName});
        }
    };
});

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}

_self.invoke = function (request, onSuccess, onError) {
    var data,
        callback;

    if (!request) {
        if (onError && typeof onError === "function") {
            onError("invalid invocation request");
            return;
        }
    } else {
        if (request["data"]) {
            data = request["data"];

            try {
                // calling window.btoa on a string that contains unicode character will cause error
                // it is the caller's responsibility to convert the string prior to calling invoke
                request["data"] = window.btoa(data);
            } catch (e) {
                if (onError && typeof onError === "function") {
                    onError(e);
                    return;
                }
            }
        }
    }

    exec(onSuccess, onError, _ID, "invoke", {request: request});
};

_self.query = function (request, onSuccess, onError) {
    exec(onSuccess, onError, _ID, "query", {request: request});
};

_self.closeChildCard = function () {
    exec(_noop, _noop, _ID, "closeChildCard");
};

_invokeInterruptChannel.onHasSubscribersChange = function () {
    var eventName = "invocation.interrupted";

    if (this.numHandlers === 1) {
        exec(_invokeInterruptChannel.fire.bind(_invokeInterruptChannel),
                             console.log.bind("Error initializing " + eventName + " listener: "),
                             _ID, "startEvent", {eventName: eventName});
    } else if (this.numHandlers === 0) {
        exec(_noop, _noop, _ID, "stopEvent", {eventName: eventName});
    }
};

Object.defineProperty(_self, "interrupter", {
    get : function () {
        return _invokeHandler;
    },

    set: function (handler) {
        var eventName = "invocation.interrupted",
            returnRequest;

        _invokeHandler = handler;

        // Clear the current one no matter what
        if (_invokeInterruptChannel.numHandlers === 1) {
            _invokeInterruptChannel.unsubscribe(_invokeInterrupter);
        }

        if (handler) {
            _invokeInterrupter = function (request) {
                returnRequest = handler(request);
                exec(_noop, _noop, _ID, "returnInterruption", {request : returnRequest});
            };

            _invokeInterruptChannel.subscribe(_invokeInterrupter);
        }
    }

});

defineReadOnlyField(_self, "FILE_TRANSFER_PRESERVE", 'PRESERVE');
defineReadOnlyField(_self, "FILE_TRANSFER_COPY_RO", 'COPY_RO');
defineReadOnlyField(_self, "FILE_TRANSFER_COPY_RW", 'COPY_RW');
defineReadOnlyField(_self, "FILE_TRANSFER_LINK", 'LINK');

module.exports = _self;
});
