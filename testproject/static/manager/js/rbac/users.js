pageobj.changepassword = (function(){
                       $('#changepassword a').click(function(){
                       $('#changepassword').css('display', 'none');
                       $('#ifchangepassword').css('display', 'block');
                      });
    });

pageobj.generatepassword = (function(){
                    $('#generatepassword').click(function(){
                       var password = cmgenerate(8);
                       $('#setpassword').val(password);
                       $('#setpasswordconfirm').val(password);
                       alert('Пароль сгенерирован, запишите его: ' + password);
                      });
    });

pageobj.selectroles = (function(){
        $(".chzn-select").chosen();
});

//Подсказки
pageobj.tooltips = (function(){
        prth_tips.init();
});

pageobj.validation = {
		init: function() {
			form_validator = $("form.validate").validate({
				highlight: function(element) {
					$(element).closest('div.elVal').addClass("form-field error");
				},
				unhighlight: function(element) {
					$(element).closest('div.elVal').removeClass("form-field error");
					var errors = form_validator.numberOfInvalids();
					if(errors == 0){
						$('#showMessage').remove();
					}else {
						$('#showMessage .errorsNb').text(errors);
					};
				},
				invalidHandler: function(form, validator) {
					var errors = form_validator.numberOfInvalids();
					//scroll to top
					$('html,body').animate({ scrollTop: $('form.validate').offset().top - 34 }, 'slow');
					//show error message (top sticky nottification)
					$('body').showMessage({
						thisMessage			: ['Ваша форма содержит <span class="errorsNb">'+errors+'</span> ошибок, смотрите детали ниже.'],
						className			: 'fail',
						autoClose			: false
					});
				},
				rules: {
					setusername: {
      required: true,
      minlength: 3,
      maxlength: 12,
      remote:{
        type: 'POST',
        url: pageobj.preurl+'findusername',
        data: {
               setusername: (function()
               {
                return $('#setusername').val();
               }),
               id: (function()
               {
                return $('#edititemid').val();
               })
              }
        }
      },
					setfullname:  {
      required: true,
      minlength: 3,
      maxlength: 12
      },
					setemail: {
						required: true,
						email: true,
      remote:{
        type: 'POST',
        url: pageobj.preurl+'findemail',
        data: {
               setemail: (function()
               {
                return $('#setemail').val();
               }),
               id: (function()
               {
                return $('#edititemid').val();
               })
              }
        }
					},
					setpassword: {
						minlength: 5,
      maxlength: 12
					},
					setpasswordconfirm: {
						minlength: 5,
      maxlength: 12,
						equalTo: "#setpassword"
					}
				},
				messages: {
					setusername: {
      required: "Введите имя пользователя!",
      minlength: "Имя пользователя не должно быть короче 3 символов!",
      maxlength: "Имя пользователя не должно быть больше 12 символов!",
      remote: "Пользователь с таким именем уже существует!"
     },
					setfullname: {
      required: "Введите полное имя!",
      minlength: "Полное имя не должно быть короче 3 символов!",
      maxlength: "Полное имя не должно быть больше 12 символов!"
     },
					setpassword: {
						minlength: "Пароль не должен быть короче 5 символов!",
      maxlength: "Пароль не должен быть больше 12 символов!"
					},
					setpasswordconfirm: {
						minlength: "Пароль не должен быть короче 5 символов!",
      maxlength: "Пароль не должен быть больше 12 символов!",
						equalTo: "Пароли не совпадают!"
					},
					setemail: {
      required: "Введите правильный email адрес!",
      email: "Введите правильный email адрес!",
      remote: "Пользователь с таким email уже существует!"
     }
				},
				showErrors: function (errorMap, errorList) {
					this.defaultShowErrors();
				},
				errorPlacement: function(error, element) {
					error.appendTo( element.closest("div.elVal") );
				},
				//submit form
				submitHandler: function(form) {
					pageobj.saveitem();
				},
				ignore: ""
			});
		}
	};

pageobj.tablefunc = (function()
                   {
                    //по событию на каждое поле
                    $('#cdt tbody td:nth-child(3)').click(function(){
                     var parent = $(this).parent();
                     var input = parent.children('td:nth-child(1)').children();
                     item = $(input).attr('id').split('-')[1];
                     pageobj.edititem(item);
                    });
                    }
                    );

pageobj.tbody = (function(obj)
               {
                var date = new Date();
                var timestamp = Math.round(date.getTime() / 1000);
                if((timestamp - Number(obj[4])) <= pageobj.activitytime)
                {
                    activity = "useract"  
                }
                else
                {
                    activity = "usernoact"  
                }
                date.setTime(obj[4]*1000);
                obj[4] = [activity, datef(pageobj.timeformat, date)]
                
                date.setTime(obj[3]*1000);
                obj[3] = datef(pageobj.timeformat, date);
                
                var templateFunction = doT.template(trtabletpl);
                var result = templateFunction(obj);
                return result;
               }
               );

pageobj.edititemrender = (function(data)
                        {
                         roles=data.roles;
                         var selectroles = [];
                         var selected = '';
                         for(i=0;i<pageobj.allroles.length;i++) {
                            selected = '';
                            if(roles.indexOf(pageobj.allroles[i][0]) != '-1')
                            {
                                selected = ' selected="selected"';
                            }
                            else
                            {
                                selected = '';
                            }
                            
                            selectroles[i] = '<option value="'+pageobj.allroles[i][0]+'" '+selected+' >'+pageobj.allroles[i][1]+'</option>'
                         }
                         
                         if(data.avatar1 != null ||  data.avatar2 != null || data.avatar3 != null)
                         {
                            var avatarsfolder = home + "static/users/"+ data.id +"/avatars/"
                            pageobj.dataitem.avatars = {'source': data.avatar1, 'size1': data.avatar2, 'size2': data.avatar3};
                            currtime = new Date().getTime();
                            data.avatar1 += '?id=' + currtime;
                            data.avatar2 += '?id=' + currtime;
                            data.avatar3 += '?id=' + currtime;
                         }
                         else
                         {
                            var avatarsfolder = home + "static/users/default/avatars/"
                            data.avatar1 = "size1.jpg"
                            data.avatar2 = "size2.jpg"
                            data.avatar3 = "size3.jpg"
                         }
                         
                         data.avatarsfolder = avatarsfolder;
                         
                         data.htmlroles = ''.concat(selectroles);
                         var templateFunction = doT.template(edittpl);
                         var result = templateFunction(data);
                         editrestore = result;
                         return result;
                        }
                      );

pageobj.saveitem = (function(){
        var id              = $('#edititemid').val();
        var username        = $('#setusername').val();
        var fullname        = $('#setfullname').val();
        var email           = $('#setemail').val();
        var password        = $('#setpassword').val();
        
        var roles = [];
        $('#setroles').children('option:selected').each(function(){
            roles[roles.length] = $(this).val();
            });
        
        data = {
                'id': id,
                'username': username,
                'fullname': fullname,
                'email': email,
                'password': password,
                'roles': JSON.stringify(roles),
                }
        if (pageobj.dataitem.avatars != undefined && pageobj.dataitem.avatars.userid == id)
        {
            data.avatarsource = pageobj.dataitem.avatars.source
            data.avatarsize1 = pageobj.dataitem.avatars.size1
            data.avatarsize2 = pageobj.dataitem.avatars.size2
        }
        
        $.ajax({
            'url': pageobj.preurl+'saveitem',
            'type': 'POST',
            'data': data,
            'success': function(data)
             {
              if(data == 1)
              {
                $('#tablesearchclear').click();
                if (id == 0)
                {
                    cgstatus = 'Получены новые данные!';
                }
                else
                {
                    cgstatus = 'Данные успешно изменены!';
                }
              }
              else
              {
                cgstatus = 'Возникла какая-то ошибка!';
              }
              $('.opstatus').html(cgstatus);
             }
            });
    });

var cmauiimport = (function(data){
    var userid = $('#edititemid').val();
    var url = home + 'uatmp/' + userid;
    $.ajax({
                             "async": false,
                             "url": url,
                             'type': 'POST',
                             'data': data,
                             "success": function(data)
                             {
                              currtime = new Date().getTime();
                              $('.imagestargets #target1').html('<a href="' + home + data.size1 + '?id=' + currtime + '" rel="single"  class="colorboxfullumg" title=""><img src="' + home + data.size1 + '?id=' + currtime + '" /></a>')
                              $('.imagestargets #target2').html('<img src="' + home + data.size2 + '?id=' + currtime + '" />')
                              $('.imagestargets #target3').html('<img src="' + home + data.size3 + '?id=' + currtime + '" />')
                              pageobj.pirobox();
                              
                              var str = data.size1;
                              source = str.substr(str.lastIndexOf("/")+1);
                              
                              var str = data.size2;
                              size1 = str.substr(str.lastIndexOf("/")+1);
                              
                              var str = data.size3;
                              size2 = str.substr(str.lastIndexOf("/")+1);
                              
                              pageobj.dataitem.avatars = {'userid': userid, 'source': source, 'size1': size1, 'size2': size2};
                             }
                             });
    
                   });

pageobj.mainfuncsarr = [
            pageobj.validation.init,
            pageobj.tooltips,
            pageobj.selectroles,
            pageobj.changepassword,
            pageobj.generatepassword,
            pageobj.pirobox
        ];

pageobj.addarr = [
            pageobj.newbuttons,
        ];

pageobj.start = (function(){
        
        var basefunc = [
            pageobj.tablefunc,
            pageobj.checkall,
            pageobj.filter,
            pageobj.filterclear,
            pageobj.totalpages,
            pageobj.orderby,
            [pageobj.paging.setOptions, {lock: false}]
        ];
        
        //Начальная загрузка
        funcs(this.mainfuncsarr.concat(this.addarr, basefunc));
        
        this.tablemenufunc(
        //Добавление
        this.mainfuncsarr.concat(this.addarr),
        //Редактирование
        this.mainfuncsarr.concat([[this.editbuttons, this.mainfuncsarr],])
        );
});
