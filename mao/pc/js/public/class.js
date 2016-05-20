!function(root){
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
    root.Class=function (constructor, superClass){
        return _inherits(constructor, superClass || new Function());
    };
}(window);
