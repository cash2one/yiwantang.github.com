var gotop = {
    init: function () {
        this.$el = $("#gotop"),
            this.$win = $(window),
            this.updata(),
            this.bindEvent();
    }, bindEvent: function () {
        var i, t = this;
        this.$win.scroll(function () {
            clearTimeout(i), i = setTimeout(function () {
                t.updata()
            }, 10)
        }), this.$el.click(function () {
            $("html,body").animate({scrollTop: 0}, 500, function () {
                t.updata()
            })
        })
    }, updata: function () {
        var i = this.$win.scrollTop();
        i > 0 ? this.$el.show() : this.$el.hide()
    }, show: function () {
        this.$el.show()
    }, hide: function () {
        this.$el.hide()
    }
};