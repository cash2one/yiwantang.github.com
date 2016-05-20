!function(root){
    var EventDispatcher = function() {
        this.__listeners = {};
        //  throw new Error('sssss')
    };
    EventDispatcher.prototype = {
        dispatchEvent : function(name, e) {
            e = e || {};
            if (!e.type)
                e.type = name;
            if (!e.target)
                e.target = this;
            if(!this.__listeners){
                this.__listeners = {};
            }
            var _handlers = this.__listeners[name];
            var args = [], handler;
            if (_handlers) {
                for (var i = 0, l = _handlers.length; i < l; i++) {
                    handler = _handlers[i];
                    args = handler.args.slice(0);
                    args.unshift(e);
                    handler.fn.apply(handler.owner, args);
                }
                return true;
            }
            return false;
        },
        /**
         * 批量注册事件
         * @param {Object} oHandler
         * @param {Object} thisObj
         */
        addEventListeners : function(oHandler, thisObj, args) {

            if ( typeof oHandler == "object") {
                for (var p in oHandler) {
                    if ( typeof oHandler[p] == "function") {
                        this.addEventListener(p, oHandler[p], thisObj, args);
                    }
                }
            }
            return this;
        },
        addEventListener : function(sEventName, fListener, thisObj, args) {
            thisObj = thisObj || this;
            args = args || [];
            if(!this.__listeners){
                this.__listeners = {};
            }
            if (!(this.__listeners[sEventName] instanceof Array))
                this.__listeners[sEventName] = [];

            this.__listeners[sEventName].push({
                fn : fListener,
                owner : thisObj,
                args : args
            });

            return this;
        },
        removeEventListener : function(sEventName, fListener) {
            var _ea = this.__listeners[sEventName];
            if(typeof fListener !== 'function') {
                this.__listeners[sEventName] = [];
                return this;
            }
            for (var i = 0; i < _ea.length; i++) {
                if (_ea[i].fn === fListener) {
                    _ea.splice(i--, 1);
                }
            }
            return this;
        },
        removeEventListeners : function(listener) {
            if(listener && typeof listener === 'object') {
                for(var p in listener) {
                    this.removeEventListener(p, listener[p]);
                }
            } else {
                this.__listeners = {};
            }
        }
    };
    //////////////////////////////
    var eventCenter = new EventDispatcher;
    EventDispatcher.eventCenter = eventCenter;
    root.eventDispatcher=EventDispatcher;
}(window);