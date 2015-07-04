define(function(){
    
    var bsm = Project.Classes.Modules.Blogs = {};
    
    bsm.Start = Marionette.Module.extend({
        
        startWithParent: false,
        
        initialize: function(options, moduleName, app) {},
        
        path: './project/Modules/Blogs/',
        
        onStart: function(options) {
            var self = this;
            Project.Router.on('route', this.stop, this);
            require(['./project/layouts', './project/Modules/Blogs/Collections', './project/Modules/Blogs/Views',
             'text!../templates/twocolumnshema.html',
             'text!../templates/blog.html'],
            function(app, p1, p2, twocolumnshema, bloghtml){
    
            //Список задач
            Project.RenderTasksSet(['blogs', 'toggleblocks', 'userpanel']);
    
            Project.Templates.Twocolumnshema = twocolumnshema;
            Project.Templates.Blog = bloghtml;
            if (_.has(options, 'tag')) {
                var collectionobj = new bsm.BlogsCollection(undefined, {tag: _.escape(options.tag)});
            }
            else {
                var collectionobj = new bsm.BlogsCollection;
            }
            
            collectionobj.fetch({
            success: function(){
                var rightblocks = ['TagsPopulars',];
                var rightblocksload = rightblocks.map(function(n){
                if (_.isArray(n)) {
                  return './project/Modules/'+n[0]+'/Start';
                } else {
                  return './project/Modules/'+n+'/Start'; }
                });
                require(rightblocksload, function(){
                  var MainLayoutViewObj = new Project.Layouts.MainLayoutView({rightblocks: rightblocks});
                  Project.MWR.show(MainLayoutViewObj);
                  MainLayoutViewObj.content.show(new bsm.BlogsView({collection: collectionobj}));
                  document.title = options.title + 'Блоги';
                });
              },
            error: function(){
            }
    });
    });
        },
        
        onStop: function() {
            delete Project.Blogs
        }
        
    });
    
    return Project;
    
});