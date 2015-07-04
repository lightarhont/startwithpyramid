define(function(){

var bm = Project.Classes.Modules.Blog;
    
bm.BlogModel = Backbone.Model.extend({
    defaults: {notfound: 0},
    urlRoot: function(){
        var slug = this.escape('slug');
        var url = pfx+'blogs/blog/'+slug;
        return url;
    }
});
    
return Project;

});