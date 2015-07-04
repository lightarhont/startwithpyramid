
pageobj.selectpermissons = (function(){
        $(".chzn-select").chosen();
    });
    
pageobj.selectrolegroup = (function(){
        $('#selectrolegroup').chosen({disable_search_threshold: 10});
    });

pageobj.description = (function(){
        $("#setdescription").counter({goal: 255});  
    });

pageobj.order = (function(){
        $("#setorder").spinner({min:1});
    });
    
pageobj.neworder = (function(){
        $("#setorder").val(pageobj.number+1);
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
					setrolename: {
      required: true,
      minlength: 3,
      maxlength: 16,
      remote:{
        type: 'POST',
        url: pageobj.preurl+'findrolename',
        data: {
               setusername: (function()
               {
                return $('#setrolename').val();
               }),
               id: (function()
               {
                return $('#edititemid').val();
               })
              }
        }
      },
				},
				messages: {
					setrolename: {
      required: "Введите имя роли!",
      minlength: "Имя роли не должно быть короче 3 символов!",
      maxlength: "Имя роли не должно быть больше 12 символов!",
      remote: "Роль с таким именем уже существует!"
     },
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
                if (obj[3].length >= 68) {
                    obj[3] = obj[3].slice(0, 68) + '...';
                }
                var templateFunction = doT.template(trtabletpl);
                var result = templateFunction(obj);
                return result;
               }
               );

pageobj.edititemrender = (function(item)
                        {
                         
                         permissions=item.permissions;
                         var selectpermissions = [];
                         var selected = '';
                         for(i=0;i<pageobj.allpermissions.length;i++) {
                            selected = '';
                            if(permissions.indexOf(pageobj.allpermissions[i][0]) != '-1')
                            {
                                selected = ' selected="selected"';
                            }
                            else
                            {
                                selected = '';
                            }
                            
                            selectpermissions[i] = '<option value="'+pageobj.allpermissions[i][0]+'" '+selected+' >'+pageobj.allpermissions[i][1]+'</option>'
                         }
                         
                         var selectrolesgroup = []
                         for(i=0;i<pageobj.rolesgroup.length;i++) {
                            
                            if(item.rolegroup == pageobj.rolesgroup[i]) {
                                selected = ' selected="selected"';
                            }
                            else
                            {
                                selected = '';
                            }
                            selectrolesgroup[i] = '<option value="' + pageobj.rolesgroup[i] + '"' + selected + '>' + pageobj.rolesgroup[i] + '</option>'
                         }

                         data = {'id': item.id,
                                 'rolename': item.rolename,
                                 'rolegroup': ''.concat(selectrolesgroup),
                                 'description': item.description,
                                 'order': item.ordering,
                                 'htmlpermissions': ''.concat(selectpermissions)};
                         var templateFunction = doT.template(edittpl);
                         var result = templateFunction(data);
                         editrestore = result;
                         return result;
                        }
                      );

pageobj.saveitem = (function(){
        
        var id = $('#edititemid').val();
        
        var permissions = [];
        $('#setpermissions').children('option:selected').each(function(){
            permissions[permissions.length] = $(this).val();
        });
        
        data = {
                'id': id,
                'rolename': $('#setrolename').val(),
                'rolegroup': $('#selectrolegroup').val(),
                'description': $('#setdescription').val(),
                'order': $('#setorder').val(),
                'permissions': JSON.stringify(permissions)
                };
        
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

pageobj.mainfuncsarr = [
            pageobj.validation.init,
            pageobj.tooltips,
            pageobj.description,
            pageobj.order,
            pageobj.selectpermissons,
            pageobj.selectrolegroup
        ];

pageobj.addarr = [
            pageobj.newbuttons,
            pageobj.neworder
        ];

pageobj.start = (function(){
        
        var basefunc = [
            pageobj.tablefunc,
            pageobj.checkall,
            pageobj.filter,
            pageobj.filterclear,
            pageobj.totalpages,
            [pageobj.orderby, [5,]],
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
