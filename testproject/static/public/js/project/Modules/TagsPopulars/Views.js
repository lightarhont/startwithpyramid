define(function(){

var tpm = Project.Classes.Modules.TagsPopulars;

tpm.ToggleBlocksView = Marionette.ItemView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.TagsPopulars.Templates, 'toggleblocks'))
    },
    
    onRender: function(){
        var toggle =  Marionette.Region.extend({
            el: '.panel1p2'
        });
        this.toggle = new toggle;
        this.delegateEvents(this.event2);
        this.defaulttoggle();
    },
    
    event1: {
        'click .panel1p11' : 'panel1',
    },
    
    event2: {
        'click .panel1p12' : 'panel2'
    },
    
    togglestyle: function(classname1, classname2){
      this.undelegateEvents();
      $('.'+classname1).css('background', '#fff');
      $('.'+classname1).css('border', 'none');
      $('.'+classname1).css('cursor', 'default');
      $('.'+classname1).css('border-left', 'solid 1px #cdcdcd');
      $('.'+classname1).css('border-right', 'solid 1px #cdcdcd');
      $('.'+classname1).css('border-top', 'solid 1px #cdcdcd');
      $('.'+classname2).css('background', 'transparent');
      $('.'+classname2).css('border', 'none');
      $('.'+classname2).css('cursor', 'pointer');
      $('.'+classname2).css('border-bottom', 'solid 1px #cdcdcd');
    },
    
    defaulttoggle: function(){
      var CollectionObj = new tpm.TagsCollection;
      var self = this;
      CollectionObj.fetch().then(function(){
        var TagsBlockObj = new tpm.TagsView({collection: CollectionObj});
        self.toggle.show(TagsBlockObj);
      });  
    },
    
    panel1: function(){
      this.togglestyle('panel1p11', 'panel1p12');
      this.delegateEvents(this.event2);
      this.defaulttoggle();
    },
    
    panel2: function(){
      this.togglestyle('panel1p12', 'panel1p11');
      this.delegateEvents(this.event1);
      var CollectionObj = new tpm.PopularsCollection;
      var self = this;
      CollectionObj.fetch().then(function(){
        var PopularsBlock = new tpm.PopularsView({collection: CollectionObj});
        self.toggle.show(PopularsBlock);
      });
    },
    
});

tpm.TagsView = Marionette.ItemView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.TagsPopulars.Templates, 'tagsblock'), {items: this.collection.models});
    },
    
    onShow: function(){
        Project.RenderStatusSet('toggleblocks');
    }
    
});

tpm.PopularsView = Marionette.ItemView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.TagsPopulars.Templates, 'popularsblock'), {items: this.collection.models});
    },
    
});

return Project;

});