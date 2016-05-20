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
			var that=this;
			clearTimeout(this.scrollTimer);
			this.scrollTimer=setTimeout(function(){
				var countHigh=$(window).height()+$(window).scrollTop()+20,
					dHigh=$(document).height();
				//console.log(countHigh,dHigh);
				if(countHigh>dHigh){
					that.$loadImg.show();
					that.loadMore();
					//that.isLoading=false;
				}
			},50)
		},
		loadMore:function(){
			var that=this;
			var param = this.getparam(window.emao.page+1,window.emao.sort);
			var url=this.geturl(param);
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
			this.pushstate(url);
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
			var param = this.getparam(1,pricesort);
			var url=this.geturl(param);
			$.ajax({
				async: false,
				cache: false,
				type: "GET",
				url: window.URL.mall_m+'/?c=wapsearch&a=onlygoods',
				data: param,
				error: function () {
				},
				success: function (data) {
					$('#hid_more').remove();
					$('.noMore.center.noMoreResult').css("display","none");
					$('.pro-list').html(data);
				}
			});
			this.pushstate(url);
		},
		getparam:function(page,sortprice){
			var url_sellType=0;
			var url_brandId=0;
			var url_price=0;
			var url_carriageId=0;
			var url_carFrom=0;
			var url_priceSort=0;
			var url_isacitvity=0;
			var fdata=window.emao.FDATA;
			for(var item in fdata){
				if(fdata[item].keyId=="sellType"){
					url_sellType=fdata[item].selectId;
				}
				if(fdata[item].keyId=="brandId"){
					url_brandId=fdata[item].selectId;
				}
				if(fdata[item].keyId=="price"){
					url_price=fdata[item].selectId;
				}
				if(fdata[item].keyId=="carriageId"){
					url_carriageId=fdata[item].selectId;
				}
				if(fdata[item].keyId=="carFrom"){
					url_carFrom=fdata[item].selectId;
				}
			}
			var param={"cityid":window.emao.mall_cityId,"page":page,"pricesort":sortprice,"goodstype":url_sellType,"brandid":url_brandId,"carriageid":url_carriageId,"priceid":url_price,"seller":url_carFrom};
			return param;
		},
		geturl:function(param){
			var url =  '/city/'+window.city.pinyin+ '/car';
			url += '-';
			url += param.goodstype;
			url += '-';
			url += param.brandid;
			url += '-';
			url += param.carriageid;
			url += '-';
			url += param.priceid;
			url += '-';
			url += param.seller;
			url += '-';
			url += 0;
			url += '-';
			url += param.pricesort;
			url += '-1.html';
			return url;
		},
		pushstate:function(url){
			if(history.pushState){
				history.pushState(null,'',window.URL.mall_m+url);
			}else{
				location.href=window.URL.mall_m+url;
			}
		},

	};
	app.init();
	sideBar.init();