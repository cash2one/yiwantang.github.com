app={
    init:function(){
        this.$tel=$('.input-tel');
        this.$yzm=$('.input-captcha');
        this.bindEvent();
    },
    bindEvent:function(){
        var that=this;
        $(".close").on("click",function(){
            $('.wrap-zhezhao,.tip-box').hide();
        })
        $(".quan-dian").on("click",function(){
            $('.wrap-zhezhao,.tip-box').show();
            $('.tip-pro').show();

        })
    }
}