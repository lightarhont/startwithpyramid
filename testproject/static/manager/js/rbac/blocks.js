
pageobj.setblockcomment = (function(){
        $("#setblockcomment").counter({goal: 255});
});

pageobj.datetimepicker = (function(){
        $("input.datetime").datetimepicker();
});

//Подсказки
pageobj.tooltips = (function(){
        prth_tips.init();
});

pageobj.selectstyle = (function(){
        $(".chzn-select").chosen();
});

pageobj.validation = {
  init: function() {
   $.validator.addMethod('datemax', function(value, element)
     {
     d1 = new Date(value);
     d2nf = $('[name=setdateend]').val()
     if(d2nf.length == 0)return true;
     d2 = new Date();
     return d1 < d2;
     },
     "Дата начала блокировки не может быть больше даты конца!");
   $.validator.addMethod('datemin', function(value, element)
     {
     d1nf = $('[name=setdatestart]').val()
     if(d1nf.length == 0)return true;
     d1 = new Date(d1nf);
     d2 = new Date(value);
     return d1 < d2;
     },
     "Дата конца блокировки не может быть меньше даты начала!");
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
					setdatestart: {
      required: true,
      date: true,
      datemax: true
      },
     setdateend: {
      required: true,
      date: true,
      datemin: true
      },
				},
				messages: {
					setdatestart: {
      required: "Введите дату начала!",
      date: "Введите правильную дату"
     },
     setdateend: {
      required: "Введите дату конца!",
      date: "Введите правильную дату"
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
                var date = new Date();
                var timestamp = Math.round(date.getTime() / 1000);
                date.setTime(obj[4]*1000);
                
                if(Number(obj[4])>timestamp)
                {
                    var activity = "blockact";
                    
                }
                else
                {
                    var activity = "blocknoact";
                }
                obj[4] = [activity, datef(pageobj.timeformat, date)]
                date.setTime(obj[5]*1000);
                if(Number(obj[5])>timestamp)
                {
                    var activity = "blockact";
                }
                else
                {
                    var activity = "blocknoact";
                }
                obj[5] = [activity, datef(pageobj.timeformat, date)];
                var templateFunction = doT.template(trtabletpl);
                var result = templateFunction(obj);
                return result;
               }
               );

pageobj.edititemrender = (function(data)
                        {
                         
                         selectusers = []
                         for(i=0;i<pageobj.exlusers.length;i++) {
                              if (pageobj.exlusers[i][0] == data.userid)
                              {
                                   selected = ' selected="selected"';
                              }
                              else
                              {
                                   selected = '';
                              }
                              selectusers[i] = '<option value="' + pageobj.exlusers[i][0] + '" ' + selected + '>' + pageobj.exlusers[i][1] + '</option>';
                         }
                         
                         selectperm = []
                         for(i=0;i<pageobj.exlpermissons.length;i++) {
                              if (pageobj.exlpermissons[i][0] == data.ruleid)
                              {
                                   selected = ' selected="selected"';
                              }
                              else
                              {
                                   selected = '';
                              }
                              selectperm[i] = '<option value="' + pageobj.exlpermissons[i][0] + '" ' + selected + '>' + pageobj.exlpermissons[i][1] + '</option>';
                         }
                         
                         selectusers2 = []
                         for(i=0;i<pageobj.allusers.length;i++) {
                              if (pageobj.allusers[i][0] == data.fromuserid)
                              {
                                   selected = ' selected="selected"';
                              }
                              else
                              {
                                   selected = '';
                              }
                              selectusers2[i] = '<option value="' + pageobj.allusers[i][0] + '" ' + selected + '>' + pageobj.allusers[i][1] + '</option>';
                         }
                         
                         dformat =  'YYYY/MM/dd HH:mm';
                         data.fdatestart = datef(dformat, data.datestart*1000);
                         data.fdateend = datef(dformat, data.dateend*1000);
                         
                         data.exlusers = ''.concat(selectusers);
                         data.exlpermissons = ''.concat(selectperm);
                         data.allusers = ''.concat(selectusers2);
                         
                         var templateFunction = doT.template(edittpl);
                         var result = templateFunction(data);
                         editrestore = result;
                         return result;
                        }
                      );

pageobj.saveitem = (function(){
        
        var id = $('#edititemid').val();
        
        var datestart = Date.parse($('#setdatestart').val())/1000;
        var dateend = Date.parse($('#setdateend').val())/1000;
        
        data = {
                'id': id,
                'blockeduser': $('#setblockeduser').val(),
                'ruleblock': $('#setruleblock').val(),
                'fromuser': $('#setfromuser').val(),
                'datestart': datestart,
                'dateend': dateend,
                'blockcomment': $('#setblockcomment').val(),
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
            pageobj.selectstyle,
            pageobj.datetimepicker,
            pageobj.setblockcomment
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