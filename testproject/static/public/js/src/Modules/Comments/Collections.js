define(['./Models',],function(){
    
    //cm - Классы модуля
   var cm = Project.Classes.Modules.Comments;
   
    cm.CommentsCollection = Backbone.Collection.extend({
        initialize: function(models, opt){
            this.url = pfx+'comments/comments/'+opt.thread+'/'+ opt.threadid;
        },
        
        model: cm.CommentModel,
    });
    
    return Project;
    
});