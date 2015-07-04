define(function(){

Project.Classes.Views.UserLogin = Marionette.ItemView.extend({
        
        initialize: function(){
          this.template = _.template(Project.TemplateHelper(Project.Templates.Userlogin, 'userlogin'));
          this.on('nouser', this.nouser, this);
          this.on('nologinpermission', this.nologinpermission, this);
          this.on('loginuser', this.loginuser, this);
        },
        
        events: {
            'click a' : 'setmodel'
        },
        
        setmodel: function(){
            var self = this;
            this.model.set({username: $('#username').val(), password: $('#password').val()});
            this.model.save({}, {
                wait: true,
                success: function(model, response){
                    if (_.has(response, 'user') && response['user'] === false) {
                        self.trigger('nouser');
                    }
                    else {
                        if (_.has(response, 'auth') && response['auth'] === false) {
                            self.trigger('nologinpermission');
                        }
                        else {
                            self.trigger('loginuser', response);
                            model.clear();
                        }
                    }
                }});
        },
        
        nouser: function(){},
        
        nologinpermission: function(){},
        
        loginuser: function(response){
                this.undelegateEvents();
                for (i=0;i<response.headers.length;i++) {
                    document.cookie = response.headers[i][1]
                }
                delete response.headers;
                Project.Models.UserObj.clear().set(Project.Models.UserObj.defaults).set(response);
                try {
                        link('/');    
                } catch(e) {
                        setTimeout(function(){link('/');}, 200);
                }
                        
            },
        
        onShow: function(){
                Project.RenderStatusSet('loginform');
        }
        
        });

        return Project;

});