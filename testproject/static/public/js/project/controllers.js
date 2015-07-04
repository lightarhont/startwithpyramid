 define(function(){
 
 var title = document.title;
 
 var MainController = Marionette.Controller.extend({
  index: function() {
    this.blogs();
  },
  blogs: function() {
    require(['./project/Modules/Blogs/Start'], function(){
      Project.module('Blogs', Project.Classes.Modules.Blogs.Start).start({title: title});
    });
  },
  blogstag: function(tag) {
    require(['./project/Modules/Blogs/Start'], function(){
      Project.module('Blogs', Project.Classes.Modules.Blogs.Start).start({title: title, tag: tag});
    });
  },
  blog: function(slug) {
    require(['./project/Modules/Blog/Start'], function(){
      Project.module('Blog', Project.Classes.Modules.Blog.Start).start({title: title, slug: slug});
    });
    },
  login: function() {
      if (Project.Models.UserObj.get('userid') === 0) {
        require(['./project/layouts', './project/Views/Auth',
                 'text!../templates/singlecolumnshema.html',
                 'text!../templates/userlogin.html',], function(app, p1, singlecolumnshema, userlogin){
          
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
  logout: function(){
    if (Project.Models.UserObj.get('userid') != 0) {
      Project.Helpers.Cookie.deleteCookie('auth_tkt', '/');
      Project.Helpers.Cookie.deleteCookie('auth_tkt', '/', location.hostname);
      Project.Helpers.Cookie.deleteCookie('auth_tkt', '/', '.'+location.hostname);
      Project.Models.UserObj.fetch().then(function(){
        link('/');
      });
    }
    else{
      alert('userout');
    }
  },
  registration: function(){
    if (Project.Models.UserObj.get('userid') === 0) {
      require(['./project/layouts', './project/Views/Register',
               'text!../templates/singlecolumnshema.html',
               'text!../templates/userregistration.html'], function(app, p1, singlecolumnshema, userregistration){
        
        //Список задач
        Project.RenderTasksSet(['registerform', 'userpanel']);
        
        Project.Templates.Singlecolumnshema = singlecolumnshema;
        Project.Templates.Register = userregistration;
        var SingleColumnLayoutViewObj = new Project.Layouts.SingleColumnLayoutView;
        Project.MWR.show(SingleColumnLayoutViewObj);
        Project.Models.UserRegisterObj = new Project.Classes.Models.UserRegister;
        Project.Views.UserRegisterObj = new Project.Classes.Views.UserRegister({model: Project.Models.UserRegisterObj});
        SingleColumnLayoutViewObj.content.show(Project.Views.UserRegisterObj);
        document.title = title + 'Регистрация';
      });
    }
    else{
        alert('userin');
    }
  },
  useractivation: function(ticket){
    if (Project.Models.UserObj.get('userid') === 0) {
      Project.Models.UserActivationObj = new Project.Classes.Models.UserActivation({ticket: ticket});
      Project.Models.UserActivationObj.save({}, {
          success: function(model, response){
            if (response['useractivation'] === true) {
              alert('Пользователь успешно активирован!');
              link('/');
            } else {
              alert('Не удалось активировать пользователя!');
              link('/');
            }
          }
        });
    }
    else {
        alert('userin');
    }
  },
  rememberpassword: function(){
    if (Project.Models.UserObj.get('userid') === 0) {
      
    }
    else{
        alert('userin');
    }
  },
  userprofile: function(param){
    if (Project.Models.UserObj.get('userid') === 0) {
        alert('userout');
    }
    else{
        require(['./project/layouts', './project/Views/Profile',
                 'text!../templates/singlecolumn2shema.html',
                 'text!../templates/profileshema.html',
                 'text!../templates/profile.html'], function(app, p1, singlecolumn2shema, profileshema, profile){
          Project.Templates.Singlecolumn2shema = singlecolumn2shema;
          Project.Templates.Profileshema = profileshema;
          Project.Templates.Profile = profile;
          var SingleColumnLayoutViewObj = new Project.Layouts.SingleColumnLayoutView2;
          Project.MWR.show(SingleColumnLayoutViewObj);
          var ProfileObj = new Project.Layouts.Profile;
          SingleColumnLayoutViewObj.content.show(ProfileObj);
          $('.profilemenu li').each(function(){
            if($(this).hasClass('act'+param)){
             $(this).addClass("selectedact");
            }
          })
          var titlepart = 'Редактировать профиль::';
          switch(param) {
            
            case 'profile':
            
            //Список задач
            Project.RenderTasksSet(['userprofile', 'userpanel']);
            
            Project.Models.ProfileObj = new Project.Classes.Models.Profile;
            Project.Models.ProfileObj.fetch().then(function(){
              ProfileObj.main.show(new Project.Classes.Views.UserProfileMain({model: Project.Models.ProfileObj}));
              document.title = title + titlepart + 'Данные';
            });
            break
          
            case 'password':
            
            //Список задач
            Project.RenderTasksSet(['userpassword', 'userpanel']);
            
            Project.Models.PasswordchangeObj = new Project.Classes.Models.Passwordchange;  
            ProfileObj.main.show(new Project.Classes.Views.UserProfilePassword({model: Project.Models.PasswordchangeObj}));
            document.title = title + titlepart + 'Пароль';
            break
            
            case 'avatar':
            
            //Список задач
            Project.RenderTasksSet(['useravatar', 'userpanel']);
            
            require(['../lib/bower_components/colorbox/jquery.colorbox',], function(){
              
              ProfileObj.main.show(new Project.Classes.Views.UserProfileAvatar);
              document.title = title + titlepart + 'Аватар';
              
            });
            break
            
            default:
            console.log(param)
            break
          }
          
        });
    }
  }
  });
 
  Project.Controllers.MainControllerObj = new MainController();
  
  return Project;

});