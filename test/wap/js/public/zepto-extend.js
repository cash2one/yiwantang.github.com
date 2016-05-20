$.getScript = function(src, successfun,failfun) {
    var script = document.createElement('script');
    script.async = "async";
    script.src = src;
    if (successfun) {
        script.onload = successfun;
    }
    if (failfun) {
        script.onerror = failfun;
    }
    document.getElementsByTagName("head")[0].appendChild( script );
};

$.createCache = function( requestFunction ) {
    var cache = {};
    return function( key, callback ) {
        if ( !cache[ key ] ) {
            cache[ key ] = $.Deferred(function( defer ) {
                requestFunction( defer, key );
            }).promise();
        }
        return cache[ key ].done( callback );
    };
};
$.cachedGetScript = $.createCache(function( defer, url ) {
    $.getScript( url ,defer.resolve,defer.reject);
});
$.loadImage = $.createCache(function( defer, url ) {
    var image = new Image();
    function cleanUp() {
        image.onload = image.onerror = null;
    }
    defer.then( cleanUp, cleanUp );
    image.onload = function() {
        defer.resolve( url );
    };
    image.onerror = defer.reject;
    image.src = url;

});
$.fn.animatePromise = function( prop, speed, easing, callback ) {
    var elements = this;
    return $.Deferred(function( defer ) {
        elements.animate( prop, speed, easing, function() {
            defer.resolve();
            if ( callback ) {
                callback.apply( this, arguments );
            }
        });
    }).promise();
};
$.json = (function(){
    var stringify = (function () {

        var escapeMap = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        };

        function encodeString(source) {
            if (/["\\\x00-\x1f]/.test(source)) {
                source = source.replace(
                    /["\\\x00-\x1f]/g,
                    function (match) {
                        var c = escapeMap[match];
                        if (c) {
                            return c;
                        }
                        c = match.charCodeAt();
                        return "\\u00"
                            + Math.floor(c / 16).toString(16)
                            + (c % 16).toString(16);
                    });
            }
            return '"' + source + '"';
        }

        function encodeArray(source) {
            var result = ["["],
                l = source.length,
                preComma, i, item;

            for (i = 0; i < l; i++) {
                item = source[i];

                switch (typeof item) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(preComma) {
                            result.push(',');
                        }
                        result.push(stringify(item));
                        preComma = 1;
                }
            }
            result.push("]");
            return result.join("");
        }

        function pad(source) {
            return source < 10 ? '0' + source : source;
        }

        function encodeDate(source){
            return '"' + source.getFullYear() + "-"
                + pad(source.getMonth() + 1) + "-"
                + pad(source.getDate()) + "T"
                + pad(source.getHours()) + ":"
                + pad(source.getMinutes()) + ":"
                + pad(source.getSeconds()) + '"';
        }

        return function (value) {
            switch (typeof value) {
                case 'undefined':
                    return 'undefined';

                case 'number':
                    return isFinite(value) ? String(value) : "null";

                case 'string':
                    return encodeString(value);

                case 'boolean':
                    return String(value);

                default:
                    if (value === null) {
                        return 'null';
                    } else if (value instanceof Array) {
                        return encodeArray(value);
                    } else if (value instanceof Date) {
                        return encodeDate(value);
                    } else {
                        var result = ['{'],
                            encode = stringify,
                            preComma,
                            item;

                        for (var key in value) {
                            if (Object.prototype.hasOwnProperty.call(value, key)) {
                                item = value[key];
                                switch (typeof item) {
                                    case 'undefined':
                                    case 'unknown':
                                    case 'function':
                                        break;
                                    default:
                                        if (preComma) {
                                            result.push(',');
                                        }
                                        preComma = 1;
                                        result.push(encode(key) + ':' + encode(item));
                                }
                            }
                        }
                        result.push('}');
                        return result.join('');
                    }
            }
        };
    })();

    var parse = function (data) {
        //2010/12/09：更新至不使用原生parse，不检测用户输入是否正确
        return (new Function("return (" + data + ")"))();
    };

    return {
        stringify : stringify,
        parse : parse
    };
})();
$.storageFun=function(storage){
    var _storage = function() { //判断是否支持
        var _storage;
        try {
            _storage = storage||window.localStorage;
            _storage.setItem('cache', 'test');
            _storage.removeItem('cache');
        } catch (e) {
            try {
                _storage.clear();
                _storage.setItem('cache', 'test');
                _storage.removeItem('cache');
            } catch (e) {
                _storage = false;
            }
        }
        return _storage
    };
    return function(name, value) {
        if (!_storage)
            return false;
        if (name === null)
            return _storage.clear();
        if (typeof value != 'undefined') { //set
            if (value === null) {
                return _storage.removeItem(name);
            }
            return _storage.setItem(name, value);
        } else { //get
            return _storage.getItem(name);
        }
    };
};
$.localStorage = $.storageFun();
$.sessionStorage = $.storageFun(window.sessionStorage);



Function.prototype.bind = Function.prototype.bind||function (oThis) {
    if (typeof this !== "function") {
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis ? this:oThis,
                aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};

(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

})(Zepto);

$.fn.lazyLoad=(function($,$win){
    function LazyLoad(opts){
        this.opts=opts;
        this.$el=opts.$el;
        var lazySrc=this.$el.attr(opts.lazySrcKey)||"";
        if(!this.$el[0].hasAttribute(opts.lazySrcKey)){
            return;
        }
        this.lazySrc=lazySrc;
        this.$topEl=this.$el;
        if(this.opts.topCls&&this.$el.parents(this.opts.topCls).length){
            this.$topEl=this.$el.parents(this.opts.topCls);
        }
        this.elTop=this.$topEl.offset().top;
        this.elH=this.$topEl.height();
        this.$el.removeAttr(opts.lazySrcKey);
        this.opts.beforeBind.call(this);
        this.bindEvent();
        this.updataScroll();

    };
    LazyLoad.prototype={
        bindEvent:function(){
            this.$el[0].onload=this.opts.loadHandler.bind(this,{status:1});
            this.$el[0].onerror=this.opts.loadHandler.bind(this,{status:0});
            $win.scroll(this.updataScroll.bind(this));
            $win.resize(this.updataScroll.bind(this));
        },
        updataScroll:function(){
            if(this.srcLoaded)return;
            var winH=$win.height();
            var winTop=$win.scrollTop();
            this.elTop=this.elTop||this.$el.offset().top;
            this.elH=this.elH||this.$topEl.height();
            if(this.elTop+this.elH+this.opts.topBuffer>=winTop&&this.elTop-this.opts.bottomBuffer<=winTop+winH){
                this.loadSrc();
            }
        },
        loadSrc:function(){
            if(this.srcLoaded)return;
            this.$el.attr('src',this.lazySrc);
            this.srcLoaded=true;
            this.opts.loadAction.call(this);
        }
    };
    return function(opts) {
        var defaults = {
            beforeBind: function () {},
            loadHandler: function () {},
            loadAction: function () {},
            lazySrcKey: 'lazy-src',
            topCls: '',
            topBuffer: $win.height(),
            bottomBuffer: $win.height()
        };
        opts = $.extend(defaults, opts);
        for (var i = 0; i < this.length; i++) {
            opts.$el = $(this[i]);
            new LazyLoad(opts)
        }
    }
})($,$(window));