var app={
		init:function(){
			this.$el=$('.pro-list');
			this.$loadImg=$('.load-img');
			this.lazyload();
			this.isLoading=true;
			this.bindCtr();
			this.bindEvent();

		},
		bindEvent:function(){
			var that=this;
			$('.list-tab .list-icon').click(function(){
				that.sortBtnClick($(this).parent());
				return false;
			})
		},
		scrollHander:function(){
			if($('#hid_more').length>0){
				$('.noMore.center.noMoreResult').css("display","block");
				$('.down-load').css("display","none");
				$('.load-img').css("display","none");
				return false;
			}
			$('.down-load').css("display","block");
			var that=this;
			clearTimeout(this.scrollTimer);
			this.scrollTimer=setTimeout(function(){
				var countHigh=$(window).height()+$(window).scrollTop()+20,
					dHigh=$(document).height();
				//console.log(countHigh,dHigh);
				if(countHigh>dHigh-220){
					$('.down-load').show();
					that.$loadImg.show();
					that.loadMore();
					//that.isLoading=false;
				}
			},50)
		},
		loadMore:function(){
			var that=this;
			var param=sideBar.getparam(window.emao.page+1);
			var url=sideBar.geturl(param);
			$.ajax({
				async: false,
				cache: false,
				type: "GET",
				url: window.URL.mall_m+'/?c=wapsearch&a=onlygoods',
				data: param,
				error: function () {
				},
				success: function (data) {
					clearTimeout(timer);
					var timer=setTimeout(function(){
						that.$loadImg.hide();
						$('.pro-list').append(data);
					},100)
					window.emao.page=window.emao.page+1;
				}
			});
		},
		bindCtr:function(){
			var that=this;
			that.$loadImg.hide();
			$(window).scroll(function(){
				//console.log(that.isLoading);
				//if(!that.isLoading){
				that.scrollHander();
				//}
			})

		},
		lazyload:function(){
			$('.gooditem img').lazyLoad({
				topCls:'.gooditem',
				beforeBind:function(){
					this.$el.parents('.gooditem').css('opacity',1);
				},
				loadHandler:function(){
					this.$el.parents('.gooditem').css('opacity',1);
				}
			});
		},
		sortBtnClick:function(that){
			var pricesort=2;
			if(that.hasClass('priceSort-1')){
				that.removeClass('priceSort-1').addClass('priceSort-2');
				pricesort=2;
			}else if(that.hasClass('priceSort-2')){
				that.addClass('priceSort-1').removeClass('priceSort-2');
				pricesort=1;
			}else{
				that.addClass('priceSort-1');
				pricesort=1;
			}
			window.emao.sort=pricesort;
			window.emao.page=1;
			var param = sideBar.getparam(window.emao.page);
			var url=sideBar.geturl(param);
			location.href=url;
		},
	};
	app.init();