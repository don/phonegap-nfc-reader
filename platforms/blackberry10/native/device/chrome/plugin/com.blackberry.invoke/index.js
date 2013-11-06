/*
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _returnCallback,
    _actionMap = {
        "onchildcardstartpeek": {
            context: require("./invocationEvents"),
            event: "onchildcardstartpeek",
            trigger: function (pluginResult, peekType) {
                pluginResult.callbackOk(peekType, true);
            }
        },
        "onchildcardendpeek": {
            context: require("./invocationEvents"),
            event: "onchildcardendpeek",
            trigger: function (pluginResult) {
                pluginResult.callbackOk({}, true);
            }
        },
        "onchildcardclosed": {
            context: require("./invocationEvents"),
            event: "onchildcardclosed",
            trigger: function (pluginResult, info) {
                pluginResult.callbackOk(info, true);
            }
        },
        "invocation.interrupted": {
            context: require("./invocationEvents"),
            event: "invocation.interrupted",
            trigger: function (pluginResult, request, returnCallback) {
                _returnCallback = returnCallback;
                // Tell the client that we want to interrupt
                pluginResult.callbackOk(request, true);
            }
        }
    },
    _interruption,
    _listeners = {};

module.exports = {
    invoke: function (success, fail, args, env) {
        // if request contains invalid args, the invocation framework will provide error in callback
        // no validation done here
        var result = new PluginResult(args, env),
            request = JSON.parse(decodeURIComponent(args["request"])),
            callback = function (error) {
                if (error) {
                    result.callbackError(error, false);
                } else {
                    result.callbackOk(undefined, false);
                }
            };

        window.qnx.webplatform.getApplication().invocation.invoke(request, callback);
        result.noResult(true);
    },

    query: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            request = JSON.parse(decodeURIComponent(args["request"])),
            callback = function (error, response) {
                if (error) {
                    result.callbackError(error, false);
                } else {
                    result.callbackOk(response, false);
                }
            },
            invocation = window.qnx.webplatform.getApplication().invocation;

        if (request["target_type"] && Array.isArray(request["target_type"])) {

            request["target_type"] = request["target_type"].filter(function (element) {
                var result = false;
                switch (element)
                {
                case "APPLICATION":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_APPLICATION;
                    break;
                case "CARD":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_CARD;
                    break;
                case "VIEWER":
                    request["target_type_mask"] |= invocation.TARGET_TYPE_MASK_VIEWER;
                    break;
                default:
                    result = true;
                    break;
                }
                return result;
            });

            if (request["target_type"].length === 0) {
                delete request["target_type"];
            }
        }

        invocation.queryTargets(request, callback);
        result.noResult(true);
    },

    closeChildCard: function (success, fail, args, env) {
        var result = new PluginResult(args, env);

        try {
            window.qnx.webplatform.getApplication().invocation.closeChildCard();
            result.ok();
        } catch (e) {
            result.error(e);
        }
    },

    startEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            context = _actionMap[eventName].context,
            invokeEvent = _actionMap[eventName].event,
            listener = _actionMap[eventName].trigger.bind(null, result);

        if (!_listeners[eventName]) {
            _listeners[eventName] = {};
        }

        if (_listeners[eventName][env.webview.id]) {
            result.error("Underlying listener for " + eventName + " already already running for webview " + env.webview.id);
        } else {
            context.addEventListener(invokeEvent, listener);
            _listeners[eventName][env.webview.id] = listener;
            result.noResult(true);
        }
    },

    stopEvent: function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            eventName = JSON.parse(decodeURIComponent(args.eventName)),
            listener = _listeners[eventName][env.webview.id],
            context = _actionMap[eventName].context,
            invokeEvent = _actionMap[eventName].event;

        if (!listener) {
            result.error("Underlying listener for " + eventName + " never started for webview " + env.webview.id);
        } else {
            context.removeEventListener(invokeEvent, listener);
            delete _listeners[eventName][env.webview.id];
            result.noResult(false);
        }
    },

    returnInterruption : function (success, fail, args, env) {
        var result = new PluginResult(args, env),
            request;

        try {
            request = JSON.parse(decodeURIComponent(args.request));
            if (typeof _returnCallback === 'function') {
                _returnCallback(request);
            }

            result.ok();
        } catch (e) {
            result.error(e);
        }
    }
};

