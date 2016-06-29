var sideBar = {
		init: function () {
			this.$el = $('.filter-sidebar');
			this.$box = this.$el.find('.side-box');
			this.$list = this.$el.find('.filter-list');
			this.$tit = this.$el.find('.tit');
			this.$sure = this.$el.find('.btn-sure');
			this.$cancel = this.$el.find('.btn-cancel');
			this.$filterHome = this.$el.find('.filterUl-home');
			this.$clear = this.$el.find('.clearbtn');
			this.bindEvent();
			this.$search=this.getparam(1);
			this.$search.serieid=window.emao.searchParamReal.serieId;
			this.$search.seriename="";
			if(this.$search.brandid>0 && this.$search.serieid>0){
				if(!(window.emao.carInfo instanceof Array) && window.emao.carInfo!=null){
					this.$search.seriename=window.emao.carInfo[this.$search.serieid-0].serieName;
				}else{
					this.$search.serieid=0;
				}
			}
		},
		bindEvent: function () {
			var that = this;
			var oneSelArr=['brandId','serieId','seller','goodsType'];
			var moreSelArr=['carriageId','priceId'];
			$('.filter-btn').click(function () {
				$('body').addClass('supernatant');
				//打开搜索框，初始化当前url搜索条件
				that.setparam("brandId",that.$search.brandid,that.$search.serieid,that.$search.seriename);
				that.setparam("seller",that.$search.seller);
				that.setparam("goodsType",that.$search.goodstype);
				if(window.emao.searchParamReal.brandId>0 && window.emao.searchParamReal.serieId>0){//有车系
					var carriageIdArr=that.$search.carriageid.toString().split('_');
					var priceIdArr=that.$search.priceid.toString().split('_');
					that.setparam("carriageId",carriageIdArr,window.emao.allCondition==null?null:window.emao.allCondition.carriageId);
					that.setparam("priceId",priceIdArr,window.emao.allCondition==null?null:window.emao.allCondition.priceId);
				}else{//无车系
					that.setparam("carriageId",that.$search.carriageid,null,1);
					that.setparam("priceId",that.$search.priceid,null,1);
				}
				that.open();
				return false;
			});
			$('.home-item').click(function () {
				var curKey=$(this).attr('key');
				var pageName = $(this).attr('page');
				that.changePage(curKey, pageName);
			});
			$('.filterUl-item').delegate('li','click',function() {//选择条件
				var gohome = false;//是否回到home主页
				var curKey=$(this).parent().attr('key');
				var liclass = $(this).attr('class');
				if (liclass && liclass.indexOf('disabled') >= 0) {
					return false;
				}
				var $curItem = $('.home-item[key="' + curKey + '"]');
				var branditem = $('.filterUl-item[key="brandId"]').find('li[class*="selected"]');
				var brandid = branditem.attr('data-id');
				var serieid = branditem.attr("serieid");
				if (brandid == 0) {
					serieid = 0;
				}
				if ($.inArray(curKey, oneSelArr) >= 0) {
					if (curKey == 'brandId') {
						$(this).addClass('selected').siblings().removeClass('selected');
						$(this).siblings().attr('serieid', 0);
						$(this).siblings().attr('seriename', "");
						$(this).siblings().find('.fh-val').remove();
						brandid=$(this).attr('data-id');
						brandname=$(this).find('.fh-key').text();
						if ((brandid - 0) > 0) {
							//异步获取车系
							var param = that.getparam(1);
							param.carriageid = 0;
							param.priceid = 0;
							$.ajax({
								async: false,
								cache: false,
								type: "GET",
								url: window.URL.mall_m + '/?c=wapsearch&a=filterBySearch',
								data: param,
								error: function () {
								},
								success: function (data) {
									if (data.code == 0) {
										$('.filterUl-item[key="serieId"]').attr("brandid", brandid);
										var result = data.data;
										var carinfo = result.carInfo;
										if (carinfo instanceof Array && carinfo.length <= 0) {
											$('.filterUl-item[key="serieId"]').html("");
											that.setparam('brandId', brandid,0,"无商品");
											that.setparam('carriageId',0,null,1);
											that.setparam('priceId',0,null,1);
										} else {
											that.setparam('brandId', brandid,0,"");
											var selfloat = false;
											var shtml = "";
											for (var item in carinfo) {
												var selecttxt = "";
												if (serieid == carinfo[item].serieId) {
													selecttxt = "selected";
													selfloat = true;
												}
												shtml += "<li class=\"" + selecttxt + "\" data-id=\"" + carinfo[item].serieId + "\"><span>" + carinfo[item].serieName + "</span></li>";
											}
											if (shtml != "") {
												var tmpsel = "";
												if (!selfloat) {
													tmpsel = "selected";
												}
												var allshtml = "<li class=\"" + tmpsel + "\" data-id=\"0\"><span>全部车系</span></li>";
												shtml = allshtml + shtml;
											}
											if (shtml) {
												that.$tit.html(brandname);
												$('.filterUl-item').hide();
												$('.filterUl-item[key="serieId"]').html(shtml);
												$('.filterUl-item[key="serieId"]').show();
											}
										}
									}
								}
							});
						}else{
							gohome = true;
							$(this).addClass('selected').siblings().removeClass('selected');
							var selectName = "";
							selectName = that.getparamName(curKey);
							if (selectName != "") {
								$curItem.find('.fh-val').html('<span>' + selectName + '</span>');
							} else {
								$curItem.find('.fh-val').html('全部');
							}
						}
					} else if (curKey == "seller" || curKey == "goodsType") {
						gohome = true;
						$(this).addClass('selected').siblings().removeClass('selected');
						var selectName = "";
						selectName = that.getparamName(curKey);
						if (selectName != "") {
							$curItem.find('.fh-val').html('<span>' + selectName + '</span>');
						} else {
							$curItem.find('.fh-val').html('全部');
						}
						var param =that.getparam(1);
						param.carriageid = 0;
						param.priceid = 0;
						that.ajaxparam(param, curKey);
					}else if(curKey=='serieId'){
						gohome=true;
						$(this).addClass('selected').siblings().removeClass('selected');
						var serieid=$(this).attr('data-id');
						var seriename=$(this).find('span').text();
						var brandid=$(this).parent().attr("brandid");
						var branditem=$('.filterUl-item[key="brandId"]').find('li[data-id="'+brandid+'"]');
						var brandname=branditem.find('.fh-key').text();
						that.setparam("brandId",brandid,serieid,seriename);
						var param =that.getparam(1);
						param.carriageid = 0;
						param.priceid = 0;
						if(param.serieid>0) {
							that.ajaxparam(param, curKey);
						}else{
							that.setparam('carriageId',0,null,1);
							that.setparam('priceId',0,null,1);
						}
					}
				} else if ($.inArray(curKey, moreSelArr) >= 0) {
					gohome = true;
					$(this).addClass('selected').siblings().removeClass('selected');
					var selectName = "";
					selectName = that.getparamName(curKey);
					if (serieid <= 0) {
						if (selectName != "") {
							$curItem.find('.fh-val').html('<span>' + selectName + '</span>');
						} else {
							$curItem.find('.fh-val').html('全部');
						}
					} else {
						if (selectName != "") {
							$curItem.find('.fh-val').html('<span>' + selectName + '</span>');
						} else {
							$('.filterUl-item[key="brandId"] li').removeClass('selected');
							$('.filterUl-item[key="brandId"] li').find('.fh-val').remove();
							$('.filterUl-item[key="brandId"] li[data-id="0"]').addClass('selected');
							$('.filterUl-item[key="brandId"] li').attr('serieid', 0);
							$('.filterUl-item[key="brandId"] li').attr('seriename', "");
							$('.filterUl-item[key="serieId"]').html("");
							$('.filterUl-item[key="serieId"]').attr('brandid',0);
							$('.filterUl-item[key="carriageId"] li').removeClass('selected').removeClass('disabled');
							$('.filterUl-item[key="carriageId"] li[data-id="0"]').addClass('selected');
							$('.filterUl-item[key="priceId"] li').removeClass('selected').removeClass('disabled');
							$('.filterUl-item[key="priceId"] li[data-id="0"]').addClass('selected');
							$('.home-item[key="brandId"]').find('.fh-val').html('全部');
							$('.home-item[key="carriageId"]').find('.fh-val').html('全部');
							$('.home-item[key="priceId"]').find('.fh-val').html('全部');
						}
					}
				}
				if (gohome) {
					that.gohome();
				}
			});
			this.$sure.click(function () {
				$('#sidebar-serie').hide();
				$('.side-CXlist').hide();
				var tit = '筛选';
				var curpage = that.$el.attr('page');
				$('.filterUl-item').hide();
				if (curpage == 'home') {
					that.$tit.html(tit);
					that.close();
					var param=that.getparam(1);
					var url=that.geturl(param);
					location.href=url;
				}
			});
			this.$cancel.click(function () {
				$('.filterUl-item').hide();
				var tit = '筛选';
				if (that.$el.attr('page') == 'home') {
					that.$tit.html(tit);
					that.close();
				} else {
					that.$el.attr('page', 'home');
					that.$tit.html(tit);
					that.$filterHome.show();
					that.$sure.show();
				}
			});
			this.$clear.click(function () {
				that.clearBox();
			});
			$('body>*').click(function () {
				that.close();
			});
			this.$box.click(function (e) {
				e.stopPropagation();
			});
		},
		getparam:function(page){
			var branditem=$('.filterUl-item[key="brandId"]').find('li[class*="selected"]');
			var brandid=0;
			if(branditem.length>0){
				brandid=branditem.attr("data-id");
			}
			var serieid=branditem.attr('serieid');
			var selcarriageid=$('.filterUl-item[key="carriageId"]').find('li[class*="selected"]');
			var carriageid=0;
			if(selcarriageid.length>1){
				carriageid=$(selcarriageid[0]).attr('data-id');
				for(var i=1;i<selcarriageid.length;i++){
					carriageid+='_'+$(selcarriageid[i]).attr('data-id');
				}
			}else if(selcarriageid.length==1){
				carriageid=$(selcarriageid[0]).attr('data-id');
			}
			else{
				carriageid=0;
			}
			var selpriceid=$('.filterUl-item[key="priceId"]').find('li[class*="selected"]');
			var priceid=0;
			if(selpriceid.length>1){
				priceid=$(selpriceid[0]).attr('data-id');
				for(var i=1;i<selpriceid.length;i++){
					priceid+='_'+$(selpriceid[i]).attr('data-id');
				}
			}else if(selpriceid.length==1){
				priceid=$(selpriceid[0]).attr('data-id');
			}
			else{
				priceid=0;
			}
			var selseller=$('.filterUl-item[key="seller"]').find('li[class*="selected"]');
			var seller=0;
			if(selseller.length>1){
				seller=$(selseller[0]).attr('data-id');
				for(var i=1;i<selseller.length;i++){
					seller+='_'+$(selseller[i]).attr('data-id');
				}
			}else if(selseller.length==1){
				seller=$(selseller[0]).attr('data-id');
			}
			else{
				seller=0;
			}
			var selgoodstype=$('.filterUl-item[key="goodsType"]').find('li[class*="selected"]');
			var goodstype=0;
			if(selgoodstype.length>1){
				goodstype=$(selgoodstype[0]).attr('data-id');
				for(var i=1;i<selgoodstype.length;i++){
					goodstype+='_'+$(selgoodstype[i]).attr('data-id');
				}
			}else if(selgoodstype.length==1){
				goodstype=$(selgoodstype[0]).attr('data-id');
			}
			else{
				goodstype=0;
			}
			return {"cityid":window.city.cityId,"pricesort":window.emao.sort,"page":page,"brandid":brandid,"serieid":serieid,"carriageid":carriageid,"priceid":priceid,"seller":seller,"goodstype":goodstype};
		},
		ajaxparam:function(param,curkey){
			var that=this;
			$.ajax({
				async: false,
				cache: false,
				type: "GET",
				url: window.URL.mall_m + '/?c=wapsearch&a=filterBySearch',
				data: param,
				error: function () {
				},
				success: function (data) {
					if(data.code==0) {
						//处理条件集
						var allcondition = data.data;
						var carriageid = allcondition.carriageId;
						var priceid = allcondition.priceId;
						var carriageid2 = allcondition.carriageId2;
						var priceid2 = allcondition.priceId2;
						if(curkey=='serieId') {
							that.setparam('brandId', null);
						}
						var setcar_pri=true;
						if(curkey=="seller" || curkey=="goodsType"){
							var carInfo=data.data.carInfo;
							if(carInfo instanceof Array && carInfo.length<=0){//如果按来源和类型搜索出来的车系为空
								setcar_pri=false;
							}
							if(carriageid instanceof Array && carriageid.length<=0){//如果按来源和类型搜索出来的车系为空
								setcar_pri=false;
							}
							if(carriageid2 instanceof Array && carriageid2.length<=0){//如果按来源和类型搜索出来的车系为空
								setcar_pri=false;
							}
							if(priceid instanceof Array && priceid.length<=0){//如果按来源和类型搜索出来的车系为空
								setcar_pri=false;
							}
							if(priceid2 instanceof Array && priceid2.length<=0){//如果按来源和类型搜索出来的车系为空
								setcar_pri=false;
							}
							if(!setcar_pri){
								selectname=that.getparamName('brandId');
								if (selectname != "") {
									selectname="<span>"+selectname+"(无商品)</span>";
									var branditem=$('.filterUl-item[key="brandId"]').find('li[data-id="'+param.brandid+'"]');
									if(branditem.find('.fh-val').length>0){
										branditem.find('.fh-val').html("<span>无商品</span>");
									}
								}else{
									selectname='全部';
								}
								$('.home-item[key="brandId"]').find('.fh-val').html(selectname);
							}
						}
						if(setcar_pri){
							that.setparam("brandId",null);
							that.setparam("carriageId",carriageid,carriageid2);
							that.setparam("priceId",priceid,priceid2);
							var branditem=$('.filterUl-item[key="brandId"]').find('li[data-id="'+param.brandid+'"]');
							if(branditem.find('.fh-val').length>0){
								var seriename=branditem.attr('seriename');
								branditem.find('.fh-val').html("<span>"+seriename+"</span>");
							}
						}
					}
				}
			});
		},
		setparam:function(key,condition,condition2,tmp){
			var selectname='全部';
			if(condition!=null && typeof(condition)!= "undefined") {
				switch (key){
					case "brandId":
						$('.filterUl-item[key="' + key + '"]').find("li").removeClass('selected');
						$('.filterUl-item[key="' + key + '"]').find("li").attr('serieid',0);
						$('.filterUl-item[key="' + key + '"]').find("li").attr('seriename',"");
						$('.filterUl-item[key="' + key + '"] li').find('.fh-val').remove();
						if (condition>0) {
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").addClass('selected');
							if(condition2!=null && typeof(condition2)!= "undefined"){
								var serieId=condition2;
								$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").attr('serieid',serieId);
							}
							if(tmp!=null && typeof(tmp)!= "undefined"){
								var serieName=tmp;
								$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").attr('seriename',(serieName=="无商品" || serieName=="全部车系")?"":serieName);
								$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").append("<div class='fh-val flex1'><span>"+serieName+"</span></div>");
							}
						} else {
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='0']").addClass('selected');
						}
						break;
					case "seller":
					case "goodsType":
						$('.filterUl-item[key="' + key + '"]').find("li").removeClass('selected');
						if (condition>0) {
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").addClass('selected');
						} else {
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='0']").addClass('selected').removeClass('disabled');
						}
						break;
					case "carriageId":
					case "priceId":
						$('.filterUl-item[key="' + key + '"]').find("li").removeClass('selected');
						if(tmp==null || typeof(tmp)== "undefined" || tmp==0){//控制级别和价格单选和多选时候的样式
							$('.filterUl-item[key="' + key + '"]').find("li").addClass('disabled');
						}
						if(condition instanceof Array) {
							if (condition.length > 0) {
								for (var item in condition) {
									var itemid = condition[item];
									$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + itemid + "']").removeClass('disabled');
									$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + itemid + "']").addClass('selected');
								}
							} else {
								$('.filterUl-item[key="' + key + '"]').find("li[data-id='0']").addClass('selected').removeClass('disabled');
							}
						}else if(condition>0){
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").removeClass('disabled');
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + condition + "']").addClass('selected');
						}else{
							$('.filterUl-item[key="' + key + '"]').find("li").removeClass('disabled');
							$('.filterUl-item[key="' + key + '"]').find("li[data-id='0']").addClass('selected');
						}
						if(condition2!=null && typeof(condition2)!= "undefined") {
							if(condition instanceof Array) {
								if (condition2.length > 0) {
									for (var item in condition2) {
										var itemid = condition2[item];
										$('.filterUl-item[key="' + key + '"]').find("li[data-id='" + itemid + "']").removeClass('disabled');
									}
								}
							}
						}
						break;
				}
			}
			selectname=this.getparamName(key);
			if (selectname != "") {
				selectname="<span>"+selectname+"</span>";
			}else{
				selectname='全部';
			}
			$('.home-item[key="'+key+'"]').find('.fh-val').html(selectname);
		},
		getparamName:function(key){
			switch(key) {
				case 'brandId':
					var branditem = $('.filterUl-item[key="brandId"]').find('li[class*="selected"]')
					var brandid = branditem.length > 0 ? branditem.attr("data-id") : 0;
					var serieid = branditem.attr('serieid');
					var seriename=branditem.attr('seriename');
					var brandname=branditem.find('.fh-key').text();
					if(brandid>0) {
						if (serieid != 0 && seriename != "") {
							return brandname + "-" + seriename;
						} else {
							return brandname;
						}
					}
					break;
				case 'carriageId':
					var carriageid=$('.filterUl-item[key="carriageId"]').find('li[class*="selected"]').first().attr('data-id');
					carriageid=carriageid-0;
					if(carriageid) {
						return $('.filterUl-item[key="carriageId"]').find('li[data-id="' + carriageid + '"]').find('span').text();
					}
					break;
				case 'priceId':
					var priceid=$('.filterUl-item[key="priceId"]').find('li[class*="selected"]').first().attr('data-id');
					priceid=priceid-0;
					if(priceid) {
						return $('.filterUl-item[key="priceId"]').find('li[data-id="' + priceid + '"]').find('span').text();
					}
					break;
				case 'seller':
					var seller=$('.filterUl-item[key="seller"]').find('li[class*="selected"]').attr('data-id');
					seller=seller-0;
					if(seller) {
						return $('.filterUl-item[key="seller"]').find('li[data-id="' + seller + '"]').find('span').text();
					}
					break;
				case 'goodsType':
					var goodstype=$('.filterUl-item[key="goodsType"]').find('li[class*="selected"]').attr('data-id');
					goodstype=goodstype-0;
					if(goodstype) {
						return $('.filterUl-item[key="goodsType"]').find('li[data-id="' + goodstype + '"]').find('span').text();
					}
					break;
			}
			return "";
		},
		geturl:function(param){
			var url = window.URL.mall_m+"/city/"+window.city.pinyin+"/car-" +param.goodstype+'-'+param.brandid+ '-'+param.serieid+'-'+param.carriageid+'-'+param.seller+'-'+param.priceid+'-'+window.emao.sort+'-'+param.page+'.html';
			return url;
		},
		clearBox: function () {
			this.$el.attr('page', 'home');
			$('.home-item').each(function () {
				$(this).find('.fh-val').html('全部');
			})
			$('.filterUl-item').each(function () {
				$(this).find('li').removeClass('selected').removeClass('disabled').first().addClass('selected');
			})
			$('.filterUl-item[key="brandId"] li').find('.fh-val').remove();
			$('.filterUl-item[key="brandId"] li').attr('serieid', 0);
			$('.filterUl-item[key="brandId"] li').attr('seriename', "");
			$('.filterUl-item[key="serieId"]').html("");
			$('.filterUl-item[key="serieId"]').attr('brandid',0);
		},
		open: function () {
			this.show();
			this.$el.attr('page', 'home');
			this.$tit.html('筛选');
			this.$filterHome.show();
			$('.filterUl-item').hide();
			this.boxW = this.$box.width();
			this.$box.animate({'right': 0}, this.show.bind(this));
			this.$sure.show();
		},
		close: function () {
			this.boxW = this.$box.width();
			this.$box.animate({'right': -this.boxW}, this.hide.bind(this));
			$('#sidebar-serie').hide();
			$('.side-CXlist').hide();
		},
		show: function () {
			this.$el.show();
		},
		hide: function () {
			this.$el.hide();
			$('body').removeClass('supernatant');
		},
		changePage: function (keyVal, pageName) {
			this.$filterHome.hide();
			this.$el.attr('page', pageName);
			var $item = $('.filterUl-item[key="' + keyVal + '"]');
			$item.show();
			this.$tit.text($item.attr('tit'));
			this.$sure.hide();
		},
		gohome:function(){
			var curpage = this.$el.attr('page');
			$('.filterUl-item').hide();
			this.$tit.html('筛选');
			this.$filterHome.show();
			this.$el.attr('page', 'home');
			this.$sure.show();
		},
	};
	sideBar.init();