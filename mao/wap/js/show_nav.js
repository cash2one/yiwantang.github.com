var _inherits = function(subClass, superClass) {
        var key, proto, selfProps = subClass.prototype, clazz = new Function();

        clazz.prototype = superClass.prototype;
        proto = subClass.prototype = new clazz();

        for (key in selfProps) {
            proto[key] = selfProps[key];
        }
        subClass.prototype.constructor = subClass;
        subClass.superClass = superClass.prototype;
        subClass.extend = function(json) {
            for (var i in json) {
                proto[i] = json[i];

            }
            if(json.toString) {
                proto.toString = json.toString;
            }
            if(json.valueOf) {
                proto.valueOf = json.valueOf;
            }
            return subClass;
        };

        return subClass;
    };
    window.Class=function (constructor, superClass){
        return _inherits(constructor, superClass || new Function());
};


var listModel = Class(function(arr,keyName,currIndex){
    this.push.apply(this,arr||[]);
    this.keyName=keyName||'id';
    this.currIndex=currIndex||0;
    this._data = {};
}, Array).extend({
    next:function(tag){
        var index=this.currIndex+1;
        index=Math.min(this.length-1,index);
        index=Math.max(0,index);
        !tag&&(this.currIndex=index);
        return this[index];
    },
    prev:function(tag){
        var index=this.currIndex-1;
        index=Math.min(this.length-1,index);
        index=Math.max(0,index);
        !tag&&(this.currIndex=index);
        return this[index];
    },
    curr:function(){
        return this[this.currIndex];
    },
    init:function(){


    },
    getSelectedData:function(){
      return this.getData(this.selectId);
    },
    getSelectedIndex:function(){
        return this.indexOf(this.selectId);
    },
    getData:function(key){
        for(var i=0;i<this.length;i++){
            if(this[i][this.keyName]==key)return this[i];
        }
        return null;
    },
    indexOf:function(key){
        for(var i=0;i<this.length;i++){
            if(this[i][this.keyName]==key)return i;
        }
        return -1;
    },
    getIdstr:function(){
        var list=[];
        var that=this;
        for(var i=0;i<this.length;i++){
            list.push(this[i][that.keyName]);
        }
        return list.join(',');
    },
    empty:function(){
      this.length=0;
      return this;
    },
    each:function(callback){
        for(var i=0;i<this.length;i++){
            callback&&callback.apply(this[i],[i,this[i]]);
        }
    },
    del:function(key){
        if(!key)return;
        var index=this.indexOf(key);
        if(index<0)return;
        this.splice(index,1);
        return this;
    },

    add:function(obj){
        if(!obj||!obj[this.keyName])return;
        var key=obj[this.keyName];
        if(this.indexOf(key)>-1)return;//已经添加
        this.push(obj);
    }
});

var selectedCls='selected';
var hoverCls='hover';
var fixedCls='fixed';
var app={
    init:function(list){
        this.$el=$('.leftnav');
        this.$navul=this.$el.find('ul');
        this.$navli=this.$el.find('li');
        this.$navitem=this.$el.find('.lfnav-item');
        this.$levelnav=$('.level-nav');
        this.offsetTop=this.$el.offset().top;
        this.elHeight=this.$el.height();
        this.$win=$(window);
        this.list=new listModel(list||[]);
        this.scrollTop=this.$win.scrollTop();
        if(this.list.length<1){
            this.$el.hide();
            return;
        };
        this.updateModel();
        this.bindEvent();
        this.scrollHandler();
		this.touchmove();
    },
    updateModel:function(){
        var that=this;
        this.list.each(function(i,item){
            item.top=$('.level-nav-'+item.id).offset().top;
        })
    },
    bindEvent:function(){
        var that=this;

        this.$navli.on('click',function(){
            var id=$(this).attr('data-id');
            that.changeSelectId(id);
        });
        this.$win.scroll(that.scrollHandler.bind(that));
        this.$win.resize(function(){
            that.changeSelectId(that.list.selectId,true);
        });

    },
    changeSelectId:function(id,noScroll){
        this.list.selectId=id;
        this.updateNav();
        !noScroll&&this.updateScrollTop();
    },

    updateNav:function(){
        var id=this.list.selectId;
        $('.lfnav-li-'+id).addClass(selectedCls).siblings().removeClass(selectedCls);
        this.updataFix();
    },
    updataFix:function(){
        var top=this.$win.scrollTop();
        this.offsetTop=this.$el.offset().top;
        top>=this.offsetTop-60?this.$navul.addClass(fixedCls):this.$navul.removeClass(fixedCls);
    },
    updateScrollTop:function(){
        var id=this.list.selectId;
        var $nav=$('.level-nav-'+id);
        var top=this.$win.scrollTop();
        window.scrollTo(0,$nav.offset().top-this.elHeight-50);

    },
    getIdByTop:function(top){
        var id=this.list[0].id;
        for(var i=0;i<this.list.length;i++){
            if(top>=(this.list[i].top-20-this.elHeight)){
                id= this.list[i].id;
            }
        }
        if(top+this.$win.height()+this.elHeight>$(document).height()){
            id=this.list[this.list.length-1].id;
        }
        return id;
    },

    scrollHandler:function(){
        var top=this.$win.scrollTop();
        var id=this.getIdByTop(top);
        this.changeSelectId(id,true);
        this.scrollTop=top;
    },
    show:function(){
        this.$el.fadeIn(300);
    },
    hide:function(){
        this.$el.fadeOut(200);
    },
	touchmove:function(){
		drag($('.leftnav ul'));
		function drag(obj)
		{
			obj.bind("touchstart",function(ev){
				startX=ev.originalEvent.changedTouches[0].clientX;
				startY=ev.originalEvent.changedTouches[0].clientY;
				
				var disX=ev.originalEvent.changedTouches[0].pageX-obj[0].offsetLeft;
				var disY=ev.originalEvent.changedTouches[0].pageY-obj[0].offsetTop;
				obj.bind("touchmove",function(ev){	
				var left=ev.originalEvent.changedTouches[0].pageX-disX;
				var top=ev.originalEvent.changedTouches[0].pageY-disY;
				endX=ev.originalEvent.changedTouches[0].clientX;
				endX=ev.originalEvent.changedTouches[0].clientY;
				changeX=endX-startX;
				changeY=endX-startY;
					
				if(left>0){
					left=0;
					obj.css('left',left+'px');
				}else if(left<-160){
					obj.css('left','-160px');
				}else{
					obj.css('left',left+'px');
				}
				
				obj.css('top',obj[0].offsetTop+'px');
				}
					
				)
				obj.bind("touchend",function(ev){
					
					/*obj[0].releaseCaptrue && obj[0].releaseCaptrue();*/
				})
				/*obj[0].setCaptrue && obj[0].setCaptrue();
				ev.preventDefault && ev.preventDefault();
				return false;*/
			})
		}		
	}
}
