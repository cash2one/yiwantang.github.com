function getBuaycarCookie(u_name){
	if (document.cookie.length>0){ 
		u_start=document.cookie.indexOf(u_name + "=")
	if (u_start!=-1){ 
		u_start=u_start + u_name.length+1 
		u_end=document.cookie.indexOf(";",u_start)
		if (u_end==-1) u_end=document.cookie.length
			return unescape(document.cookie.substring(u_start,u_end))
		} 
	}
	return ""
}
//构建报名cookies End

//表单提交扩展函数
var isSubmited = false; //是否提交
var cookiesSubmit = true; //是否保存cookies

jQuery.extend({
	formSubmitExtend:function(){
		if (isSubmited || getBuaycarCookie("form_submit")==1) {
			layer.open({ content: '请勿重复提交',btn: ['关闭']});

			return false;
		}
			
		//客户端表单判断 开始	
		var data = {};
		var data_1 = $("#name-input").val();
		var data_2 = $("#phone-input").val();
		var data_3 = $("#form_prov").val();
		var data_4 = $("#form_city").val();
		var data_5 = $("#yzm-input").val();
		var data_6 = $("#form_dealer").val();
		var data_7 = $("#car_type").val();
		var partten = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/;
	    if(!partten.test(data_1)){
			layer.open({ content: '填写的姓名格式有误',btn: ['关闭']});
			return false;
		}
		
		var partten = /^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/;
	    if(!partten.test(data_2)){
			layer.open({ content: '填写的手机号码格式有误',btn: ['关闭']});
			return false;
		}
		if (!data_5) {
			layer.open({content: '请填写验证码', btn: ['关闭']});
			return false;
		}
		if (!data_7 || data_7=='选择车型') {
			layer.open({content: '请选择车型', btn: ['关闭']});
			return false;
		}		
		if (!data_3 || data_3=='选择省份') {
			layer.open({content: '请选择省份', btn: ['关闭']});
			return false;
		}
		if (!data_4 || data_4=='选择市') {
			layer.open({content: '选择市', btn: ['关闭']});
			return false;
		}
		
		if (!data_6 || data_6=='请选择') {
			layer.open({content: '请选择经销商', btn: ['关闭']});
			return false;
		}	
		

		//just test for the submit success
		layer.open({content: "提交成功", btn: ['关闭']});
		$('.pop-mask').hide();
		return;
		//rest end

		//real request method
		var param = {"nickName": data_1, "phone": data_2, "province": data_3, "city": data_4, "code": data_5,"dealer":data_6};
		$.ajax({
			async: false,
			cache: false,
			type: "POST",
			url: '/' + (new Date).getTime(),// 请求的action路径
			data: param,
			error: function () {// 请求失败处理函数
			},
			success: function (data) {
				if (data.status != 'success') {
					layer.open({content: data.msg, btn: ['关闭']});
				}else{
					layer.open({content: "提交成功", btn: ['关闭']});
					$('#yz-btn').html('发送验证码');
					$('.pop-mask').hide();
					setInterval(
						function () {
							location.reload();
						},
						2000
					)
				}
			}
		});

	}
	
});


(function($){

	// 报名表单居中
	$('#bm-form').css('top',$(window).height()/2-276);
	$('.red-packet').click(function(){
		$('.pop-mask').show();
	});
	$('.close-btn').click(function(){
		$('.pop-mask').hide();
	});
		
	//城市关联
	$("#bm-form").citySelect({
		nodata:"none",
		required:false
	}); 
	$('#form_prov option:first').text('选择省份');
	$('#form_prov').click(function(){
		var councity=$("#form_city").val();
		if(councity != 0) {
			$('#form_city').prepend('<option value="">选择市</option>');
		}
	});
	$('#form_city').click(function(){
		var dist=$("#form_dist").val();
		if(dist != 0) {
			$('#form_dist').prepend('<option value="">选择区/县</option>');
		}
	});
		
	//解决swiper中select在firefox中的异常
	$('.swiper-slide select').on('mousedown touchstart MSPointerDown', function(e){
		e.stopPropagation();
	});

	// 点击60s 验证码
	var wait = 60;
	var timer = null;
	function time(o) {
	    if (wait == 0) {
	        clearTimeout(timer);
	        timer = null;
	        wait = 60;
	        o.text('60s');
	        $('#yz-btn').html('重新发送验证码');
	    } else {
	        $('#yz-btn').html('验证码已发送');
	        o.text(''+ wait-- +'s');
	        timer = setTimeout(function() {
	            time(o);
	        }, 1000);
	    }
	}


	//for test the join activity once again
		var cachePhone ; //测试输入重复电码号码
		$('#yz-btn').click(function(){
			var partten = /^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/;
			var phone=$("#phone-input").val();
			if (!partten.test(phone)) {
				layer.open({content: '填写的手机号码格式有误', btn: ['关闭']});
				return;
			}
			if (timer) {
				return;
			}
			if (cachePhone == $("#phone-input").val()) {
				//您已参加过活动
				$(".pop-mask-lit").show();
				$('.close-lit').click(function(){
					$('.pop-mask-lit').hide();
				});
				return;
			}else{
				cachePhone = $("#phone-input").val()
				time($('#time'));
			}
			

		});
		return;

	//test end

	//the real method for joined the acitvity once again
	
	$('#yz-btn').click(function () {
		var partten = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
		var phone=$("#phone-input").val();
		if (!partten.test(phone)) {
			layer.open({content: '填写的电话号码格式有误', btn: ['关闭']});
			return;
		}
		if (timer) {
			return;
		}
		$.ajax({
			async: false,
			cache: false,
			type: "GET",
			url: '/' + (new Date).getTime(),// 请求的action路径
			data: {"phone": phone},
			error: function () {// 请求失败处理函数
			},
			success: function (data) {
				if (data.status != 'success') {
					if(data.code==101){
						// layer.open({content: '您已经参加过活动', btn: ['关闭']});
						$(".pop-mask-lit").show();
						$('.close-lit').click(function(){
							$('.pop-mask-lit').hide();
						});
						setInterval(
							function () {
								location.reload();
							},
							2000
						)
					}
					layer.open({content: data.msg, btn: ['关闭']});
				}else{
					time($('#time'));
				}
			}
		});
 	});
})(jQuery)