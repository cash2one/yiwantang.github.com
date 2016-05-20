__inline('./calc.js');
__inline('./model.js');
__inline('./view.js');
!function(root) {
    var View = root.View;
    var Model = root.Model;
    var App = root.Class(function () {
    }, root.eventDispatcher).extend({
        init: function () {
            this.model = new Model();
            this.view = new View({app:this,model:this.model});
            this.data={};
            this.data.CommInsureCheck={};
            this.view.init();
            this.model.init();
        },
        calc: function(arg){
            arg=arg||{};
            var data= $.extend(this.data,arg.data);
            data.CommInsureCheck=$.extend(this.data.CommInsureCheck,arg.CommInsureCheck);
            data=calc(data).getData();
            this.model.set(data);
            this.data=data;
        }

    });
    var app = new App();
    app.init();
    root.app=app;
}(window);