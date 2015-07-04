define(function(){
    
    Project.Classes.Views.UserProfileMain = Marionette.ItemView.extend({
        
        initialize: function(){
            this.template = _.template(Project.TemplateHelper(Project.Templates.Profile, 'profileprofile'));
        },
        
        events: {
            'click a': 'setmodel'
        },
        
        setmodel: function(){
            this.model.set({fullname: $('.fullname input').val()});
            this.model.save({}, {
                wait: true,
                success: function(model, response){
                    if(response['result'] === true){
                        alert('Профиль изменён!');
                    }
                    else {
                        alert('Произошла какая-то ошибка!');
                    }
                },
                error: function(){
                    alert('Произошла какая-то ошибка!');
                }
                });
        },
        
        onShow: function(){
            Project.RenderStatusSet('userprofile');
        }
        
    });
    
    Project.Classes.Views.UserProfilePassword = Marionette.ItemView.extend({
        
        initialize: function(){
            this.template = _.template(Project.TemplateHelper(Project.Templates.Profile, 'profilepassword'));
            this.model.on('invalid', this.validate, this)
        },
        
        events: {
            'click a': 'setmodel'
        },
        
        setmodel: function(){
            this.model.set({userid: Project.Models.UserObj.get('userid'),
                            oldpassword: $('.oldpassword input').val(),
                            password: $('.password input').val(),
                            confirmpassword: $('.confirmpassword input').val()});
            this.clearerr();
            this.model.save({}, {
                wait: true,
                success: function(model, response){
                    if(response['result'] === 2){
                        $('.changepasswordform .passworderror div').html('Старый пароль не подходит!')
                    } else if(response['result'] === false) {
                        alert('Произошла какая-то ошибка!');
                    } else {
                        alert('Пароль успешно изменён!');
                    }
                },
                error: function(){
                    alert('Произошла какая-то ошибка!');
                }
                });
        },
        
        clearerr: function(){
            $('.changepasswordform .validate div').each(function(){
                 $(this).html('');
            });
        },
        
        validate: function(model, error){
            var key = _.keys(error)[0];
            $('.changepasswordform .'+key+'error div').html(error[key])
        },
        
        onShow: function(){
            Project.RenderStatusSet('userpassword');
        }
        
    });
    
    Project.Classes.Views.UserProfileAvatar = Marionette.ItemView.extend({
        
        initialize: function(){
            this.template = _.template(Project.TemplateHelper(Project.Templates.Profile, 'profileavatar'));
        },
        
        templateHelpers: function () {
        var u = Project.Models.UserObj
        var userid = u.get('userid');
        var self = this;
        return {
            avatar1: (function(){
                if(_.has(u.attributes, 'hasavatar') && u.attributes.hasavatar === true){
                    return 'static/users/'+userid+'/avatars/100x100.png?id='+_.now();
                } else {
                    return 'static/users/default/avatars/size3.jpg';
                }   
            })(),
            avatar2: (function(){
                if(_.has(u.attributes, 'hasavatar') && u.attributes.hasavatar === true){
                    return 'static/users/'+userid+'/avatars/200x200.png?id='+_.now();
                } else {
                    return 'static/users/default/avatars/size2.jpg';
                } 
            })(),
            avatar3: (function(){
                if(_.has(u.attributes, 'hasavatar') && u.attributes.hasavatar === true){
                    return 'static/users/'+userid+'/avatars/source.jpg?id='+_.now();
                } else {
                    return 'static/users/default/avatars/full.jpg';
                } 
            })(),
        }
        },
        
        saveavatar: function(){
            var url = pfx+'profile/avatar';
            var self = this;
            $.ajax({
                             "async": false,
                             "url": url,
                             'type': 'POST',
                             'data': Project.Temporary.Avatars,
                             "success": function(data){
                                if(data['result'] === true){
                                    alert('Аватар успешно изменён!');
                                    self.undelegateEvents();
                                    $('.saveavatar').hide();
                                    Project.Models.UserObj.set('hasavatar', true);
                                }
                                else {
                                    alert('Возникла какая-то ошибка!');
                                }
                             },
                             "error": function(){
                                alert('Возникла какая-то ошибка!');
                             }
            });
        },
        
        onShow: function(){
            var self = this;
            $(".firstavatar a").colorbox({close:'закрыть',fixed:true});
            window.cmauiimport = (function(data){
                var userid = Project.Models.UserObj.get('userid');
                var url = home + 'uatmp/' + userid;
                $.ajax({
                             "async": false,
                             "url": url,
                             'type': 'POST',
                             'data': data,
                             "success": function(data)
                             {
                                $('.firstavatar').html('<a href="' + home + data.size1 + '?id=' + _.now() + '" title=""><img src="' + home + data.size1 + '?id=' + _.now() + '" /></a>');
                                $('.secondavatar').html('<img src="' + home + data.size2 + '?id=' + _.now() + '" />');
                                $('.thirdavatar').html('<img src="' + home + data.size3 + '?id=' + _.now() + '" />');
                                var str = data.size1;
                                source = str.substr(str.lastIndexOf("/")+1);
                                
                                var str = data.size2;
                                size1 = str.substr(str.lastIndexOf("/")+1);
                                
                                var str = data.size3;
                                size2 = str.substr(str.lastIndexOf("/")+1);
                                
                                Project.Temporary.Avatars = {'id': userid, 'avatarsource': source, 'avatarsize1': size1, 'avatarsize2': size2};
                                $(".firstavatar a").colorbox({close:'закрыть',fixed:true});
                                $('.saveavatar').show();
                                self.delegateEvents({'click .saveavatar': 'saveavatar'})
                             }
                });
            });
            
            clear = (function(){
                auiclearmodule();
                auiclearmodule = undefined;
            });
            
            $('.hiddenloader a').colorbox({
                close:'закрыть',
                fixed:true,
                width: 655,
                height: 620,
                onClosed: clear});
            this.on('route', function(){
                clear();
                cmauiimport = undefined;
                    }, this);
            
            Project.RenderStatusSet('useravatar');
        },
        
    });
    
    return Project;
});