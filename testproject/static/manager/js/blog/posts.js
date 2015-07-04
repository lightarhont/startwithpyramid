
pageobj.checkboxes = (function(){
    prth_ios_checkboxes.init();
});

pageobj.ckeditor = (function(){
    CKEDITOR.replace( 'into' );
    CKEDITOR.replace( 'content' );
});

pageobj.selecttags = (function(){
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

pageobj.saveitem = (function(){
        var id              = $('#edititemid').val();
        var title           = $('#setposttitle').val();
        var alias           = $('#setalias').val();
        var userid          = $('#setuser').val();
        var into            = CKEDITOR.instances.into.getData();
        var content         = CKEDITOR.instances.content.getData();
        var published       = ($('[name=published]').attr('checked')) ? 1 : 0;
        var comments        = ($('[name=comments]').attr('checked')) ? 1 : 0;
        var comments_prem   = ($('[name=comments_premoderation]').attr('checked')) ? 1 : 0;
        
        var tags = [];
        $('#settags').children('option:selected').each(function(){
            tags[tags.length] = $(this).val();
            });
        
        data = {
                'id': id,
                'title': title,
                'alias': alias,
                'userid': userid,
                'into': into,
                'content': content,
                'published': published,
                'comments': comments,
                'comments_premoderation': comments_prem,
                'tags': JSON.stringify(tags)
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
                date.setTime(obj[4]*1000);
                obj[4] = datef(pageobj.timeformat, date)
                
                date.setTime(obj[3]*1000);
                obj[3] = datef(pageobj.timeformat, date);
                
                var templateFunction = doT.template(trtabletpl);
                var result = templateFunction(obj);
                return result;
               }
               );

pageobj.edititemrender = (function(data)
                        {
                         CKEDITOR.instances.into.destroy()
                         CKEDITOR.instances.content.destroy()
                         tags=data.tags;
                         var selecttags = [];
                         var selected = '';
                         for(i=0;i<pageobj.alltags.length;i++) {
                            selected = '';
                            if(tags.indexOf(pageobj.alltags[i][0]) != '-1')
                            {
                                selected = ' selected="selected"';
                            }
                            else
                            {
                                selected = '';
                            }
                            
                            selecttags[i] = '<option value="'+pageobj.alltags[i][0]+'" '+selected+' >'+pageobj.alltags[i][1]+'</option>'
                         }
                         
                         selectusers = []
                         for(i=0;i<pageobj.allusers.length;i++) {
                              if (pageobj.allusers[i][0] == data.fromuserid)
                              {
                                   selected = ' selected="selected"';
                              }
                              else
                              {
                                   selected = '';
                              }
                              selectusers[i] = '<option value="' + pageobj.allusers[i][0] + '" ' + selected + '>' + pageobj.allusers[i][1] + '</option>';
                         }
                         
                         data.htmltags = ''.concat(selecttags);
                         data.htmlallusers = ''.concat(selectusers);
                         data.checkbox1 = (data.published === 1) ? ' checked="checked"' : '';
                         data.checkbox2 = (data.comments === 1) ? ' checked="checked"' : '';
                         data.checkbox3 = (data.comments_premoderation === 1) ? ' checked="checked"' : '';
                         var templateFunction = doT.template(edittpl);
                         var result = templateFunction(data);
                         editrestore = result;
                         return result;
                        }
                      );

pageobj.mainfuncsarr = [
            pageobj.validation.init,
            pageobj.tooltips,
            pageobj.selecttags,
            pageobj.ckeditor,
            pageobj.checkboxes,
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