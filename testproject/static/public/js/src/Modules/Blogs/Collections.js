define(function(){

var bsm = Project.Classes.Modules.Blogs

bsm.BlogsCollection = Backbone.Collection.extend({
    
    initialize: function(models, options){
      if (!_.isUndefined(options)) _.extend(this, options);
      
    },
    model: Backbone.Model.extend({}),
    url: function() {
        var url = pfx+'blogs/';
        if(this.tag) {
            return url+'tagblogs/'+this.tag;
        }
        return url+'blogs';
    }
});

return Project;

});