var isSubmited = false;

jQuery.extend({
	formSubmitExtend:function(){
		
	//表单验证 开始	
	var data = {};
		data.custom_1   = $('#name-input').val();
		data.custom_2   = $('#phone-input').val();
		data.custom_3   = $('#form_prov').val();
		data.custom_4   = $('#form_city').val();
		data.custom_5   = $('#form_dealer').val();
	
	var partten = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/;
    if(!partten.test(data.custom_1)){
		$('#name-input').focus();
		alert('请填写正确的姓名，只能填写中文或英文！');
		return false;
	}
	
	var partten = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
    if(!partten.test(data.custom_2)){
		$('#phone-input').focus();
		alert('填写的电话号码格式有误');
		return false;
	}
	if(data.custom_3==""){
		alert('请选择省份');
		return false;
	}
	
	if(data.custom_4==""){
		alert('请选择城市');
		return false;
	}

	if(data.custom_5==""){
		alert('请选择区县');
		return false;
	}
	
	if(data.custom_6==""){
		alert('请选择经销商');
		return false;
	}
	
	isSubmited = true;

	$(".shade-wrap").show();

}
	
	
});



(function($){

    var swiperV = new Swiper('.swiper-container-v', {
		resistanceRatio : 0,
		watchActiveIndex: true,
		nextButton: '.swiper-button-next-v',
		pagination: '.swiper-pagination-v',
		paginationClickable: true,
        direction: 'vertical',
        spaceBetween: 0,
		noSwiping :true,
		noSwipingClass : 'stop-swiping',
		mousewheelControl: true,
		observer:true,
		observeParents:true,
		onInit: function(swiper){
			swiperAnimateCache(swiper);
			swiperAnimate(swiper);
		},
	    onSlideChangeStart: function(swiper){
		},
		onSlideChangeEnd: function(swiper){ 
			swiperAnimate(swiper);
			// swiper.reInit();
		}
    });

    //绑定再看一次
    $('.again').click(function(){
		swiperV.slideTo(0, 1000, true);//设置第三个参数值为true,执行onSlideChangeEnd回调
	})

	
	//addCookie
	function addCookie(name,value,iDay)
	{
		var oDate=new Date();
		oDate.setDate(oDate.getDate()+iDay);
		if(iDay)
		{
			document.cookie=name+'='+value;'path=/';'expires='+oDate;
		}	
		else
		{
			document.cookie=name+'='+value;'path=/';
		}
	}

	//getCookie
	function getCookie(name)
	{
		var arr=document.cookie.split('; ');
		
		for(var i=0;i<arr.length;i++)
		{
			var arr2=arr[i].split('=');
			if(name==arr2[0])
			{
				return arr2[1];
			}
			else
			{
				return '';
			}
		}	
	}

	//removeCookie
	function removeCookie(name)
	{
		addCookie(name,'',-100);
	}
		
	//音乐 没有音乐播放时可以删除该函数
	if(getCookie("music")==1){
		$("#playMusic").addClass("pause");
		audio.pause();
	}
	
	$("#playMusic").bind("touchstart",function(){
		var audio = document.getElementById('audio');
		if (audio.paused) {
			audio.play();
			$("#playMusic").removeAttr("class");
			removeCookie("music");
		} else {
			audio.pause();
			$("#playMusic").addClass("pause");
			addCookie("music",1,1);
		}
	});
	
    

        //给遮罩层绑定关闭响应事件
    $(".shade-wrap").click(function(){
        $(this).hide();
        $(".again").show();
    });

	$(".again").click(function(){
		$(this).hide();
		$(".swiper-pagination").hide();
		$(".swiper-button-next-v").hide();

	})
	
	function fixedWatch(el) {
	  if(document.activeElement.nodeName == 'INPUT'){
		el.css('paddingTop','38%');
		$(".nav-six-1").css('top','-20%');
		console.log(el.scrollTop())
	  } else {
		el.css('paddingTop', '58%');
		$(".nav-six-1").css('top','0')
	  }
	}
	setInterval(function () {
		fixedWatch($('.form_section'));
	}, 500)

})(jQuery)



