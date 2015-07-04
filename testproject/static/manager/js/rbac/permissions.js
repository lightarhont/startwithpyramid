
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
					setpermname: {
      required: true,
      minlength: 3,
      maxlength: 16,
      remote:{
        type: 'POST',
        url: pageobj.preurl+'findpermname',
        data: {
               setpermname: (function()
               {
                return $('#setpermname').val();
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
					setpermname: {
      required: "Введите имя роли!",
      minlength: "Имя правила не должно быть короче 3 символов!",
      maxlength: "Имя правила не должно быть больше 12 символов!",
      remote: "Правило с таким именем уже существует!"
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
                if (obj[2].length >= 68) {
                    obj[2] = obj[2].slice(0, 68) + '...';
                }
                var templateFunction = doT.template(trtabletpl);
                var result = templateFunction(obj);
                return result;
               }
               );

pageobj.edititemrender = (function(item)
                        {
                         data = {'id': item.id,
                                 'permname': item.permname,
                                 'description': item.description,
                                 'order': item.ordering,};
                         var templateFunction = doT.template(edittpl);
                         var result = templateFunction(data);
                         editrestore = result;
                         return result;
                        }
                      );

pageobj.saveitem = (function(){
        
        var id = $('#edititemid').val();
        
        data = {
                'id': id,
                'permname': $('#setpermname').val(),
                'description': $('#setdescription').val(),
                'order': $('#setorder').val(),
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
        ];

pageobj.addarr = [
            pageobj.newbuttons,
            pageobj.neworder,
        ];

pageobj.start = (function(){
        
        var basefunc = [
            pageobj.tablefunc,
            pageobj.checkall,
            pageobj.filter,
            pageobj.filterclear,
            pageobj.totalpages,
            [pageobj.orderby, [4,]],
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