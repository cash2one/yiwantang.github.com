var isSubmited = false;
jQuery.extend({
	formSubmitExtend:function(){
		
	if (isSubmited) {
		layer.alert('您已经提交过信息了！', {icon: 6});
		return false;
	}
			
	//表单验证 开始	
	var data = {};
		data.data_1   = $('#name-input').val();
		data.data_2   = $('#phone-input').val();
		data.data_3   = $('#brand-input').val();
		data.data_4   = $('#cx-input').val();
		data.data_5   = $('#style-input').val();
	
	var partten = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/;
    if(!partten.test(data.data_1)){
		$('#name-input').focus();
		layer.open({ content: '请填写正确的姓名，只能填写中文或英文！',btn: ['关闭']});
		return false;
	}
	
	var partten = /^1[3,4,5,7,8]\d{9}$/;
    if(!partten.test(data.data_2)){
		$('#phone-input').focus();
		layer.open({ content: '填写的手机号码格式有误',btn: ['关闭']});
		return false;
	}
	
	if(!$.trim(data.data_3)){
		layer.open({ content: '请选择品牌',btn: ['关闭']});
		return false;
	}

	if(!$.trim(data.data_4)){
		layer.open({ content: '请选择车系',btn: ['关闭']});
		return false;
	}

	if(!$.trim(data.data_5)){
		layer.open({ content: '请选择车型',btn: ['关闭']});
		return false;
	}
	//表单验证 结束

	//提交数据
    var submitData = layer.msg('正在提交信息，请稍候片刻...', {icon: 16});
    var url='';
	
    $.getJSON(url,{name:data.data_1,phone:data.data_2,brand:data.data_3,cx:data.data_4,style:data.data_5},function(response){
    	layer.close(submitData);
        if(response.submitStatus==0){

			layer.open({ content: '提交成功',btn: ['关闭'],
				end: function(index){
                //窗口关闭后执事件
                //关闭遮罩层
                $(".baoming_container").hide();
                }});
            isSubmited = true;

        }else{
			layer.alert('提交失败！<br/>请检查你的操作是否正确或网络是否存在故障！', {icon: 0});
        }
    }); 

	}
	
});

(function($){

	// tab切换
	var $tb_nav = $('.act_item');
	$tb_nav.eq(0).addClass('active');
	$('.products-list').eq(0).css('display', 'block');
	$tb_nav.click(function(){
	   $(this).addClass('active').siblings().removeClass('active');
	   $('.products-list').hide().eq($(this).index()).show();
	});

	// 点击60s 验证码
	var wait = 60;
	var timer = null;
	var yz_btn=$('#yz-btn');
	function time(o) {
	    if (wait == 0) {
	        clearTimeout(timer);
	        timer = null;
	        wait = 60;
	        o.text('60s');
	        yz_btn.html('重新发送验证码');
	    } else {
	        yz_btn.html('验证码已发送');
	        o.text(''+ wait-- +'s');
	        timer = setTimeout(function() {
	            time(o);
	        }, 1000);
	    }
	}
	yz_btn.click(function() {
	    if (timer) {
	        return;
	    }
	    time($('#time'));
	});

	var container=$('.baoming_container');
	$('.close').click(function(){
		container.hide();
	})

	$(".sign_up").click(function(){
		container.show()
	})
	
	$('#nav').onePageNav();

})(jQuery)
