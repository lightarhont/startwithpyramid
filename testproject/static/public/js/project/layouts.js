define(function(){

Project.Classes.Views.Mainmenu = Marionette.ItemView.extend({
    template: '#mainmenu',
    tagName: 'div',
    className: "small-12 medium-12 large-12 large-centered columns",
    });

Project.Layouts.MainLayoutView = Marionette.LayoutView.extend({
    
    rightblocks: [],
    
    initialize: function(opt){
        
        var classes = [];
        for(i=0;i<opt.rightblocks.length;i++){
            if (_.isArray(opt.rightblocks[i])) {
                var cm = Project.Classes.Modules[opt.rightblocks[i][0]]    
                var block = this.rightblocks[i] = Project.module(opt.rightblocks[i][0], cm.Start);
                block.options = opt.rightblocks[i][1];  
            } else {
                var cm = Project.Classes.Modules[opt.rightblocks[i]]    
                var block = this.rightblocks[i] = Project.module(opt.rightblocks[i], cm.Start);
            }
            classes[i] = block.name;
            this.addRegion(block.name, '.'+block.name);
        }
        
        var tplm = Project.TemplateHelper(Project.Templates.Twocolumnshema, 'twocolumnshema');
        var tmp = $(tplm).map(function(){
            t = $(this).find('.column10');
            if(t.length === 1){
                html = [];
                for(i=0;i<classes.length;i++){
                    html[i] = '<div class="row '+classes[i]+'"></div>';
                }
                t.html(''.concat(html))
            }
        });
        tplm = $("<div></div>").append(tmp.prevObject).html();
        
        this.template = _.template(tplm);
        
        
    },
    
    onRender: function(){
        
        var self = this; 
        require(['./project/Views/UserPanel'], function(){
            var u = Project.Models.UserObj;
            self.veryfy(u);
        });
        
        this.mainmenu.show(new Project.Classes.Views.Mainmenu);
        
        for(i=0; i<this.rightblocks.length; i++){
            this.rightblocks[i].start({region: this[this.rightblocks[i].name]});
        }
    },
    
    veryfy: function(u){
        if(u.get('userid') != 0) {
            this.auth.show(new Project.Classes.Views.UserPanel({model: Project.Models.UserObj}))  
        } else {
            this.auth.show(new Project.Classes.Views.UserPanelNoUser);
        }
    },
    
    regions: {
        mainmenu: ".menupos",
        content: ".column24",
        auth: ".toppos"
    }
  });

Project.Layouts.SingleColumnLayoutView = Marionette.LayoutView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Singlecolumnshema, 'singlecolumnshema'));
    },
    
    onRender: function(){
        var self = this; 
        require(['./project/Views/UserPanel'], function(){
            var u = Project.Models.UserObj;
            self.veryfy(u);
        });
        
        this.mainmenu.show(new Project.Classes.Views.Mainmenu);
    },
    
    veryfy: function(u){
        if(u.get('userid') != 0) {
            this.auth.show(new Project.Classes.Views.UserPanel({model: Project.Models.UserObj}))   
        } else {
            this.auth.show(new Project.Classes.Views.UserPanelNoUser);   
        }
    },
    
    regions: {
        mainmenu: ".menupos",
        content: ".content",
        auth: ".toppos"
    }

  });

Project.Layouts.SingleColumnLayoutView2 = Marionette.LayoutView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Singlecolumn2shema, 'singlecolumn2shema'));
        var self = this; 
        require(['./project/Views/UserPanel'], function(){
            var u = Project.Models.UserObj;
            self.veryfy(u);
        });
    },
    
    onRender: function(){
        var self = this; 
        require(['./project/Views/UserPanel'], function(){
            var u = Project.Models.UserObj;
            self.veryfy(u);
        });
        
        this.mainmenu.show(new Project.Classes.Views.Mainmenu);
    },
    
    veryfy: function(u){
        if(u.get('userid') != 0) {
            this.auth.show(new Project.Classes.Views.UserPanel({model: Project.Models.UserObj}));   
        } else {
            this.auth.show(new Project.Classes.Views.UserPanelNoUser);   
        }
    },
    
    regions: {
        mainmenu: ".menupos",
        content: ".content",
        auth: ".toppos"
    }

  });

Project.Layouts.Profile = Marionette.LayoutView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Profileshema, 'profileshema'));
    },
    
    regions: {
        main: ".profilecontent"
    }
    
});

return Project;

});