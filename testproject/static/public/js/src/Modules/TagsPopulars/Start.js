define(function(){

   var tpm = Project.Classes.Modules.TagsPopulars = {};
   
   tpm.Start = Marionette.Module.extend({
      
      name: 'toggleblock',
      
      startWithParent: false,
      
      path: './project/Modules/TagsPopulars/',
      
      onStart: function(options) {
        var self = this;
        Project.Router.on('route', this.stop, this);
        require([(this.path + 'Models'), (this.path + 'Views'), (this.path + 'Collections'),
                 'text!../templates/rightblocks.html'], function(app, p, p2, html){
            self.Templates = html;
            tpm.Region = options.region;
            tpm.Region.show(new tpm.ToggleBlocksView);
        });
      },
      
      onStop: function() {
        delete Project.TagsPopulars;
      }
      
   });
   
   return Project;

});