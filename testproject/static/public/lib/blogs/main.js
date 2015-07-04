
var Project = new Backbone.Marionette.Application();

Project.commands.setHandler("foo", function(bar){
  console.log(bar);
});

var vent = _.extend({}, Backbone.Events);

var AppLayoutView = Backbone.Marionette.LayoutView.extend({
    
    template: "#maintemplate",
    
    regions: {
        content: ".column24",
        auth: ".toppos"
    }
    
});

var mwr = new Backbone.Marionette.Region({
  el: "#mwr"
});


//Виды
var blogs = Backbone.View.extend({
    
    tagName: 'div',
    
    template: _.template($('#blogs').html()),
    
    initialize: function(){
        console.log('init');
    },
    
    render: function(){
        console.log('render');
        this.$el.html(this.template({'sdsd': 23}));
    },
    
    close: function(){
        console.log('close');
    },
});

var blog = Backbone.View.extend({
    
    tagName: 'div',
    
    template: _.template($('#blog').html()),
    
    initialize: function(){
        console.log('init');
    },
    
    render: function(){
        console.log('render');
        this.$el.html(this.template({'sdsd': 23}));
    },
    
    close: function(){
        console.log('close');
    },
});

var layoutView = new AppLayoutView();
mwr.show(layoutView);

//Контроллер
var MainController = Marionette.Controller.extend({
  index: function() {
    
    layoutView.content.show(new blogs);
  },
  blog: function() {
    layoutView.content.show(new blog);
    },
  blogs: function() {}
});

var MainControllerObj = new MainController();

var myRouter = new Marionette.AppRouter({
  controller: MainControllerObj,
  appRoutes: {
    "" : "index",
    "blog/:id": "blog",
    "blogs": "blogs"
  }
});


Backbone.history.start();


