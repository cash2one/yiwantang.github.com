(function($){

	//城市关联
	$("#form_list").citySelect({
		nodata:"none",
		required:false
	}); 
	
	$(".buyCheck").click(function(){
		$(".shade_wrap").show();
	});
	
	$(".close").click(function(){
		$(".shade_wrap").hide()
	});
	$(".buy_title span").click(function(){
		$(".shade_wrap").hide()
	});

	$(".verification").click(function(){
		$(this).html("验证码已发送")
		//send the verification code
		//...

		// run the time down
		time_down();
	});

	$("#submit").click(function(){

		$.ajax(
			{
				type:"get",
				url: "/",
				success: function(data){
					//hide the form
					$(".shade_wrap form").hide();
					//alert ths success wrap
					$(".submit_success").show();
					setInterval(
						function(){
							$(".shade_wrap").hide();
						},
						5000
					)
				},
				error: function(data){
					//hide the form
					$(".shade_wrap form").hide();
					//alert the already join wrap
					$(".already_join").show()
				}
			}
		)
	});

	var time_countdown = parseInt($(".time_countdown").attr("value"));
	var time_base = time_countdown;
	var time_down = function(){
		var time = setInterval(function(){
			if (time_countdown == 0) {
				$(".verification").html("重新发送");
				$(".time_countdown").html(time_base + "s");
				// reset the default time
				time_countdown = time_base;
				clearInterval(time);
				return;
			}
			$(".time_countdown").html((time_countdown - 1) + "s");
			time_countdown = time_countdown - 1;
		},
		1000)
	};
	
// //评论 Start
// updateCommentsNum = function () {$(".commentCount").text(commentArea.totalCommentCount);}
// commentArea.build("comment_place", 1, '15444', {	'onLoaded': updateCommentsNum,'onAddOk': updateCommentsNum,'onDelOk': updateCommentsNum,'onReplyOk': updateCommentsNum},1);
// //评论 End

})(jQuery)
