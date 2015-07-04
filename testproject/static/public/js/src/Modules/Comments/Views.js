define(function(){

//Хелперы
//cm - Классы модуля
var cm = Project.Classes.Modules.Comments;
//Объекты модуля
var om = (function(){ return Project.Comments;});
var s = (function(){ return om().SettingsModelObj;});

var cgtotalcts = (function(func){
    var func = arguments[0] === undefined ? false : arguments[0];
    var cc = om().CommentsPanelViewObj;
    om().CountCommentsModelObj.fetch().then(function(){
        if(func)func();
        cc.shcts.html(cc.Helper_shcst());
    });
})

cm.CommentFormView = Marionette.ItemView.extend({
    
    tagName: 'div',

    template: false,
    
    setHelper: function(data){
        if (data[0]) {
            $('.submit-button').html(data[0]);
        }
        if (data[1]) {
            $('#adcomment legend').html(data[1]);
        }
        $('.titlecomment input').val(data[2]);
        $("#wbbeditor").htmlcode(data[3]);
        $("#wbbeditor").bbcode(data[3]);
    },
    
    getDataHelper: function(){
      var title = $('.titlecomment input').val();
      var content = $('#wbbeditor').getBBCode();
      if(content.length >= s().get('contentlimit')) {
        content = content.slice(0, s().get('contentlimit')) + '...';
            console.log('Текст обрезан т.к. превышен лимит!');
        }
        this.model.set('title', title);
        this.model.set('content', content);
    },
    
    initialize: function(){
        var self = this;
        self.listenTo(s(), 'change:permcomments', function(){
            if(s().get('permcomments') === 1) {
                om().AddCommentForm.show(new cm.CommentFormView({collection: om().CommentsCollectionObj}))
            } else {
                om().AddCommentForm.empty();
            }
        });
        this.opencomments = false;
        self.listenTo(om().AllComments, 'show', function(view, region, options){
            self.listenTo(Project.vent, 'editcomment', self.setEdit);
            self.opencomments = true;
        });
        self.listenTo(om().AllComments, 'empty', function(view, region, options){
            self.listenTo(Project.vent, 'editcomment');
            self.opencomments = false;
        });
    },
    
    onShow: function(){
        this.model = new cm.CommentModel;
        data = {premoderation: s().get('premoderation'),
                contentlimit: s().get('contentlimit'),
                addcommenttimelimit: s().get('addcommenttimelimit')/1000}
        var tpl = _.template(Project.TemplateHelper(om().Templates, 'commentform'))(data);
        this.$el.html(tpl);
        $('#wbbeditor').wysibb({
        //Список настроек
        buttons: 'bold,italic,underline,strike,fontcolor,sup,sub,|,justifyleft,bullist,|,img,link,video,|,quote,removeFormat'});
    },
    
    events: {
        'click .submit-button > a' : 'Add'
    },
    
    eventsEdit: {
        'click .submit-button > .edit > a'   : 'Edit',
        'click .submit-button > .cancel > a' : 'setAdd',
    },
    
    setEdit: function(model){
        this.undelegateEvents();
        var editbuttons = Project.TemplateHelper(om().Templates, 'editbuttons');
        this.setHelper([editbuttons, 'Редактировать комментарий', model.attributes.title, model.attributes.content]);
        this.delegateEvents(this.eventsEdit);
        this.model = model;
        this.listenTo(this.model, 'destroy', this.setAdd);
    },
    
    setAdd: function(){
        this.undelegateEvents();
        var addbuttons = Project.TemplateHelper(om().Templates, 'addbuttons');
        this.setHelper([addbuttons, 'Новый комментарий', '' , '']);
        this.delegateEvents(this.events);
        this.model = new cm.CommentModel;
    },
    
    Add: function(){
        var sb = $((_.keys(this.events)[0]).slice(6));
        var self = this;
        this.getDataHelper();
        savedata = this.model.toJSON();
        if (s().get('premoderation') === 0) {
            this.model.saveexclude(savedata, {
                    wait: true,
                    success: function(model, response){
                        self.setHelper([false, false, '' , '']);
                        self.undelegateEvents();
                        model.set('id', response['id']);
                        model.set('content', response['content']);
                        model.set('created', response['created']);
                        model.set('avatar', response['avatar']);
                        model.set('itemid', self.collection.length+1)
                        self.collection.add(model);
                        if (!self.opencomments) {
                            cgtotalcts();
                        }
                        self.model = new cm.CommentModel;
                        sb.addClass('disabled');
                            setTimeout(function(){
                                self.delegateEvents(self.events);
                                sb.removeClass('disabled');
                            }, s().get('addcommenttimelimit'));
                            console.log('Комментарий успешно добавлен!');
                        
                    },
                    error: function(){
                            console.log('При добавлении возникла какая-то ошибка!');
                    }
                });
        }
        else{
            savedata['published'] = 0;
            this.model.saveexclude(savedata, {
                    wait: true,
                    success: function(model, response){
                        self.setHelper([false, false, '' , '']);
                        self.undelegateEvents();
                        self.model = new cm.CommentModel;
                        sb.addClass('disabled');
                            setTimeout(function(){
                                self.delegateEvents(self.events);
                                sb.removeClass('disabled');
                            }, s().get('addcommenttimelimit'));
                            console.log('Комментарий успешно добавлен!');
                    },
                    error: function(){
                            console.log('При добавлении возникла какая-то ошибка!');
                    }
                });
        }
    },
    
    Edit: function(){
        var self = this;
        var sb1 = $((_.keys(this.eventsEdit)[0]).slice(6));
        var sb2 = $((_.keys(this.eventsEdit)[1]).slice(6));
        this.getDataHelper();
        this.model.saveexclude(this.model.toJSON(), {
            wait: true,
            success: function(model, response){
                    self.undelegateEvents();
                    model.set('content', response['content']);
                    model.set('last_edited', response['last_edited']);
                    console.log('Комментарий успешно изменён!');
                    sb1.addClass('disabled');
                    sb2.addClass('disabled');
                    setTimeout(function(){
                        self.delegateEvents(self.eventsEdit);
                        sb1.removeClass('disabled');
                        sb2.removeClass('disabled');
                    }, s().get('addcommenttimelimit'));
                },
            error: function(){
                    console.log('При изменении возникла какая-то ошибка!');
                }
            });
        
    },
    
    });

var ComentView = Marionette.ItemView.extend({
    
    tagName: 'div',
    
    className: "row panel radius comment",
    
    templateHelpers: function () {
        var self = this;
        return {
            permcomments: (function(){
                return s().get('permcomments');    
            })(),
            permwrite: (function(){
                (s().get('userid') === self.model.attributes.userid) ? permwrite = 1 : permwrite = 0;
                return permwrite;
            })(),
            avatar: (function(){
                if(self.model.attributes.avatar != '' && self.model.attributes.avatar != null){
                    return 'static/users/'+self.model.attributes.userid+'/avatars/'+ self.model.attributes.avatar+'?time='+_.now();
                } else {
                    return 'static/users/default/avatars/size3.jpg';
                }
            })(),
        }
    },
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(om().Templates, 'comment'));
        this.listenTo(this.model, 'sync', this.rerender);
    },
    
    rerender: function(){
        var self = this;
        this.$el.fadeOut(s().get('fadecomment'), function(){
            self.render();
            self.$el.fadeIn(s().get('fadecomment'));
        });
        return this;
    },
    
    onBeforeRender: function(){
        var params = this.model.toJSON();
        var date = new Date();
        
        date.setTime(params['created']*1000);
        params['fcreated'] = datef(s().get('dateformat'),date);
        this.model.set('fcreated', params['fcreated']);
        
        if(params['last_edited'] != 0 && params['last_edited'] != null){
           date.setTime(params['last_edited']*1000);
            params['flast_edited'] = datef(s().get('dateformat'),date);
            this.model.set('flast_edited', params['flast_edited']);
        }
        else {
            params['flast_edited'] = false;
            this.model.set('flast_edited', false);
        }
        if (!this.model.has('itemid')){
        var cl = this.model.collection
        if(om().CommentsPanelViewObj.sortparam==='desc'){
            var itemid = cl.length - _.indexOf(cl.models, this.model)
        }
        else {
            var itemid = _.indexOf(cl.models, this.model)+1
        }
        this.model.set('itemid', itemid);
        }
    },
    
    events: function(){
        var events = {};
        if (s().get('permcomments') == 1) {
            events['click .option1'] = 'QuoteComment';
            if(s().get('userid') == this.model.attributes.userid){
                events['click .option2'] = 'EditComment';
                events['click .option3'] = 'DeleteComment';
            }
        }
        return events;
    },
    
    QuoteComment: function(){
        var params = this.model.toJSON();
        var quote = _.template(Project.TemplateHelper(om().Templates, 'quotecomment'), params);
        
        $('#wbbeditor').execCommand('quote',{seltext: quote});
    },
    
    EditComment: function(){
        Project.vent.trigger('editcomment', this.model);
    },
    
    DeleteComment: function(){
        var self = this;
        var cvdefhtml = self.$el.html();
        $(self.$el).find('.option1').remove();
        $(self.$el).find('.option2').remove();
        $(self.$el).find('.option3').remove();
        var model = this.model;
        setTimeout(function(){
            $(self.$el).find('.info').append(Project.TemplateHelper(om().Templates, 'deleteyn'));
            $(self.$el).find('.deletecommentyny').click(function(){
                $(self.$el).fadeOut(s().get('fadecomment'), function(){
                    model.destroy({
                        wait: true,
                        success: function(model, response){
                            console.log('Комментарий успешно удалён!');
                            },
                        error: function(){
                            console.log('При удалении комментария возникла какая-то ошибка!');
                            $(self.$el).html(cvdefhtml);
                            $(self.$el).fadeIn(s().get('fadecomment'));
                        }
                    });
                });
            });
            $(self.$el).find('.deletecommentynn').click(function(){
                $(self.$el).fadeOut(s().get('fadecomment'), function(){
                    $(self.$el).html(cvdefhtml);
                    $(self.$el).fadeIn(s().get('fadecomment'));
                });
            });
        }, 400);
    }
    
    });

cm.CommentsView = Marionette.CollectionView.extend({
    
    tagName: 'div',
    
    className: 'row',
    
    childView: ComentView,
    
    initialize: function(){
        this.listenTo(this.collection, 'remove', this.deletecomment);
        this.listenTo(s(), 'change:permcomments change:userid', this.render)
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
    
    deletecomment: function(task){
        var self = this;
        var totalcommentsbefore = om().CountCommentsModelObj.get('totalcomments');
        var func = (function(){
                var totalcommentsafter = om().CountCommentsModelObj.get('totalcomments');
                if (Number(totalcommentsbefore) - 1 == (Number(totalcommentsafter))) {}
                else {
                    console.log('rerender cooments!');
                    self.collection.fetch({data: {sortorder: om().CommentsPanelViewObj.sortparam}, reset: true}).then(function(){
                        self.$el.fadeOut(100).fadeIn(s().get('fadecomment'));
                    });
                }
            });
        cgtotalcts(func);
    },
    
    attachHtml: function(collectionView, childView, index){
        if (collectionView.isBuffering) {collectionView._bufferedChildren.splice(index, 0, childView);}
        else{
                var self = this;
                var totalcommentsbefore = om().CountCommentsModelObj.get('totalcomments');
                var func = (function(){
                    var totalcommentsafter = om().CountCommentsModelObj.get('totalcomments');
                    if (Number(totalcommentsbefore) + 1 == (Number(totalcommentsafter))) {
                        //Если только один добавлял комменатрии
                        if (om().CommentsPanelViewObj.sortparam == 'asc') {
                            collectionView.$el.append(childView.el)
                        }
                        else{
                            collectionView.$el.prepend(childView.el)
                        }
                        childView.$el.fadeOut(100).fadeIn(s().get('fadecomment'));
                    }
                    else{
                        //Если ещё кто-то то ререндер всех
                        self.collection.fetch({data: {sortorder: om().CommentsPanelViewObj.sortparam}, reset: true}).then(function(){
                            self.$el.fadeOut(100).fadeIn(s().get('fadecomment'));
                        });
                    }
                });
                cgtotalcts(func);
        }
    }
    
});

cm.CommentsPanelView = Backbone.View.extend({
    
    //Элемент для комменатриев
    el: '.showhidecomments',
    
    //Блок для вставки комменатриев
    allcts: $('#allcomments'),
    
    //Статус
    sts: 0,
    
    //Сортировка
    sortparam: 'asc',
    
    //Хелпер показать/скрыть комментарии
    Helper_shcst: function(sts, title){
        var sts = arguments[0] === undefined ? 2 : arguments[0];
        var title = arguments[1] === undefined ? '' : arguments[1];
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
        this.shcts = this.$el.find('.showhide');
        this.shcts.html(this.Helper_shcst(1));
        this.shcts.on('click', {self: this}, this.Event_shcsopen);
    },
    
    //Событие открывающее комменатрии
    Event_shcsopen: function(event){
        var self = event.data.self;
        self.model.fetch().then(function(){
            om().CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.unbind('click');
                self.shcts.on('click', {self: self}, self.Event_shcsclose);
                om().CommentsViewObj = new cm.CommentsView({collection: om().CommentsCollectionObj});
                om().AllComments.show(om().CommentsViewObj);
                self.shcts.html(self.Helper_shcst(0));
                self.shcts.css('width', '500px');
                self.shcts.addClass('columns');
                if (self.sortparam == 'asc') {
                    self.Helper_ascdesc(self, '=>', self.Event_shcsdesc);
                }
                else {
                    self.Helper_ascdesc(self, '<=', self.Event_shcsasc);
                }
                //Project.vent.trigger('commentsopen'); 
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
            om().AllComments.empty()
            //Project.vent.trigger('commentsclose'); 
        });
    },
    
    //Событие сортировки asc
    Event_shcsasc: function(event){
        var self = event.data.self;
        self.shctssort.unbind('click');
        self.sortparam = 'asc';
        $(this).html('=>');
        self.model.fetch().then(function(){
            om().CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.html(self.Helper_shcst(0));
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
            om().CommentsCollectionObj.fetch({data: {sortorder: self.sortparam}, reset: true}).then(function(){
                self.shcts.html(self.Helper_shcst(0));
                setTimeout(function(){
                    self.shctssort.on('click', {self: self}, self.Event_shcsasc);
                    }, 3000);
                self.trigger('commentssortdesc');
            });
        });
    }
    
});

return Project;

});