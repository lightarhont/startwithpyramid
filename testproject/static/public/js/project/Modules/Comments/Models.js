   define(function(){
   
   //cm - Классы модуля
   var cm = Project.Classes.Modules.Comments;
   //Объекты модуля
   var om = (function(){ return Project.Comments;});
   
   cm.SettingsModel = Backbone.Model.extend({
    
    initialize: function(){
        this.getuser();
        this.listenTo(Project.Models.UserObj, "change", this.getuser);
    },
    
    getuser: function(){
        var u = Project.Models.UserObj;
        var ps = u.get('permissions');
        var permcomments = 0;
        if (ps.indexOf(1) < 0 || ps.indexOf(4) < 0) {permcomments = 0;}else {permcomments = 1;}
        this.set('permcomments', permcomments);
        this.set('userid', u.get('userid'));
        this.set('username', u.get('username'));
    },
    
    defaults: {
        userid: 0,
        username: 'guest',
        permcomments: 0,
        thread: '',
        threadid: 0,
        threadtitle: '',
        totalcomments: 0,
        timestamp: 0,
        premoderation: 0,
        realtimepermvalidate: 0,
        dateformat: 'YYYY-MM-dd HH:mm:ss',
        contentlimit: 5000,
        fadecomment: 2500,
        addcommenttimelimit: 3000,
    }
    
   });
   
   cm.CountCommentsModel = Backbone.Model.extend({
    
        thread: '',
        threadid: '',
        
        test: 'test',
        
        initialize: function(){
            var s = om().SettingsModelObj;
            this.thread = s.get('thread');
            this.threadid = s.get('threadid');
            this.set('totalcomments', s.get('totalcomments'))
        },
        
        defaults: {
            totalcomments: 0
        },
    
        urlRoot: function() {
            return pfx+'comments/countcomments/'+ this.thread + '/' + this.threadid
            }
    });
   
   cm.CommentModel = Backbone.Model.extend({
    
    defaults: function (){
        var s = om().SettingsModelObj;
        return {
        userid: (function(){
            return s.get('userid');
        })(),
        username: (function(){
            return s.get('username');
        })(),
        thread: (function(){
            return s.get('thread');
        })(),
        threadid: (function(){
            return s.get('threadid');
        })(),
        threadtitle: (function(){
            return s.get('threadtitle');
        })(),
        title: '',
        content: '',
        created: 0,
        last_edited: 0
    }
    },
    
    validate: function(attrs){
        if (attrs.content.length < 2) {return 'Содержимое не должно быть короче 2 символов!';}
        if (attrs.title.length > 64) {return 'Тема не должна быть длинее 64 символа';}
    },
    
    saveexclude: function(attrs, options) {
        options || (options = {});
        attrs || (attrs = _.clone(this.attributes));

        // Filter the data to send to the server
        delete attrs.itemid;
        delete attrs.username;
        delete attrs.fcreated;
        
        options.data = JSON.stringify(attrs);
        
        // Proxy the call to the original save function
        Backbone.Model.prototype.save.call(this, attrs, options);
    },
    
    urlRoot:  function() {
        return pfx+'comments/comment';
    }
   });
   
   return Project;

});