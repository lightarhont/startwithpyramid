
var rendercommentform = 0;
var dateformat = 'YYYY-MM-dd HH:mm:ss';
var contentlimit = 5000;
var fadecomment = 2500;
var commentdtomsg = 400;
var addcommenttimelimit = 3000;
var permtimevalidation = 100000000;

//Свой счётчик времени
//(function(){timestamp = timestamp+1; setTimeout(arguments.callee, 1000);})();
setInterval(function(){timestamp = timestamp+1;}, 1000);

var permvalidation = (function(){
    
    }); 

var permtimervalidate = (function(){
 setTimeout(arguments.callee, permtimevalidation);
 permvalidation();
 });

if (realtimepermvalidate == 1) {
    permtimervalidate();
}

var UserModel = Backbone.Model.extend({
    
    defaults: {
        userid: 0,
        username: 'guest',
        permissions: []
    },
    
    urlRoot: '/comments/restuser'
    
});

var UserModelObj = new UserModel();

var UserController = Backbone.View.extend({
    
    initialize: function(){},
    
    autofetchtimestamp: 60000,
    
    autofetch: function(){
        var self = this;
        setInterval(function(){
            self.model.fetch();
        }, self.autofetchtimestamp);
    },
    
    });

var UserControllerObj = new UserController({model: UserModelObj});

var CommentsOn = (function(){
    this.model.on('change', function(){
        if (this.model.get('userid') != 0) {
            var ps1 = this.model.get('permissions').indexOf(1);
            var ps2 = this.model.get('permissions').indexOf(4);
            if (ps1 < 0 || ps2 < 0) {
                this.trigger('nopermission');    
            }
            else {
                this.trigger('haspermission');
            }
        }
        else {
            this.trigger('nouser');
        }
    }, this);
});

UserControllerObj.CommentsOn = _.bind(CommentsOn, UserControllerObj);
UserControllerObj.CommentsOn();
UserControllerObj.autofetch();

var CommentModel = Backbone.Model.extend({
    
    defaults: {
        itemid: 1,
        userid: 1,
        username: 'admin',
        thread: 'blog',
        threadid: 1,
        threadtitle: 'Заголовок',
        title: 'Заголовок комменатрия',
        content: 'Комментарий 2 ещё правка!',
        created: 0,
        last_edited: 0
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
    
    urlRoot: '/comments/restcomment'
    
});

var CommentsCollection = Backbone.Collection.extend({model: CommentModel, url: '/comments/restcomments',
    
    
    
    });

var CommentForm = Backbone.View.extend({
    
    tagName: 'div',
    
    close: function(){
        this.stopListening();
    },
    
    initialize: function(){
      var self = this;
      this.listenToOnce(UserControllerObj, 'nouser', function(){self.NoPermission(self, 'nouser');});
      this.listenToOnce(UserControllerObj, 'nopermission', function(){self.NoPermission(self, 'nopermission');})
      if (permcomments == 1) {
      if(rendercommentform == 1) {
        
        if(_.has(this, 'model')){
          this.listenTo(CommentsViewObj.cvo[this.model.cid], 'commentremove',
                        function(){
                            CommentFormObj.stopListening();
                            window.CommentFormObj = new CommentForm({collection: CommentsCollectionObj});
                        });  
          console.log('Загружена модель комментария');
          var editbuttons = $('#editbuttons').html();
          $('.submit-button').html(editbuttons);
          $('#adcomment legend').html('Редактировать комментарий');
          $('.titlecomment input').val(this.model.attributes.title);
          $("#wbbeditor").htmlcode(this.model.attributes.content);
          $("#wbbeditor").bbcode(this.model.attributes.content);
          
          this.EditComment();
          this.CancelEditComment();
        }
        else{
          
          console.log('Загружена пустая модель');
          var addbuttons = $('#addbuttons').html();
          $('.submit-button').html(addbuttons);
          $('#adcomment legend').html('Новый комментарий');
          $('.titlecomment input').val('');
          $("#wbbeditor").htmlcode('');
          $("#wbbeditor").bbcode('');
          
          this.AddComment(self);  
        }
      }
      else{
        this.render();
        rendercommentform = 1;
        this.AddComment(self);
        
      }
      }
    },
    
    EditComment: function(){
        
        use = this.model
        
        var Edit = (function() {
        var sb = $('.submit-button > .edit > a')
        sb.click(function(){
            var title = $('.titlecomment input').val();
            var content = $('#wbbeditor').getBBCode();
            if(content.length >= contentlimit) {
                content = content.slice(0, contentlimit) + '...';
            }
            use.set('title', title);
            use.set('content', content);
            
            use.set('last_edited', timestamp);
            use.saveexclude(use.toJSON(), {
                wait: true,
                success: function(model, response){
                        if (response['result'] == 1) {
                            model.set('content', response['content']);
                            console.log('Комментарий успешно изменён!');
                            sb.addClass('disabled');
                            sb.unbind('click');
                            setTimeout(function(){
                                Edit();
                                sb.removeClass('disabled');
                            }, addcommenttimelimit);
                        }
                        else
                        {
                            console.log('2: При изменении возникла какая-то ошибка!');
                        }
                    },
                error: function(){
                        console.log('1: При изменении возникла какая-то ошибка!');
                    }
                });
        });
        });
        
        Edit();
        
    },
    
    CancelEditComment: function (){
        var self = this;
        $('.submit-button > .cancel > a').click(function(){
            //self.stopListening();
            var CommentFormObj = new CommentForm({collection: CommentsCollectionObj});
        });
    },
    
    AddComment: function(self){
         //console.log(self);
        var addNew = (function() {
        
        var use = new CommentModel(blankmodeldata);
        var sb = $('.submit-button > a');
       
        sb.click({self:self}, function(e){
            var self = e.data.self;
            //console.log(self);
            var title = $('.titlecomment input').val();
            var content = $('#wbbeditor').getBBCode();
            if(content.length >= contentlimit) {
                content = content.slice(0, contentlimit) + '...';
                console.log('Текст обрезан т.к. превышен лимит!');
            }
            use.set('title', title);
            use.set('content', content);
            
            use.set('created', timestamp);
            savedata = use.toJSON();
            if (premoderation == 0) {
                use.saveexclude(savedata, {
                    wait: true,
                    success: function(model, response){
                            model.set('id', response['id']);
                            model.set('content', response['content']);
                            //console.log({my: CommentFormObj})
                            CommentFormObj.trigger('addcomment', model)
                            //CommentsCollectionObj.add(model);
                            sb.addClass('disabled');
                            sb.unbind('click');
                            setTimeout(function(){
                                addNew(self);
                                sb.removeClass('disabled');
                            }, addcommenttimelimit);
                            console.log('Комментарий успешно добавлен!');
                        },
                    error: function(){
                            console.log('При добавлении возникла какая-то ошибка!');
                        }
                    });
            }
            else {
                savedata['published'] = 0;
                use.saveexclude(savedata, {
                    wait: true,
                    success: function(model, response){
                            sb.addClass('disabled');
                            sb.unbind('click');
                            setTimeout(function(){
                                addNew(self);
                                sb.removeClass('disabled');
                            }, addcommenttimelimit);
                            console.log('Комментарий успешно добавлен!');
                        },
                    error: function(){
                            console.log('При добавлении возникла какая-то ошибка!');
                        }
                    });
            }
            
            
        });
        });
        
        addNew(self);
    },
    
    render: function(){
            
            $('.adcommentform').html($('#commentform').html());
            $('#wbbeditor').wysibb({
                //Список настроек
                buttons: 'bold,italic,underline,strike,fontcolor,sup,sub,|,justifyleft,bullist,|,img,link,video,|,quote,removeFormat'
                });
            
            return this;
        },
    
    NoPermission: function(self, status){
        console.log(status);
        rendercommentform = 0;
        permcomments = 0;
        $('#wbbeditor').destroy();
        $('.adcommentform').empty();
        self.listenToOnce(UserControllerObj, 'haspermission', function(){self.HasPermission(self, 'haspermission');})
    },
    
    HasPermission: function(self, status){
        console.log(status);
        permcomments = 1;
        window.CommentFormObj = new CommentForm({collection: CommentsCollectionObj});
    }
    
    });

var ComentView = Backbone.View.extend({
    
    tagName: 'div',
    
    className: "row panel radius comment",
    
    template: _.template($('#mytest').html()),
    
    templatecommentquote: _.template($('#quotecomment').html()),
    
    initialize: function(){ 
        this.render();
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'sync', this.rerender);
    },
    
    render: function(){
        params = this.middlerender();
        this.$el.html(this.template(params));
        return this;
        
    },
    
    rerender: function(){
        params = this.middlerender();
        var cv = this;
        this.$el.fadeOut(fadecomment, function(){
            cv.$el.html(cv.template(params));
            cv.$el.fadeIn(fadecomment);
        });
        return this;
    },
    
    middlerender: function(){
        
        var params = this.model.toJSON();
        //Date format
        var date = new Date();
        
        date.setTime(params['created']*1000);
        params['fcreated'] = datef(dateformat,date);
        this.model.set('fcreated', params['fcreated']);
        
        if(params['last_edited'] != 0 && params['last_edited'] != null){
            date.setTime(params['last_edited']*1000);
            params['flast_edited'] = datef(dateformat,date);
            this.model.set('flast_edited', params['flast_edited']);
        }
        else {
            params['flast_edited'] = false;
            this.model.set('flast_edited', false);
        }
        
        params['permcomments'] = permcomments;
        if(userid == this.model.attributes.userid){
            params['permwrite'] = 1;
        }
        else {
            params['permwrite'] = 0;
        }
        
        return params;
        
    },
    
    events: function(){
        var events = {};
        if (permcomments == 1) {
            events['click .option1'] = 'QuoteComment';
            if(userid == this.model.attributes.userid){
                events['click .option2'] = 'EditComment';
                events['click .option3'] = 'DeleteComment';
            }
        }
        return events;
    },
    
    QuoteComment: function(){
        var params = this.model.toJSON();
        $('#wbbeditor').execCommand('quote',{seltext: this.templatecommentquote(params)});
    },
    
    EditComment: function(){
        //CommentFormObj.close();
        
        var CommentFormObj = new CommentForm({model: this.model});
    },
    
    DeleteComment: function(){
        var self = this;
        var cvdefhtml = self.$el.html();
        $(self.$el).find('.option1').remove();
        $(self.$el).find('.option2').remove();
        $(self.$el).find('.option3').remove();
        var model = this.model;
        setTimeout(function(){
            $(self.$el).find('.info').append($('#deleteyn').html());
        
            $(self.$el).find('.deletecommentyny').click(function(){
                $(self.$el).fadeOut(fadecomment, function(){
                    model.destroy({
                        wait: true,
                        success: function(model, response){
                            self.trigger('commentremove', model); 
                            console.log('Комментарий успешно удалён!');
                            },
                        error: function(){
                            console.log('При удалении комментария возникла какая-то ошибка!');
                            $(self.$el).html(cvdefhtml);
                            $(self.$el).fadeIn(fadecomment);
                        }
                    });
                });
            });
            $(self.$el).find('.deletecommentynn').click(function(){
                $(self.$el).fadeOut(fadecomment, function(){
                    $(self.$el).html(cvdefhtml);
                    $(self.$el).fadeIn(fadecomment);
                });
            });
        }, commentdtomsg);
    }
    
    });

var CommentsView = Backbone.View.extend({
    
    tagName: 'div',
    
    className: 'row',
    
    cvo: {},
    
    initialize: function(){
        var self = this;
        this.collection.on('remove', this.deletecomment, this);
        if (premoderation == 0){
        this.listenTo(CommentFormObj, 'addcomment', function(model){alert('Триггер'); self.addcomment(self, model);})
        }
        //this.collection.on('add', this.addcomment, this);
    },
    
    renderasc: function(){
        this.collection.comparator = function(CommentObj) { return -Number(CommentObj.get("id")); }
        this.collection.sort();
        
        this.render();
        this.reindex();
        return this;
    },
    
    renderdesc: function(){
        this.collection.comparator = function(CommentObj) { return Number(CommentObj.get("id")); }
        this.collection.sort();
        
        this.render();
        this.reindex();
        return this;
    },
    
    render: function(){
        var self = this;
        this.listenToOnce(UserControllerObj, 'nouser', function(){self.NoPermission(self, 'nouser');});
        this.listenToOnce(UserControllerObj, 'nopermission', function(){self.NoPermission(self, 'nopermission');})
        
        this.$el.empty().append(this.el);
        this.$el.detach();

        for(i=0; i<this.collection.length; i++) {
            this.collection.models[i].set('itemid', i+1);
            var c = new ComentView({model: this.collection.models[i]});
            this.cvo[this.collection.models[i].cid] = c
            this.$el.append(c.el); 
        }
        return this;
    },
    
    NoPermission: function(self, status){
        console.log(status);
        permcomments = 0;
        $('#allcomments').html(self.render().$el);
        self.listenToOnce(UserControllerObj, 'haspermission', function(){self.HasPermission(self, 'haspermission');})
    },
    
    HasPermission: function(self, status){
        console.log(status);
        permcomments = 1;
        $('#allcomments').html(self.render().$el);
    },
    
    reindex: function(s=1){
        $('.comment .itemid a').each(function(i){
            var newindex = i+s;
            $(this).html('#'+newindex)
        });
    },
    
    deletecomment: function(task){
        
        var self = this;
        
        var totalcommentsbefore = CountCommentsObj.get('totalcomments');
        
        CountCommentsObj.fetch().then(function(){
        
            var totalcommentsafter = CountCommentsObj.get('totalcomments');
            
            if (Number(totalcommentsbefore) - 1 == (Number(totalcommentsafter))) {
            
                delete self.cvo[task.cid];
                self.reindex();
            
            }
            else {
                console.log('rerender cooments!');
                CommentsCollectionObj.fetch({data: {sortorder: CommentsPanelObj.sortparam}, reset: true}).then(function(){
                    $('#allcomments').html(self.render().$el);
                    self.$el.fadeOut(100).fadeIn(fadecomment);
                });
            }
            
            CommentsPanelObj.shcts.html(CommentsPanelObj.Helper_shcst());
            
        });
    },
    
    addcomment: function(self, model){
        
        var totalcommentsbefore = CountCommentsObj.get('totalcomments');
        
        CountCommentsObj.fetch().then(function(){
            
            var totalcommentsafter = CountCommentsObj.get('totalcomments');
            
            if (Number(totalcommentsbefore) + 1 == (Number(totalcommentsafter))) {
                self.collection.add(model);
                itemid = self.collection.length
                if (CommentsPanelObj.sortparam == 'asc') {
                    model.set('itemid', itemid)
                }
                else {
                    self.reindex(2);
                }
                var c = self.cvo[model.cid] = new ComentView({model: model});
                if (CommentsPanelObj.sortparam == 'asc') {
                    self.$el.append(c.el);
                }
                else
                {
                    self.$el.prepend(c.el);
                }
                c.$el.fadeOut(100).fadeIn(fadecomment);
        
            }
            else {
                console.log('rerender cooments!');
                CommentsCollectionObj.fetch({data: {sortorder: CommentsPanelObj.sortparam}, reset: true}).then(function(){
                    $('#allcomments').html(self.render().$el);
                    self.$el.fadeOut(100).fadeIn(fadecomment);
                });
            }
            
            CommentsPanelObj.shcts.html(CommentsPanelObj.Helper_shcst());
            
        });
    }
    
    });

var CommentsCollectionObj = new CommentsCollection();

var blankmodeldata = {
        userid: userid,
        username: username,
        thread: thread,
        threadid: threadid,
        threadtitle: threadtitle,
        title: '',
        content: '',
        created: 0,
        last_edited: 0
    }

var CommentFormObj = new CommentForm({collection: CommentsCollectionObj});

var CommentsViewObj = new CommentsView({collection: CommentsCollectionObj});


var CountComments = Backbone.Model.extend({
    
    defaults: {
        totalcomments: 0
    },
    
    urlRoot: '/comments/countrestcomments/'+ thread + '/' + threadid
});

var CountCommentsObj = new CountComments();

var CommentsPanel = Backbone.View.extend({
    
    //Элемент для комменатриев
    el: '.showhidecomments',
    
    //Блок для вставки комменатриев
    allcts: $('#allcomments'),
    
    //Статус
    sts: 0,
    
    //Сортировка
    sortparam: 'asc',
    
    //Хелпер показать/скрыть комментарии
    Helper_shcst: function(sts=2, title = ''){
        if (sts != 2) {
            this.sts = sts;
        }
        if(this.sts == 0)
        {
            title = 'Скрыть комменатрии'
        }
        else
        {
            title = 'Показать комменатрии'
        }
        return title + ': '+this.model.get('totalcomments');
    },
    
    Helper_ascdesc: function(self, pic, event){
        self.$el.append('<div style="width: 100px;" class="panel radius sort columns">'+pic+'</div>');
        self.shctssort = self.$el.find('.sort');
        self.shctssort.on('click', {self: self}, event);
    },
    
    initialize: function(){
        var self = this;
        self.model.fetch().then(function(){
            self.shcts = self.$el.find('.showhide');
            self.shcts.html(self.Helper_shcst(1));
            self.shcts.on('click', {self: self}, self.Event_shcsopen);
        });
    },
    
    //Событие открывающее комменатрии
    Event_shcsopen: function(event){
        var self = event.data.self;
        self.model.fetch().then(function(){
            CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.unbind('click');
                self.shcts.on('click', {self: self}, self.Event_shcsclose);
                self.allcts.html(CommentsViewObj.render().$el);
                self.shcts.html(self.Helper_shcst(0));
                self.shcts.css('width', '500px');
                self.shcts.addClass('columns');
                if (self.sortparam == 'asc') {
                    self.Helper_ascdesc(self, '=>', self.Event_shcsdesc);
                }
                else {
                    self.Helper_ascdesc(self, '<=', self.Event_shcsasc);
                }
                self.trigger('commentsopen'); 
            });
        });
    },
    
    //Событие скрывающее комменатрии
    Event_shcsclose: function(event){
        var self = event.data.self;
        self.model.fetch().then(function(){
            self.shcts.unbind('click');
            self.shcts.on('click', {self: self}, self.Event_shcsopen);
            self.shcts.html(self.Helper_shcst(1));
            self.shcts.css('width', '616px');
            self.shcts.removeClass('columns');
            self.$el.find('.sort').remove();
            self.allcts.html('');
            self.trigger('commentsclose'); 
        });
    },
    
    //Событие сортировки asc
    Event_shcsasc: function(event){
        var self = event.data.self;
        self.shctssort.unbind('click');
        self.sortparam = 'asc';
        $(this).html('=>');
        self.model.fetch().then(function(){
            CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.html(self.Helper_shcst(0));
                self.allcts.html(CommentsViewObj.render().$el);
                setTimeout(function(){
                    self.shctssort.on('click', {self: self}, self.Event_shcsdesc);
                    }, 3000);
                self.trigger('commentssortasc');
            });
        });
    },
    
    //Событие сортировки desc
    Event_shcsdesc: function(event){
        var self = event.data.self;
        self.shctssort.unbind('click');
        self.sortparam = 'desc';
        $(this).html('<=');
        self.model.fetch().then(function(){
            CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.html(self.Helper_shcst(0));
                self.allcts.html(CommentsViewObj.render().$el);
                setTimeout(function(){
                    self.shctssort.on('click', {self: self}, self.Event_shcsasc);
                    }, 3000);
                self.trigger('commentssortdesc');
            });
        });
    }
    
});

var CommentsPanelObj = new CommentsPanel({ model: CountCommentsObj });
