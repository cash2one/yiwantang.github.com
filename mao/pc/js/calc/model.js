!function(root){
var Class = root.Class,
    event = root.eventDispatcher;
var Model = Class(function(){
    this._data = {};
}, event).extend({
    init : function(data) {
        if(data && 'object' === typeof data) {
            for(var p in data) {
                this._data[p] = data[p];
            }
        }
        return this;
    },
    set : function(key, value, inner) {
        var data;
        if(!key) return this;
        
        if(key && typeof key === 'object' && !inner) {
            for (var p in key) {
                this.set( p, key[p], true );
            }
            this.dispatchEvent('changed', {data: key});
            return this;
        }
        key = key + '';
        if( this._data[key] === value ) {
            return ;
        }
        this._data[key] = value;
        this.dispatchEvent('change', {
            key : key,
            value : value
        });
        this.dispatchEvent('change.' + key, {
            value : value
        });
        
        if(!inner) {
            data = {};
            data[key] = value;
            this.dispatchEvent('changed', {data: data});
        }
        return this;
    },
    get : function(key) {
        return this._data[key];
    },
    update: function(key) {
        if(typeof key === 'string') {
            var val = this.get(key);
            if(val === undefined) {
                return false;
            } else {
                this.dispatchEvent('change.' + key, {
                    value: this.get(key)
                });
            }
        } else if(key && key instanceof Model) {
            this.set(key._data);
        } else if( key && 'object' === typeof key ) {
            this.set(key);
        } else {
            for(var p in this._data) {
                this.dispatchEvent('change', {
                    key: p,
                    value: this._data[p]
                });
                this.dispatchEvent('change.' + p, {value: this._data[p]});
            }
        }
    }
});
root.Model=Model;
}(window);