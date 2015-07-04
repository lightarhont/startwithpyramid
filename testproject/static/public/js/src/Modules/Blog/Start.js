define(function(){
    
    var bm = Project.Classes.Modules.Blog = {};
    
    bm.Start = Marionette.Module.extend({
        
        startWithParent: false,
        
        initialize: function(options, moduleName, app) {},
        
        path: './project/Modules/Blogs/',
        
        onStart: function(options) {
            var self = this;
            Project.Router.on('route', this.stop, this);
            require(['./project/layouts', './project/Modules/Blog/Models', './project/Modules/Blog/Views',
             'text!../templates/twocolumnshema.html',
             'text!../templates/blog.html',],
    function(app, p1, p2, twocolumnshema, bloghtml){
    
    //Список задач
    Project.RenderTasksSet(['blog', 'toggleblocks', 'userpanel']);
    
    Project.Templates.Twocolumnshema = twocolumnshema;
    Project.Templates.Blog = bloghtml;
    var modelobj = new bm.BlogModel({slug: options.slug});
    modelobj.fetch({success: function(){
      if (modelobj.get('notfound') === 0) {
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
          MainLayoutViewObj.content.show(new bm.BlogView({model: modelobj}));
          if(modelobj.get('comments') === 1) {
            require(['./project/Modules/Comments/Start',], function(){
              Project.module("Comments", Project.Classes.Modules.Comments.Start);
              Project.Comments.start({
                thread: 'blog',
                threadid: modelobj.get('id'),
                threadtitle: modelobj.get('title'),
                premoderation: modelobj.get('comments_premoderation'),
                totalcomments: modelobj.get('comments_count'),
                });
            });
          }
          document.title = options.title + 'Блог::' + modelobj.get('title');
        });
      }
      else{
        alert('notfound');
      }
      },
      error: function(){
        
      }});
    });
        },
        
        onStop: function(){
            delete Project.Blog
        }
        
    });

});