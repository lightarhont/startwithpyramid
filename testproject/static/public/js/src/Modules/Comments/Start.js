define(function(){
   
   var cm = Project.Classes.Modules.Comments = {};
   
   cm.Start = Marionette.Module.extend({
    
    startWithParent: false,
    
    initialize: function(options, moduleName, app) {
    },
    
    path: './project/Modules/Comments/',
    
    onStart: function(options) {
        var self = this;
        Project.Router.on('route', this.stop, this);
        require([(this.path + 'Models'), (this.path + 'Views'), (this.path + 'Collections'), 'wysibb',
                 'text!../templates/comments.html'], function(app, p, p2, p3, html){
            //console.log('start comments');
            self.Templates = html;
            self.AddCommentForm = new Marionette.Region({el: ".addcommentform"});
            self.AllComments = new Marionette.Region({el: "#allcomments"});
            
            self.SettingsModelObj = new cm.SettingsModel(options);
            self.CountCommentsModelObj = new cm.CountCommentsModel;
            
            self.CommentsPanelViewObj = new cm.CommentsPanelView({model: self.CountCommentsModelObj});

            self.CommentsCollectionObj = new cm.CommentsCollection([], options);
            
            self.CommentFormViewObj = new cm.CommentFormView({collection: self.CommentsCollectionObj});
            if (self.SettingsModelObj.get('permcomments') === 1) {
               self.AddCommentForm.show(self.CommentFormViewObj);
            }    
        
        });

    },
    
    onStop: function() {
        this.SettingsModelObj.stopListening();
        this.CommentFormViewObj.stopListening();
        if(_.has(this, 'CommentsViewObj')) {
         this.CommentsViewObj.destroy();
        }
        
        delete Project.Comments;

        //console.log('stop comments');
    },
    
   });
   
   return Project;
   
});