require(['modernizr'], function(){

// Проверяем браузер и поддержку кук
//navigator.cookieEnabled

require([
    
  'text',
  'jquery',
  'underscore',
  'backbone',
  'backbonewreqr',
  'backbonebabysitter',
  'marionette',
  'datef',
  'datef_ru',
], function(text, $, _, Backbone, backbonewreqr, backbonebabysitter, marionette, datef){
  datef.lang('ru');
  window.datef = datef;
  window.Project = new Marionette.Application();
  Project.Classes = {Models: {}, Collections: {}, Views: {}, Layouts: {}, Controllers: {}, Modules: {}};
  Project.Objects = {Models: {}, Collections: {}, Views: {}, Layouts: {}, Controllers: {}, Modules: {}};
  Project.Models = {};
  Project.Collections = {};
  Project.Views = {};
  Project.Layouts = {};
  Project.Controllers = {};
  Project.Helpers = {};
  Project.Temporary = {};
  Project.Templates = {};
  Project.TemplateHelper = (function(html, id){
               var r;   
               $(html).each(function(){
               if($(this).attr("id") == id){r = this}});
               return $(r).html();
               });
  
  Project.RenderTasksGet = {};
  Project.RenderTasksSet = (function(tasks){
    
    var values = [];
    for(i=0;i<tasks.length;i++){
      values[i] = true;
    }
    
    Project.RenderTasksGet = _.object(tasks, values);
    
  });
  Project.RenderStatusGet = {};
  Project.RenderStatusSet = (function(task){
    
    Project.RenderStatusGet[task] = true;
    if(_.isEqual(Project.RenderTasksGet, Project.RenderStatusGet)){
      Project.RenderTasksGet = {};
      Project.RenderStatusGet = {};
      console.log('Tasks complete!');
      $('#lwr').hide();
      $('#mwr').show();
      Project.Router.on('route', function(){$('#mwr').hide();});
    } 
    
  });
  
  window.link = (function(url){
    Project.Router.navigate(url, {trigger: true} );
    return false;
  });
  
  Project.MWR = new Marionette.Region({el: "#mwr"});
  
  Project.on('start', function(){
    
    if(Backbone.history){
        Backbone.history.start({pushState: true});
    }
  });
Project.Helpers.Cookie = {
        
        getCookie: function(check_name){
            // first we'll split this cookie up into name/value pairs
  // note: document.cookie only returns name=value, not the other components
  var a_all_cookies = document.cookie.split( ';' );
  var a_temp_cookie = '';
  var cookie_name = '';
  var cookie_value = '';
  var b_cookie_found = false; // set boolean t/f default f

  for ( i = 0; i < a_all_cookies.length; i++ )
  {
    // now we'll split apart each name=value pair
    a_temp_cookie = a_all_cookies[i].split( '=' );


    // and trim left/right whitespace while we're at it
    cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

    // if the extracted name matches passed check_name
    if ( cookie_name == check_name )
    {
      b_cookie_found = true;
      // we need to handle case where cookie has no value but exists (no = sign, that is):
      if ( a_temp_cookie.length > 1 )
      {
        cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
      }
      // note that in cases where cookie is initialized but no value, null is returned
      return cookie_value;
      break;
    }
    a_temp_cookie = null;
    cookie_name = '';
  }
  if ( !b_cookie_found )
  {
    return null;
  }
        },
        
        setCookie: function(name, value, expires, path, domain, secure){
            // set time, it's in milliseconds
var today = new Date();
today.setTime( today.getTime() );

/*
if the expires variable is set, make the correct
expires time, the current script below will set
it for x number of days, to make it for hours,
delete * 24, for minutes, delete * 60 * 24
*/
if ( expires )
{
expires = expires * 1000 * 60 * 60 * 24;
}
var expires_date = new Date( today.getTime() + (expires) );

document.cookie = name + "=" +escape( value ) +
( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
( ( path ) ? ";path=" + path : "" ) +
( ( domain ) ? ";domain=" + domain : "" ) +
( ( secure ) ? ";secure" : "" );
        },
        
        deleteCookie: function(name, path, domain){
            if ( this.getCookie(name) ) document.cookie = name + "=" +
( ( path ) ? ";path=" + path : "") +
( ( domain ) ? ";domain=" + domain : "" ) +
";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
        
    }
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
    require(['./project/Modules/Login/Start'], function(){
      Project.module('Login', Project.Classes.Modules.Login.Start).start({title: title});
    });
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
    require(['./project/Modules/Registration/Start'], function(){
      Project.module('Registration', Project.Classes.Modules.Registration.Start).start({title: title});
    });
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
var invertroutes = _.invert(routes);
invertroutes[''] = "index";
Project.Router = new Marionette.AppRouter({
controller: Project.Controllers.MainControllerObj,
appRoutes: invertroutes
});
Project.Models.UserObj = new Project.Classes.Models.User;
    Project.Models.UserObj.fetch().then(function(){
      Project.start();
    });
  
});
});