define(function(){
    
Project.Classes.Views.UserRegister = Marionette.ItemView.extend({
    
    initialize: function(){
        this.template = _.template(Project.TemplateHelper(Project.Templates.Register, 'register'));
        this.on('registration', this.registration, this);
        this.on('duplicate', this.duplicate, this);
        this.model.on('invalid', this.validate, this)
    },
    
    events: {
            'click a' : 'setmodel'
    },
    
    setmodel: function(){
        var self = this;
        this.model.set({
                        fullname: $('.fullname input').val(),
                        username: $('.username input').val(),
                        email: $('.email input').val(),
                        password: $('.password input').val(),
                        confirmpassword: $('.confirmpassword input').val(),
                        ipaddr: 'addr'
        });
        
        this.model.save({}, {
            success: function(model, response){
                if(_.has(response, 'registration') && response['registration'] === true){
                    self.trigger('registration');
                    model.clear();
                }
                else if(_.has(response, 'duplicate') && response['duplicate'] === true) {
                    self.trigger('duplicate');
                }
                else{}
            }
            });
        
    },
    
    registration: function(){
        this.undelegateEvents();
        try {
            document.location.hash = '#';    
        } catch(e) {
            setTimeout(function(){document.location.hash = '#';}, 100);
        }
    },
    
    clearerr: function(){
        $('.registerform .validate div').each(function(){
             $(this).html('');
        });
    },
    
    duplicate: function(){
        this.clearerr();
        var err = 'Имя пользователя или email уже используется';
        $('.registerform .usernameerror div').html(err);
        $('.registerform .emailerror div').html(err);
    },
    
    validate: function(model, error){
        this.clearerr();
        var key = _.keys(error)[0]
        $('.registerform .'+key+'error div').html(error[key])
        
    },
    
    onShow: function(){
        Project.RenderStatusSet('registerform');
    }
    
});    
    
return Project;

});