define(function(){

var bsm = Project.Classes.Modules.Blogs

bsm.BlogView = Marionette.ItemView.extend({
    
    tagName: 'div',
    
    className: "posts small-12 medium-12 large-12",
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Blog, 'BlogItems'));
    },
    
    onBeforeRender: function(){
        var date = new Date();
        date.setTime(this.model.get('created')*1000);
        this.model.set('fcreated', datef('dd MMM YYYY HH:mm',date));
    },
    
});

bsm.BlogsView = Marionette.CompositeView.extend({
    
    childView: bsm.BlogView,
    
    childViewContainer: "#blogitems",
    
    tagName: 'div',
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Blog, 'BlogItemsCollection'));
    },
    
    onShow: function(){
        Project.RenderStatusSet('blogs');
    }
});

return Project;

});