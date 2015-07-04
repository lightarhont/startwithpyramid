define(function(){
    
    var lm = Project.Classes.Modules.Login = {};
    
    lm.Start = Marionette.Module.extend({
        
        startWithParent: false,
        
        initialize: function(options, moduleName, app) {},
        
        path: './project/Modules/Blogs/',
        
        onStart: function(options) {
            var self = this;
            Project.Router.on('route', this.stop, this);
            if (Project.Models.UserObj.get('userid') === 0) {
        require(['./project/layouts',
                 'text!../templates/singlecolumnshema.html',
                 'text!../templates/userlogin.html',], function(app, singlecolumnshema, userlogin){
          
    Project.Classes.Models.UserLogin = Backbone.Model.extend({
        
    initialize: function(){
    },
        
    defaults: {
        username: '',
        password: ''
    },
        
    validate: function(attrs){
        if (attrs.username.length < 2) {return 'Имя пользователя не должно быть короче 2 символов!';}
        if (attrs.password.length < 6) {return 'Пароль не должен быть короче 6 символов!';}
    },
        
    urlRoot: function(){
        return pfx+'user/login';
    }
        
    });
    
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
          
          //Список задач
          Project.RenderTasksSet(['loginform', 'userpanel']);
          
          Project.Templates.Singlecolumnshema = singlecolumnshema;
          Project.Templates.Userlogin = userlogin;
          var SingleColumnLayoutViewObj = new Project.Layouts.SingleColumnLayoutView;
          Project.MWR.show(SingleColumnLayoutViewObj);
          Project.Models.UserLoginObj = new Project.Classes.Models.UserLogin;
          Project.Views.UserLoginObj = new Project.Classes.Views.UserLogin({model: Project.Models.UserLoginObj});
          SingleColumnLayoutViewObj.content.show(Project.Views.UserLoginObj);
          document.title = options.title + 'Авторизация';
        });
      }
      else{
        alert('userin');
      }
        },
        
        onStop: function() {
            
        }
        
    });
        

});