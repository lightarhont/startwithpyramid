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
        require(['./project/layouts', './project/Views/Auth',
                 'text!../templates/singlecolumnshema.html',
                 'text!../templates/userlogin.html',], function(app, p1, singlecolumnshema, userlogin){
          
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
          
          //Список задач
          Project.RenderTasksSet(['loginform', 'userpanel']);
          
          Project.Templates.Singlecolumnshema = singlecolumnshema;
          Project.Templates.Userlogin = userlogin;
          var SingleColumnLayoutViewObj = new Project.Layouts.SingleColumnLayoutView;
          Project.MWR.show(SingleColumnLayoutViewObj);
          Project.Models.UserLoginObj = new Project.Classes.Models.UserLogin;
          Project.Views.UserLoginObj = new Project.Classes.Views.UserLogin({model: Project.Models.UserLoginObj});
          SingleColumnLayoutViewObj.content.show(Project.Views.UserLoginObj);
          document.title = title + 'Авторизация';
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