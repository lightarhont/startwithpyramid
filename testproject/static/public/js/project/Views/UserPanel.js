define(function(){
    
    Project.Classes.Views.UserPanel = Marionette.ItemView.extend({
        
        template: '#userpanel',
        
        onShow: function(){
            Project.RenderStatusSet('userpanel');
        }
        
    });
    
    Project.Classes.Views.UserPanelNoUser = Marionette.ItemView.extend({
        
        template: '#auth',
        
        onShow: function(){
            Project.RenderStatusSet('userpanel');
        }
        
    });
    
    
    
    return Project;
    
});