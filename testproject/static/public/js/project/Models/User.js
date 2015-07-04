define(function(){

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

    return Project;

});

Project.Classes.Models.UserActivation = Backbone.Model.extend({
    
    defaults: {
        ticket: ''
    },
    
    validate: function(attrs){
        if (attrs.ticket.length != 16) {return 'Строка не равна в 16 символов!'}
        var re = new RegExp("^[a-zA-Z0-9]+$");
        if (!re.test(attrs.ticket)) {return 'Строка не соответствует регулярному выражению!'}
    },
    
    urlRoot: function(){
        return pfx+'user/activation';
    }
    
});

Project.Classes.Models.Passwordchange = Backbone.Model.extend({
    
    defaults: {
        oldpassword: '',
        password: '',
        confirmpassword: ''
    },
    
    validate: function(attrs){
        if (attrs.password.length < 6) {return {'password': 'Пароль не должен быть короче 6 символов!'};}
        re = new RegExp("^[a-zA-Z0-9]+$");
        if (!re.test(attrs.password)) {return {'password': 'Пароль должен содержать cтрочные и прописные латинские буквы, цифры!'};}
        if (attrs.password != attrs.confirmpassword) {return {'password': 'Пароли не совпадают!'};}
    },
    
    urlRoot: function(){
        return pfx+'profile/password';
    },
    
});

Project.Classes.Models.Profile = Backbone.Model.extend({
    
    defaults: function(){
        return {
            id: (function(){
                return Project.Models.UserObj.get('userid');    
            })(),
            fullname: ''
        }
    },
    
    urlRoot: function(){
        return pfx+'profile/profile';
    },
    
});
