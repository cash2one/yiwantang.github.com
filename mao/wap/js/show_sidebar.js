function show_sidebar(){
	$('.se-link').click(function(){
		$('.sidebar ').show();
		$('body').addClass('supernatant');
		$('.side-box').stop().animate({
			'right':'0px'
		});
	});
	$('.sidebar ').click(function(ev){
		if(ev.target.className=='sidebar se-sidebar'){
			setTimeout(function(){
				$('.sidebar ').hide();
				$('body').removeClass('supernatant');
			},400);
			$('.side-box').stop().animate({
				'right':'-80%'
			});
		}
	})
	$('.side-nav li').click(function(){
		var index=$(this).index();
		$('.side-nav li').removeClass('selected');
		$(this).addClass('selected');
		$('.side-list ul').removeClass('selected');
		$('.side-list ul').eq(index).addClass('selected');
	});
}