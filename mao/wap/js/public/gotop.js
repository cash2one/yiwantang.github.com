var gotop={
    init:function(){
        this.$el=$('#gotop');
        this.$win=$(window);
        this.updata();
        this.bindEvent();
    },
    bindEvent:function(){
        var that=this,timer;
        this.$win.on('scroll',function(){
            clearTimeout(timer);
            timer=setTimeout(function(){
                that.updata();
            },10);
        });
        this.$el.click(function(){
            window.scrollTo(0,0);
            that.updata();
        })
    },
    updata:function(){
        this.$win.scrollTop() - 0 > 15 ? this.show() : this.hide();
    },
    show:function(){
        this.$el.show();
    },
    hide:function(){
        this.$el.hide();
    }
}
