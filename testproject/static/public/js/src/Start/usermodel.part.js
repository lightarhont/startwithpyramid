Project.Classes.Models.User = Backbone.Model.extend({
    
    defaults: {
        userid: 0,
        username: 'guest',
        permissions: []
    },
    
    urlRoot: '/comments/restuser',
    
    autofetch: function(){
        var self = this;
        setInterval(function(){
            self.fetch();
        }, 6000);
    },
    
    });