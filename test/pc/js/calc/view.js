/**
 * Created by xiaochao on 2016/3/10.
 */
!function(root){
var View=root.Class(function(opts){
    opts=opts||{};
    this.app=opts.app;
    this.model=opts.model;
    this.addEventListeners(this.app, this.app);
    this.$el=$('.view-calc');
    this.$inputs=this.$el.find('input:text[data-key]');
    this.$enabledInputs=this.$inputs.filter(":enabled");
    this.$disabledInputs=this.$inputs.filter(":disabled");
    this.$radios=this.$el.find('input:radio[data-key]');
    this.$checkBox=this.$el.find('input:checkbox[id^="cb"][id$=Check]');
    this.$outputTxt=this.$el.find('.output-txt[data-key]');
    this.$txtPrepayment=this.$el.find('input[data-key="txtPrepayment"]');
},root.eventDispatcher).extend({
    init:function(){
        var that=this;
        this.bindEvent();
        this.initInputData();
    },
    initInputData:function(){
        var that=this;
        var data={};
        var CommInsureCheck={};
        this.$radios.each(function(){
            this.checked&&(data[$(this).attr('data-key')]=$(this).val());
        });
        this.$inputs.filter(".inited:enabled").each(function(){
            data[$(this).attr('data-key')]=($(this).val()||'')-0;
        });
        this.$checkBox.each(function(){
            var key=$(this).attr('id').replace(/^cb(.*)Check$/g,"txt$1Insurance")
            CommInsureCheck=CommInsureCheck||{};
            CommInsureCheck[key]=!!this.checked;
        });
        that.dispatchEvent('calc',{data:data,CommInsureCheck:CommInsureCheck});
    },
    bindEvent:function(){
        var that=this;
        this.$inputs.each(function(){
            var $input=$(this);
            var dataKey=$input.attr('data-key');
            that.model.addEventListener('change.'+dataKey,function(e){
                $input.val(e.value);
            });
        });
        this.$outputTxt.each(function(){
            var $output=$(this);
            var dataKey=$output.attr('data-key');
            that.model.addEventListener('change.'+dataKey,function(e){
                $output.text(that.toThousand(e.value));
            });
        });
        this.$radios.change(function(){
            that.radioItemChange(this);
        });
        this.$checkBox.click(function(){
            var CommInsureCheck={};
            var key=$(this).attr('id').replace(/^cb(.*)Check$/g,"txt$1Insurance")
            CommInsureCheck=CommInsureCheck||{};
            CommInsureCheck[key]=!!this.checked;
            that.dispatchEvent('calc',{CommInsureCheck:CommInsureCheck});
        });
        this.$enabledInputs.add(this.$txtPrepayment).change(function(){
            that.inputItemChange(this);
        });
        this.$enabledInputs.add(this.$txtPrepayment).keyup(function(){
            that.inputItemChange(this);
        });
        $('.buybtn').click(function(){
            $('.buybtn .btnpop').hide();
            $(this).find('.btnpop').show();
            return false;
        });
        $('.popclose').click(function(){
            $('.buybtn .btnpop').hide();
            return false;
        });
        $('body').click(function(){
            $('.buybtn .btnpop').hide();
        })
    },
    toThousand:function(num){
        if(!$.isNumeric(num))return num;
        num=num||0;
        num=num+'';
        num=(Math.pow(10,(3-num.length%3)%3)+'').slice(1)+num;
        num=num.replace(/(\d{3})/g,"$1,")
            .replace(/(^0+)|(,$)/g,'');
        return num||0;
    },
    radioItemChange:function(item){
        var data={};
        var $radio=$(item);
        var dataKey=$radio.attr('data-key');
        var val=$radio.val()||"";
        if(dataKey=="rdPrepayment"){
            if(val=="0"){
                this.$txtPrepayment.attr("disabled", false).removeClass('input2');
                return ;
            }else{
                this.$txtPrepayment.attr("disabled", true).addClass('input2');
            }
        }

        this.dispatchRadioCalc(dataKey);
    },
    inputItemChange:function(item){
        var data={};
        var $input=$(item);
        var dataKey=$input.attr('data-key');
        var val=$input.val()||"";
        val=val.replace(/\D+/,'');
        val=val-0;
        $input.val(val);
        this.dispatchInputCalc(dataKey);

    },
    dispatchInputCalc:function(key){
        var that=this;
        var data={};
        this.$radios.each(function(){
            this.checked&&(data[$(this).attr('data-key')]=$(this).val());
        });
        this.$inputs.filter(":enabled").each(function(){
           data[$(this).attr('data-key')]=($(this).val()||'')-0;
        });
        that.dispatchEvent('calc',{data:data});
    },
    dispatchRadioCalc:function(key){
        var that=this;
        var data={};
        var $radios=this.$radios;
        var $input,inputKey;
        if(key){
            $radios=this.$radios.filter('[data-key="'+key+'"]');
            $input=$radios.parents('tr').find('input:text[data-key]');
            inputKey=$input.attr('data-key');
            inputKey&&(data[inputKey]=null);
        }
        $radios.each(function(){
            this.checked&&(data[$(this).attr('data-key')]=$(this).val()-0);
        });
        that.dispatchEvent('calc',{data:data});
    }



});
root.View=View;
}(window);