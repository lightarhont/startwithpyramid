define(function(){
    
    var rm = Project.Classes.Modules.Registration = {};
    
    rm.Start = Marionette.Module.extend({
        
        startWithParent: false,
        
        initialize: function(options, moduleName, app) {},
        
        path: './project/Modules/Blogs/',
        
        onStart: function(options) {
            var self = this;
            Project.Router.on('route', this.stop, this);
            if (Project.Models.UserObj.get('userid') === 0) {
      require(['./project/layouts', './project/Views/Register',
               'text!../templates/singlecolumnshema.html',
               'text!../templates/userregistration.html'], function(app, p1, singlecolumnshema, userregistration){
        
        Project.Classes.Models.UserRegister = Backbone.Model.extend({
    
    initialize: function(){
    },
    
    defaults: {
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    },
    
    validate: function(attrs){
        
        if (attrs.username.length < 2) {return {'username': 'Имя пользователя не должно быть короче 2 символов!'};}
        var re = new RegExp("^[a-zA-Z][a-zA-Z0-9-_\.]+$");
        if (!re.test(attrs.username)) {return {'username': 'Имя пользователя должно содержать только латинские буквы цифры, дефис, подчёркивание, слеш, точка!'};}
        if (attrs.fullname.length < 2) {return {'fullname': 'Полное имя не должно быть короче 2 символов!'};}
        re = new RegExp("^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_\.]+$");
        if (!re.test(attrs.fullname)) {return {'fullname': 'Полное имя должно содержать только русские-латинские буквы цифры, дефис, подчёркивание, слеш, точка!'};}
        if (attrs.password.length < 6) {return {'password': 'Пароль не должен быть короче 6 символов!'};}
        re = new RegExp("^[a-zA-Z0-9]+$");
        if (!re.test(attrs.password)) {return {'password': 'Пароль должен содержать cтрочные и прописные латинские буквы, цифры!'};}
        if (attrs.password != attrs.confirmpassword) {return {'password': 'Пароли не совпадают!'};}
        
    },
    
    urlRoot: function(){
        return pfx+'user/register';
    }
    
});
        
        //Список задач
        Project.RenderTasksSet(['registerform', 'userpanel']);
        
        Project.Templates.Singlecolumnshema = singlecolumnshema;
        Project.Templates.Register = userregistration;
        var SingleColumnLayoutViewObj = new Project.Layouts.SingleColumnLayoutView;
        Project.MWR.show(SingleColumnLayoutViewObj);
        Project.Models.UserRegisterObj = new Project.Classes.Models.UserRegister;
        Project.Views.UserRegisterObj = new Project.Classes.Views.UserRegister({model: Project.Models.UserRegisterObj});
        SingleColumnLayoutViewObj.content.show(Project.Views.UserRegisterObj);
        document.title = options.title + 'Регистрация';
      });
    }
    else{
        alert('userin');
    }
        },
        
        onStop: function(){
            delete Project.Registration
        }
    });
});