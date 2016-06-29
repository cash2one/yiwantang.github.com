var isSubmited = false;

jQuery.extend({
	formSubmitExtend:function(){
		
	if (isSubmited) {
		alert("请勿重复提交");
		return false;
	}
		
	//客户端表单判断	
	var data = {};
	data.custom_1   = $("#packet-1").val();
	data.custom_2   = $("#packet-2").val();
	data.custom_3   = $("#packet-3").val();
	data.custom_4   = $("#packet-4").val();
	data.custom_5 = $("#form_prov-5").val();
	data.custom_6 = $("#form_city").val();
	data.custom_7 = $("#form_district").val();
	data.custom_8 = $("#form_dealer").val();
	
	var partten = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/;
    if(!partten.test(data.custom_1)){
		alert("填写的姓名格式有误");
		return false;
	}
	
	var partten = /^1[3,4,5,7,8]\d{9}$/;
    if(!partten.test(data.custom_2)){
		alert("填写的手机号码格式有误");
		return false;
	}
	
	if(data.custom_3==""){
		alert("请填写验证码");
		return false;
	}

	if(data.custom_4==""){
		alert("请选择车型");
		return false;
	}

	if(data.custom_5==""){
		alert("请选择省份");
		return false;
	}

	if(data.custom_6==""){
		alert("请选择市");
		return false;
	}

	if(data.custom_7==""){
		alert("请选择区县");
		return false;
	}

	if(data.custom_8==""){
		alert("请选择经销商");
		return false;
	}
	
	$("#background-cover,.from-packets").hide();	
	$("#background-cover").show();	
	$(".from-succeed").css("display","table");	
	
	isSubmited = true;

	}
	
});


(function($){
	
/*提交表单关闭*/	
	$(".packets-close").click(function(){
		$("#background-cover,.from-packets").hide();	
	});

/*提交成功关闭*/	
	$(".succeed-close").click(function(){
		$("#background-cover,.from-succeed").hide();	
	});
	
	$(".wap-footer").click(function(){
		$("#background-cover").show();	
		$(".from-packets").css("display","table");	
	});
	
})(jQuery)