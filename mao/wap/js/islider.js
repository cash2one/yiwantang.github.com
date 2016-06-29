(function () {
    var f, h, g, c, a, e, d;
    f = function () {
        var j = function (k) {
            if (!k.dom) {
                throw new Error("dom element can not be empty!")
            }
            if (!k.data || !k.data.length) {
                throw new Error("data must be an array and must have more than one element!")
            }
            this._opts = k;
            this._setting();
            this._renderHTML();
            this._bindHandler()
        };
        j.prototype._setting = function () {
            var k = this._opts;
            this.wrap = k.dom;
            this.data = k.data;
            this.type = k.type || "pic";
            this.isVertical = k.isVertical || false;
            this.isOverspread = k.isOverspread || false;
            this.duration = k.duration || 2000;
            this.initIndex = k.initIndex || 0;
            if (this.initIndex > this.data.length - 1 || this.initIndex < 0) {
                this.initIndex = 0
            }
            this.slideIndex = this.slideIndex || this.initIndex || 0;
            this.axis = this.isVertical ? "Y" : "X";
            this.width = this.wrap.clientWidth;
            this.height = this.wrap.clientHeight;
            this.ratio = this.height / this.width;
            this.scale = k.isVertical ? this.height : this.width;
            this.onslide = k.onslide;
            this.onslidestart = k.onslidestart;
            this.onslideend = k.onslideend;
            this.onslidechange = k.onslidechange;
            this.offset = this.offset || {X: 0, Y: 0};
            this.useZoom = k.useZoom || false;
            if (this.data.length < 2) {
                this.isLooping = false;
                this.isAutoPlay = false
            } else {
                this.isLooping = k.isLooping || false;
                this.isAutoplay = k.isAutoplay || false
            }
            if (k.animateType === "card" && this.isVertical) {
                this.isOverspread = true
            }
            if (this.isAutoplay) {
                this.play()
            }
            this.log = k.isDebug ? function (l) {
                window.console.log(l)
            } : function () {
            };
            this._setUpDamping();
            this._setPlayWhenFocus();
            if (this.useZoom) {
                this._initZoom(k)
            }
            this._animateFunc = k.animateType in this._animateFuncs ? this._animateFuncs[k.animateType] : this._animateFuncs["default"]
        };
        j.prototype._setPlayWhenFocus = function () {
            window.addEventListener("focus", this, false);
            window.addEventListener("blur", this, false)
        };
        j.prototype._animateFuncs = {
            "default": function (o, l, n, k, m) {
                o.style.webkitTransform = "translateZ(0) translate" + l + "(" + (m + n * (k - 1)) + "px)"
            }
        };
        j.prototype._setUpDamping = function () {
            var l = this.scale >> 1;
            var k = l >> 1;
            var m = k >> 2;
            this._damping = function (p) {
                var o = Math.abs(p);
                var n;
                if (o < l) {
                    n = o >> 1
                } else {
                    if (o < l + k) {
                        n = k + (o - l >> 2)
                    } else {
                        n = k + m + (o - l - k >> 3)
                    }
                }
                return p > 0 ? n : -n
            }
        };
        j.prototype._renderItem = function (n, m) {
            var o;
            var l;
            var k = this.data.length;
            if (!this.isLooping) {
                o = this.data[m] || {empty: true}
            } else {
                if (m < 0) {
                    o = this.data[k + m]
                } else {
                    if (m > k - 1) {
                        o = this.data[m - k]
                    } else {
                        o = this.data[m]
                    }
                }
            }
            if (o.empty) {
                n.innerHTML = "";
                n.style.background = "";
                return
            }
            if (this.type === "pic") {
                if (!this.isOverspread) {
                    l = o.height / o.width > this.ratio ? '<div><a href="' + o.url + '" ><img height="' + this.height + '" src="' + o.content + '"><p>' + o.title + "</p></a></div>" : '<div><a href="' + o.url + '" ><img width="' + this.width + '" src="' + o.content + '"><p>' + o.title + "</p></a></div>"
                } else {
                    n.style.background = "url(" + o.content + ") 50% 50% no-repeat";
                    n.style.backgroundSize = "cover"
                }
            } else {
                if (this.type === "dom") {
                    l = o.content
                }
            }
            l && (n.innerHTML = l)
        };
        j.prototype._renderHTML = function () {
            this.outer && (this.outer.innerHTML = "");
            var m = this.outer || document.createElement("ul");
            m.style.cssText = "height:" + this.height + "px;width:" + this.width + "px;list-style:none;";
            this.els = [];
            for (var l = 0; l < 3; l++) {
                var k = document.createElement("li");
                k.className = this.type === "dom" ? "islider-dom" : "islider-pic";
                k.style.cssText = "height:" + this.height + "px;width:" + this.width + "px;";
                this.els.push(k);
                this._animateFunc(k, this.axis, this.scale, l, 0);
                if (this.isVertical && (this._opts.animateType === "rotate" || this._opts.animateType === "flip")) {
                    this._renderItem(k, 1 - l + this.slideIndex)
                } else {
                    this._renderItem(k, l - 1 + this.slideIndex)
                }
                m.appendChild(k)
            }
            this._initLoadImg();
            if (!this.outer) {
                this.outer = m;
                this.wrap.appendChild(m)
            }
        };
        j.prototype._preloadImg = function (r) {
            var m = this.data.length;
            var l = r;
            var s = r - this.slideIndex;
            var o = this;
            var q = function (t) {
                t=(t+m)%m;
                if (!o.data[t].loaded) {
                    var n = new Image();
                    n.src = o.data[t].content;
                    o.data[t].loaded = 1
                }
            };
            if (o.type !== "dom") {
                var k = l + 2 > m - 1 ? (l + 2) % m : l + 2;
                var p = l - 2 < 0 ? m - 2 + l : l - 2;
                q(k);
                q(p)
            }
        };
        j.prototype._initLoadImg = function () {
            var p = this.data;
            var m = p.length;
            var l = this.initIndex;
            var n = this;
            if (this.type !== "dom" && m > 3) {
                var k = l + 1 > m ? (l + 1) % m : l + 1;
                var o = l - 1 < 0 ? m - 1 + l : l - 1;
                p[l].loaded = 1;
                p[k].loaded = 1;
                if (n.isLooping) {
                    p[o].loaded = 1
                }
                setTimeout(function () {
                    n._preloadImg(l)
                }, 200)
            }
        };
        j.prototype.slideTo = function (p) {
            var q = this.data;
            var o = this.els;
            var l = p;
            var s = p - this.slideIndex;
            if (Math.abs(s) > 1) {
                var k = s > 0 ? this.els[2] : this.els[0];
                this._renderItem(k, l)
            }
            this._preloadImg(l);
            if (q[l]) {
                this.slideIndex = l
            } else {
                if (this.isLooping) {
                    this.slideIndex = s > 0 ? 0 : q.length - 1
                } else {
                    this.slideIndex = this.slideIndex;
                    s = 0
                }
            }
            this.log("pic idx:" + this.slideIndex);
            var r;
            if (this.isVertical && (this._opts.animateType === "rotate" || this._opts.animateType === "flip")) {
                if (s > 0) {
                    r = o.pop();
                    o.unshift(r)
                } else {
                    if (s < 0) {
                        r = o.shift();
                        o.push(r)
                    }
                }
            } else {
                if (s > 0) {
                    r = o.shift();
                    o.push(r)
                } else {
                    if (s < 0) {
                        r = o.pop();
                        o.unshift(r)
                    }
                }
            }
            if (s !== 0) {
                if (Math.abs(s) > 1) {
                    this._renderItem(o[0], l - 1);
                    this._renderItem(o[2], l + 1)
                } else {
                    if (Math.abs(s) === 1) {
                        this._renderItem(r, l + s)
                    }
                }
                r.style.webkitTransition = "none";
                r.style.visibility = "hidden";
                setTimeout(function () {
                    r.style.visibility = "visible"
                }, 200);
                this.onslidechange && this.onslidechange(this.slideIndex);
                this.dotchange && this.dotchange();
                this.wordchange && this.wordchange()
            }
            for (var m = 0; m < 3; m++) {
                if (o[m] !== r) {
                    o[m].style.webkitTransition = "all .3s ease"
                }
                this._animateFunc(o[m], this.axis, this.scale, m, 0)
            }
            if (this.isAutoplay && !this.isLooping && this.slideIndex === q.length - 1) {
                this.pause()
            }
        };
        j.prototype._device = function () {
            var n = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch);
            var l = n ? "touchstart" : "mousedown";
            var m = n ? "touchmove" : "mousemove";
            var k = n ? "touchend" : "mouseup";
            return {hasTouch: n, startEvt: l, moveEvt: m, endEvt: k}
        };
        j.prototype._bindHandler = function () {
            var k = this.outer;
            var l = this._device();
            if (!l.hasTouch) {
                k.style.cursor = "pointer";
                k.ondragstart = function (m) {
                    if (m) {
                        return false
                    }
                    return true
                }
            }
            k.addEventListener(l.startEvt, this);
            k.addEventListener(l.moveEvt, this);
            k.addEventListener(l.endEvt, this);
            window.addEventListener("orientationchange", this)
        };
        j.prototype.bind = function (n, k, m) {
            function l(r) {
                var p = window.event ? window.event : r;
                var q = p.target;
                var o = document.querySelectorAll(k);
                for (i = 0; i < o.length; i++) {
                    if (q === o[i]) {
                        m.call(q);
                        break
                    }
                }
            }

            if (this.wrap["on" + n] !== undefined) {
                this.wrap["on" + n] = l
            } else {
                this.wrap.addEventListener(n, l, false)
            }
        };
        j.prototype.destroy = function () {
            var k = this.outer;
            var l = this._device();
            k.removeEventListener(l.startEvt, this);
            k.removeEventListener(l.moveEvt, this);
            k.removeEventListener(l.endEvt, this);
            window.removeEventListener("orientationchange", this);
            window.removeEventListener("focus", this);
            window.removeEventListener("blur", this);
            this.wrap.innerHTML = ""
        };
        j.prototype.handleEvent = function (k) {
            var l = this._device();
            switch (k.type) {
                case l.startEvt:
                    this.startHandler(k);
                    break;
                case l.moveEvt:
                    this.moveHandler(k);
                    break;
                case l.endEvt:
                    this.endHandler(k);
                    break;
                case"orientationchange":
                    this.orientationchangeHandler();
                    break;
                case"focus":
                    this.isAutoplay && this.play();
                    break;
                case"blur":
                    this.pause();
                    break
            }
        };
        j.prototype.startHandler = function (k) {
            var l = this._device();
            this.isMoving = true;
            this.pause();
            this.onslidestart && this.onslidestart();
            this.log("Event: beforeslide");
            this.startTime = new Date().getTime();
            this.startX = l.hasTouch ? k.targetTouches[0].pageX : k.pageX;
            this.startY = l.hasTouch ? k.targetTouches[0].pageY : k.pageY;
            this._startHandler && this._startHandler(k)
        };
        j.prototype.moveHandler = function (r) {
            if (this.isMoving) {
                var k = this._device();
                var p = this.data.length;
                var l = this.axis;
                var n = l === "X" ? "Y" : "X";
                var m = {
                    X: k.hasTouch ? r.targetTouches[0].pageX - this.startX : r.pageX - this.startX,
                    Y: k.hasTouch ? r.targetTouches[0].pageY - this.startY : r.pageY - this.startY
                };
                var q = this._moveHandler ? this._moveHandler(r) : false;
                if (!q && Math.abs(m[l]) - Math.abs(m[n]) > 10) {
                    r.preventDefault();
                    this.onslide && this.onslide(m[l]);
                    this.log("Event: onslide");
                    if (!this.isLooping) {
                        if (m[l] > 0 && this.slideIndex === 0 || m[l] < 0 && this.slideIndex === p - 1) {
                            m[l] = this._damping(m[l])
                        }
                    }
                    for (var o = 0; o < 3; o++) {
                        var s = this.els[o];
                        s.style.webkitTransition = "all 0s";
                        this._animateFunc(s, l, this.scale, o, m[l])
                    }
                }
                this.offset = m
            }
        };
        j.prototype.endHandler = function (k) {
            this.isMoving = false;
            var o = this.offset;
            var n = this.axis;
            var p = this.scale / 2;
            var l = new Date().getTime();
            p = l - this.startTime > 300 ? p : 14;
            var m = this._endHandler ? this._endHandler(k) : false;
            if (!m && o[n] >= p) {
                this.slideTo(this.slideIndex - 1)
            } else {
                if (!m && o[n] < -p) {
                    this.slideTo(this.slideIndex + 1)
                } else {
                    if (!m) {
                        this.slideTo(this.slideIndex)
                    }
                }
            }
            if (Math.abs(this.offset.X) < 10 && Math.abs(this.offset.Y) < 10) {
                this.tapEvt = document.createEvent("Event");
                this.tapEvt.initEvent("tap", true, true);
                if (!k.target.dispatchEvent(this.tapEvt)) {
                    k.preventDefault()
                }
            }
            this.offset.X = this.offset.Y = 0;
            this.isAutoplay && this.play();
            this.onslideend && this.onslideend(this.slideIndex);
            this.log("Event: afterslide")
        };
        j.prototype.orientationchangeHandler = function () {
            setTimeout(function () {
                this.reset();
                this.log("Event: orientationchange")
            }, 100)
        };
        j.prototype.reset = function () {
            this.pause();
            this._setting();
            this._renderHTML();
            this.isAutoplay && this.play()
        };
        j.prototype.play = function () {
            var k = this;
            var l = this.duration;
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = setInterval(function () {
                k.slideTo(k.slideIndex + 1)
            }, l)
        };
        j.prototype.pause = function () {
            clearInterval(this.autoPlayTimer)
        };
        j.prototype.extend = function (l, k) {
            if (!k) {
                k = j.prototype
            }
            Object.keys(l).forEach(function (m) {
                Object.defineProperty(k, m, Object.getOwnPropertyDescriptor(l, m))
            })
        };
        return j
    }();
    h = undefined;
    g = function (k) {
        var j = {
            rotate: function (r, m, q, l, p) {
                var n = m === "X" ? "Y" : "X";
                var o = Math.abs(p);
                var s = window.getComputedStyle(this.wrap.parentNode, null).backgroundColor;
                if (this.isVertical) {
                    p = -p
                }
                this.wrap.style.webkitPerspective = q * 4;
                if (l === 1) {
                    r.style.zIndex = q - o
                } else {
                    r.style.zIndex = p > 0 ? (1 - l) * o : (l - 1) * o
                }
                r.style.cssText += "-webkit-backface-visibility:hidden; -webkit-transform-style:preserve-3d; background-color:" + s + "; position:absolute;";
                r.style.webkitTransform = "rotate" + n + "(" + 90 * (p / q + l - 1) + "deg) translateZ(" + 0.888 * q / 2 + "px) scale(0.888)"
            }, flip: function (q, m, p, l, o) {
                var n = m === "X" ? "Y" : "X";
                var r = window.getComputedStyle(this.wrap.parentNode, null).backgroundColor;
                if (this.isVertical) {
                    o = -o
                }
                this.wrap.style.webkitPerspective = p * 4;
                if (o > 0) {
                    q.style.visibility = l > 1 ? "hidden" : "visible"
                } else {
                    q.style.visibility = l < 1 ? "hidden" : "visible"
                }
                q.style.cssText += "position:absolute; -webkit-backface-visibility:hidden; background-color:" + r + ";";
                q.style.webkitTransform = "translateZ(" + p / 2 + "px) rotate" + n + "(" + 180 * (o / p + l - 1) + "deg) scale(0.875)"
            }, depth: function (q, m, p, l, o) {
                var n = (4 - Math.abs(l - 1)) * 0.18;
                this.wrap.style.webkitPerspective = p * 4;
                q.style.zIndex = l === 1 ? 100 : o > 0 ? 1 - l : l - 1;
                q.style.webkitTransform = "scale(" + n + ", " + n + ") translateZ(0) translate" + m + "(" + (o + 1.3 * p * (l - 1)) + "px)"
            }, flow: function (o, m, n, q, p) {
                var r = Math.abs(p);
                var t = m === "X" ? "Y" : "X";
                var s = m === "X" ? 1 : -1;
                var l = Math.abs(p / n);
                this.wrap.style.webkitPerspective = n * 4;
                if (q === 1) {
                    o.style.zIndex = n - r
                } else {
                    o.style.zIndex = p > 0 ? (1 - q) * r : (q - 1) * r
                }
                o.style.webkitTransform = "scale(0.7, 0.7) translateZ(" + (l * 150 - 150) * Math.abs(q - 1) + "px)translate" + m + "(" + (p + n * (q - 1)) + "px)rotate" + t + "(" + s * (30 - l * 30) * (1 - q) + "deg)"
            }, card: function (r, m, q, l, p) {
                var o = Math.abs(p);
                if (l === 1) {
                    r.style.zIndex = q - o;
                    r.cur = 1
                } else {
                    r.style.zIndex = p > 0 ? (1 - l) * o * 1000 : (l - 1) * o * 1000
                }
                if (r.cur && r.cur !== l) {
                    setTimeout(function () {
                        r.cur = null
                    }, 300)
                }
                var n = r.cur ? 1 - 0.2 * Math.abs(l - 1) - Math.abs(0.2 * p / q).toFixed(6) : 1;
                r.style.webkitTransform = "scale(" + n + ", " + n + ") translateZ(0) translate" + m + "(" + ((1 + Math.abs(l - 1) * 0.2) * p + q * (l - 1)) + "px)"
            }
        };
        k.prototype.extend(j, k.prototype._animateFuncs)
    }(f);
    c = function (q) {
        var t = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix();
        var A = 1 / 2;
        var l = {};

        function u(F, I, H, G) {
            return "translate" + (t ? "3d(" : "(") + F + "px," + I + (t ? "px," + H + "px)" : "px)") + "scale(" + G + ")"
        }

        function m(H, G) {
            var F, I;
            F = H.left - G.left;
            I = H.top - G.top;
            return Math.sqrt(F * F + I * I)
        }

        function k(F, G) {
            return F + "px " + G + "px"
        }

        function x(F) {
            return Array.prototype.slice.call(F).map(function (G) {
                return {left: G.pageX, top: G.pageY}
            })
        }

        function s(I, F) {
            var G = m(I[0], I[1]);
            var H = m(F[0], F[1]);
            return H / G
        }

        function w(J) {
            var P = {translateX: 0, translateY: 0, translateZ: 0, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0};
            var K = 0, I = 0;
            if (!window.getComputedStyle || !J) {
                return P
            }
            var F = window.getComputedStyle(J), G, O;
            G = F.webkitTransform || F.mozTransform;
            O = F.webkitTransformOrigin || F.mozTransformOrigin;
            var L = O.match(/(.*)px\s+(.*)px/);
            if (L.length > 1) {
                K = L[1] - 0;
                I = L[2] - 0
            }
            if (G == "none") {
                return P
            }
            var H = G.match(/^matrix3d\((.+)\)$/);
            var N = G.match(/^matrix\((.+)\)$/);
            if (H) {
                var M = H[1].split(", ");
                P = {
                    translateX: M[12] - 0,
                    translateY: M[13] - 0,
                    translateZ: M[14] - 0,
                    offsetX: K - 0,
                    offsetY: I - 0,
                    scaleX: M[0] - 0,
                    scaleY: M[5] - 0,
                    scaleZ: M[10] - 0
                }
            } else {
                if (N) {
                    var M = N[1].split(", ");
                    P = {
                        translateX: M[4] - 0,
                        translateY: M[5] - 0,
                        offsetX: K - 0,
                        offsetY: I - 0,
                        scaleX: M[0] - 0,
                        scaleY: M[3] - 0
                    }
                }
            }
            return P
        }

        function y(G, F) {
            return {x: (G.x + F.x) / 2, y: (G.y + F.y) / 2}
        }

        function j(F) {
            this.currentScale = 1;
            this.zoomFactor = F.zoomFactor || 2
        }

        function E(F) {
            if (this.useZoom) {
                var I = this.els[1].querySelector("img");
                var H = w(I);
                this.startTouches = x(F.targetTouches);
                this._startX = H.translateX - 0;
                this._startY = H.translateY - 0;
                this.currentScale = H.scaleX;
                this.zoomNode = I;
                var L = C(I);
                if (F.targetTouches.length == 2) {
                    console.log("gesture");
                    this.lastTouchStart = null;
                    var K = F.touches;
                    var G = y({x: K[0].pageX, y: K[0].pageY}, {x: K[1].pageX, y: K[1].pageY});
                    I.style.webkitTransformOrigin = k(G.x - L.left, G.y - L.top)
                } else {
                    if (F.targetTouches.length === 1) {
                        var J = new Date().getTime();
                        this.gesture = 0;
                        if (J - this.lastTouchStart < 300) {
                            F.preventDefault();
                            this.gesture = 3
                        }
                        this.lastTouchStart = J
                    }
                }
            }
        }

        function v(G) {
            var F = 0, I = this.zoomNode;
            var H = this._device();
            if (H.hasTouch) {
                if (G.targetTouches.length === 2 && this.useZoom) {
                    I.style.webkitTransitionDuration = "0";
                    G.preventDefault();
                    this._scaleImage(G);
                    F = 2
                } else {
                    if (G.targetTouches.length == 1 && this.useZoom && this.currentScale > 1) {
                        I.style.webkitTransitionDuration = "0";
                        G.preventDefault();
                        this._moveImage(G);
                        F = 1
                    }
                }
                this.gesture = F;
                return F
            }
        }

        function r(F) {
            var H = this.zoomFactor || 2;
            var G = this.zoomNode;
            var I = C(G);
            this.currentScale = this.currentScale == 1 ? H : 1;
            G.style.webkitTransform = u(0, 0, 0, this.currentScale);
            if (this.currentScale != 1) {
                G.style.webkitTransformOrigin = k(F.touches[0].pageX - I.left, F.touches[0].pageY - I.top)
            }
        }

        function z(G) {
            var F = x(G.targetTouches);
            var I = s(this.startTouches, F);
            G.scale = G.scale || I;
            var H = this.zoomNode;
            I = this.currentScale * G.scale < A ? A : this.currentScale * G.scale;
            H.style.webkitTransform = u(0, 0, 0, I)
        }

        function p(G) {
            var F = 0;
            if (this.gesture === 2) {
                this._resetImage(G);
                F = 2
            } else {
                if (this.gesture == 1) {
                    this._resetImage(G);
                    F = 1
                } else {
                    if (this.gesture === 3) {
                        this._handleDoubleTap(G);
                        this._resetImage(G)
                    }
                }
            }
            return F
        }

        function D(F) {
            var H = this.zoomNode;
            var G = this._device();
            var I = {
                X: G.hasTouch ? F.targetTouches[0].pageX - this.startX : F.pageX - this.startX,
                Y: G.hasTouch ? F.targetTouches[0].pageY - this.startY : F.pageY - this.startY
            };
            this.moveOffset = {x: this._startX + I.X - 0, y: this._startY + I.Y - 0};
            H.style.webkitTransform = u(this.moveOffset.x, this.moveOffset.y, 0, this.currentScale)
        }

        function C(F) {
            var G = {left: 0, top: 0};
            do {
                G.top += F.offsetTop || 0;
                G.left += F.offsetLeft || 0;
                F = F.offsetParent
            } while (F);
            return G
        }

        function o(I, J, G) {
            var H, F;
            var L = C(I);
            l = {start: {left: L.left, top: L.top}, end: {left: L.left + I.clientWidth, top: L.top + I.clientHeight}};
            var K = G == 1 ? "left" : "top";
            H = l.start[K];
            F = l.end[K];
            return J >= H && J <= F
        }

        function B(J, L) {
            var F = 0;
            var K = o(J, L.start.left, 1);
            var H = o(J, L.end.left, 1);
            var I = o(J, L.start.top, 0);
            var G = o(J, L.end.top, 0);
            if (K != H && I != G) {
                if (K && G) {
                    F = 1
                } else {
                    if (K && I) {
                        F = 2
                    } else {
                        if (H && G) {
                            F = 3
                        } else {
                            F = 4
                        }
                    }
                }
            } else {
                if (K == H) {
                    if (!I && G) {
                        F = 5
                    } else {
                        if (!G && I) {
                            F = 6
                        }
                    }
                } else {
                    if (I == G) {
                        if (!K && H) {
                            F = 7
                        } else {
                            if (K && !H) {
                                F = 8
                            }
                        }
                    } else {
                        if (I == G == K == H) {
                            F = 9
                        }
                    }
                }
            }
            return F
        }

        function n(P) {
            if (this.currentScale == 1) {
                return
            }
            var H = this.zoomNode, G, L, Q, O, J, K, F, I, N, M;
            Q = w(H);
            N = H.parentNode;
            O = H.clientWidth * Q.scaleX;
            J = H.clientHeight * Q.scaleX;
            K = C(H);
            F = {
                left: (1 - Q.scaleX) * Q.offsetX + K.left + Q.translateX,
                top: (1 - Q.scaleX) * Q.offsetY + K.top + Q.translateY
            };
            I = {left: F.left + O, top: F.top + J};
            G = F.left;
            L = F.top;
            M = B(N, {start: F, end: I});
            switch (M) {
                case 1:
                    G = l.start.left;
                    L = l.end.top - J;
                    break;
                case 2:
                    G = l.start.left;
                    L = l.start.top;
                    break;
                case 3:
                    G = l.end.left - O;
                    L = l.end.top - J;
                    break;
                case 4:
                    G = l.end.left - O;
                    L = l.start.top;
                    break;
                case 5:
                    L = l.end.top - J;
                    break;
                case 6:
                    L = l.start.top;
                    break;
                case 7:
                    G = l.end.left - O;
                    break;
                case 8:
                    G = l.start.left;
                    break
            }
            if (O < N.clientWidth) {
                G = K.left - (Q.scaleX - 1) * H.clientWidth / 2
            }
            if (J < N.clientHeight) {
                L = K.top - (Q.scaleX - 1) * H.clientHeight / 2
            }
            H.style.webkitTransitionDuration = "100ms";
            H.style.webkitTransform = u(Q.translateX + G - F.left, Q.translateY + L - F.top, 0, Q.scaleX)
        }

        q.prototype.extend({
            _initZoom: j,
            _scaleImage: z,
            _moveImage: D,
            _resetImage: n,
            _handleDoubleTap: r,
            _moveHandler: v,
            _endHandler: p,
            _startHandler: E
        })
    }(f);
    a = function (j) {
        j.prototype.extend({
            addBtn: function () {
                if (!this.isVertical) {
                    var n = [];
                    var l = [];
                    var k = this;
                    for (var m = 0; m < 2; m++) {
                        n[m] = document.createElement("div");
                        n[m].className = "islider-btn-outer";
                        l[m] = document.createElement("div");
                        l[m].className = "islider-btn-inner";
                        if (m === 0) {
                            n[m].className += " left";
                            n[m].dir = -1
                        } else {
                            n[m].className += " right";
                            n[m].dir = 1
                        }
                        n[m].addEventListener("click", function () {
                            var o = parseInt(this.getAttribute("dir"));
                            k.slideTo(k.slideIndex + o)
                        });
                        n[m].appendChild(l[m]);
                        this.wrap.appendChild(n[m], this.wrap.nextSibling)
                    }
                }
            }
        })
    }(f);
    e = function (j) {
        j.prototype.extend({
            addDot: function () {
                if (!this.isVertical) {
                    var k = this;
                    var m = this.data;
                    var o = [];
                    dotWrap = document.createElement("ul");
                    dotWrap.className = "islider-dot-wrap";
                    var n = document.createDocumentFragment();
                    for (var l = 0; l < m.length; l++) {
                        o[l] = document.createElement("li");
                        o[l].className = "islider-dot";
                        o[l].setAttribute("index", l);
                        if (l === this.slideIndex) {
                            o[l].className += " active"
                        }
                        o[l].addEventListener("click", function () {
                            var p = parseInt(this.getAttribute("index"));
                            k.slideTo(p)
                        });
                        n.appendChild(o[l])
                    }
                    dotWrap.appendChild(n);
                    this.wrap.parentNode.appendChild(dotWrap);
                    this.dotchange = function () {
                        for (var p = 0; p < m.length; p++) {
                            o[p].className = "islider-dot";
                            if (p === this.slideIndex) {
                                o[p].className += " active"
                            }
                        }
                    }
                }
            }
        })
    }(f);
    d = function (j) {
        j.prototype.extend({
            addWord: function () {
                if (!this.isVertical) {
                    var l = this;
                    var n = this.data;
                    var k = [];
                    wordWrap = document.createElement("div");
                    wordWrap.className = "islider-word";
                    var o = document.createDocumentFragment();
                    for (var m = 0; m < n.length; m++) {
                        wh = document.createElement("h6");
                        wp = document.createElement("p");
                        k[m] = document.createElement("div");
                        k[m].className = "islider-wrod-list";
                        k[m].appendChild(wh);
                        k[m].appendChild(wp);
                        k[m].setAttribute("index", m);
                        if (m === this.slideIndex) {
                            k[m].className += " active"
                        }
                        o.appendChild(k[m])
                    }
                    wordWrap.appendChild(o);
                    this.wrap.parentNode.appendChild(wordWrap);
                    this.wordchange = function () {
                        for (var p = 0; p < n.length; p++) {
                            k[p].className = "islider-wrod-list";
                            if (p === this.slideIndex) {
                                k[p].className += " active"
                            }
                        }
                    }
                }
            }
        })
    }(f);
    window.iSlider = f;
    function b() {
        var j = $('div[id*="focusPic"]').find(".islider-pic").eq(0).find("img").height();
        $('div[id*="focusPic"]').find("ul, li").css("height", j + "px");
        if ($(".car-vehicles-list").length != 0) {
            var j = $(".car-vehicles-list").find(".islider-dom").eq(0).find("img").height();
            $(".car-vehicles-list").find(".car-vehicles-pic, .car-vehicles-pic a").css("height", j + "px");
            $(".car-vehicles-list").find("ul").css("height", j + 90 + "px")
        }
        if ($(".car-brand-ct").length != 0) {
            var j = $(".car-brand-ct").find(".islider-pic").eq(0).find("div").height();
            $(".car-brand-ct").css("height", j + 10 + "px");
            $(".car-brand-ct").find("ul, li").css("height", j + "px")
        }
    }

    setInterval(b, 100)
}());