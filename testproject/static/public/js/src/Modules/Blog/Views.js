define(function(){

var bm = Project.Classes.Modules.Blog;

bm.BlogView = Marionette.ItemView.extend({
    
    tagName: 'div',
    className: "row collapse",
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Blog, 'blog'));
    },
    
    onBeforeRender: function(){
        var date = new Date();
        date.setTime(this.model.get('created')*1000);
        this.model.set('fcreated', datef('dd MMM YYYY HH:mm',date));
    },
    
    onShow: function(){
        Project.RenderStatusSet('blog');
    }
    
});

return Project;

});