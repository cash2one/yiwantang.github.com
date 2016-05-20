var sideBar={
		init:function(){
			this.$el=$('.filter-sidebar');
			this.$box=this.$el.find('.side-box');
			this.$list=this.$el.find('.filter-list');
			this.$tit=this.$el.find('.tit');
			this.$sure=this.$el.find('.btn-sure');
			this.$cancel=this.$el.find('.btn-cancel');
			this.$filterHome=this.$el.find('.filterUl-home');
			this.$clear=this.$el.find('.clearbtn');
			this.$sidedata=new Array();
			this.bindData();
			this.bindEvent();

		},
		bindEvent:function(){
			var that=this;
			var curKeyId,selectName='全部';
			$('.filter-btn').click(function(){
				that.open();
				return false;
			});
			$('.home-item').click(function(){
				curKeyId=$(this).attr('keyid');
				var pageName=$(this).attr('page');
				that.changePage(curKeyId,pageName);
			});
			$('.filterUl-item li').click(function(){
				$(this).addClass('selected').siblings().removeClass('selected');
				selectName=$(this).find('span').text();
			});
			this.$sure.click(function(){
				var tit='筛选';
				var $curItem=$('.home-item[keyid="'+curKeyId+'"]');
				var curpage=that.$el.attr('page');
				$('.filterUl-item').hide();
				if(curpage=='home'){
					that.savedata();
					that.$tit.html(tit);
					that.close();
				}else{
					var selectId=$('.filterUl-item[keyid="'+curKeyId+'"]').find('li.selected').attr('data-id');
					selectId=selectId-0;
					curpage=curpage-0;
					that.$tit.html(tit);
					that.$filterHome.show();
					that.$el.attr('page','home');
					var keyVal=selectId?selectName:0;
					that.$sidedata[curpage]={'keyId':curKeyId,"keyName":$curItem.find(".fh-key").text(),"keyVal":keyVal,"selectId":selectId};
					if(selectId){
						$curItem.find('.fh-val').html('<span>'+selectName+'</span>');
					}else{
						$curItem.find('.fh-val').html('全部');
					}
				}
			})
			this.$cancel.click(function(){
				$('.filterUl-item').hide();
				var tit='筛选';
				if(that.$el.attr('page')=='home'){
					that.$tit.html(tit);
					that.close();
				}else{
					that.$tit.html(tit);
					that.$filterHome.show();
				}
			})
			this.$clear.click(function(){
				that.$el.attr('page','home');
				$('.home-item').each(function(){
					$(this).find('.fh-val').html('全部');
				})
				$('.filterUl-item').each(function(){
					$(this).find('li').removeClass('selected').first().addClass('selected');
				})
				var tmpdata=that.$sidedata;
				for(var item in tmpdata){
					tmpdata[item].keyVal=0;
					tmpdata[item].selectId=0;
				}
				var param = app.getparam(1,window.emao.sort);
				var url=app.geturl(param);
				app.pushstate(url);
			})
			$('body').click(function(){
				that.close();
			});
			this.$box.click(function(e){
				e.stopPropagation();
			});
		},
		savedata:function(){
			var objdata=this.$sidedata;
			var fdata=window.emao.FDATA;
			var tmparr=new Array();
			for(var item in fdata){
				var tmpfdata={'keyId':fdata[item].keyId,"keyName":fdata[item].keyName,"keyVal":fdata[item].keyVal,"selectId":fdata[item].selectId};
				tmparr.push(tmpfdata);
			}
			var strtmparr=JSON.stringify(tmparr);
			var strobjdata=JSON.stringify(objdata);
			var flage=true;
			if(strobjdata==strtmparr){
				flage=false;
			}
			if(flage){
				window.emao.page=1;
				for(var i=0;i<objdata.length;i++){
					fdata[i].keyId = objdata[i].keyId;
					fdata[i].keyName = objdata[i].keyName;
					fdata[i].keyVal = objdata[i].keyVal;
					fdata[i].selectId = objdata[i].selectId;
				}
				var param = app.getparam(1,window.emao.sort);
				var url=app.geturl(param);
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
				app.pushstate(url);
			}
		},
		bindData:function(){
			var sort=window.emao.sort-0;
			if(sort==2) {
				$('.list-icon').parent().removeClass('priceSort-1').addClass('priceSort-2');
			}else if(sort==1){
				$('.list-icon').parent().addClass('priceSort-1').removeClass('priceSort-2');
			}else if(sort==0){
				$('.list-icon').parent().removeClass('priceSort-1').removeClass('priceSort-2');
			}
			var fdata=window.emao.FDATA;
			var searchparam=window.emao.searchParam;
			var sellType=searchparam.goodsType;
			var brandId=searchparam.brandId;
			var carriageId=searchparam.carriageId;
			var price=searchparam.priceId;
			var carFrom=searchparam.seller;
			for(var item in fdata){
				var dataid=0;
				var keyid=fdata[item].keyId;
				if(keyid=='sellType'){
					dataid=sellType-0;
				}
				if(keyid=='brandId'){
					dataid=brandId-0;
				}
				if(keyid=='price'){
					dataid=price-0;
				}
				if(keyid=='carriageId'){
					dataid=carriageId-0;
				}
				if(keyid=='carFrom'){
					dataid=carFrom-0;
				}
				fdata[item].selectId=dataid;
				var itemlist=fdata[item].list;
				for(var tmp in itemlist){
					var itemlistid=itemlist[tmp].id-0;
					if(itemlistid==dataid){
						fdata[item].keyVal=dataid!=0?itemlist[tmp].name:0;
						break;
					}
				}
				var itemtxt='全部';
				if(dataid){
					itemtxt='<span>'+fdata[item].keyVal+'</span>';
				}
				$('.home-item[keyid="'+keyid+'"]').find('.fh-val').html(itemtxt);
				$('.filterUl-item[keyid="'+keyid+'"]').find('li').removeClass('selected');
				$('.filterUl-item[keyid="'+keyid+'"]').find('li[data-id="'+dataid+'"]').addClass('selected');
				var tmpdata={'keyId':keyid,"keyName":fdata[item].keyName,"keyVal":fdata[item].keyVal,"selectId":fdata[item].selectId};
				this.$sidedata.push(tmpdata);
			}
		},
		open:function(){
			this.show();
			$('.filterUl-item').hide();
			this.boxW=this.$box.width();
			this.$box.animate({'right':0},this.show.bind(this));
		},
		close:function(){
			this.show();
			this.boxW=this.$box.width();
			this.$box.animate({'right':-this.boxW},this.hide.bind(this));
		},
		show:function(){
			this.$el.show();
		},
		hide:function(){
			this.$el.hide();
		},
		changePage:function(keyVal,pageName){
			//$('.filterUl-item').hide();
			this.$filterHome.hide();
			this.$el.attr('page',pageName);
			var $item= $('.filterUl-item[keyid="'+keyVal+'"]');
			$item.show();
			this.$tit.text($item.attr('tit'));
		},
	}