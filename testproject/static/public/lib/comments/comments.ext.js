//Цитирование
var citeauthor = (function(id) {
  var usercomment  = $('#uc'+id).html();
  var datecomment  = $('#dc'+id).html();
  var titlecomment = '<strong>'+$('#tc'+id).html()+'</strong>';
  var bodycomment  = $('#bc'+id).html();
  $('#wbbeditor').execCommand('quote',{seltext:quotecommenttpl(usercomment, datecomment, titlecomment, bodycomment)});
});

//Получение данных для редактирования
var editcomment = (function(id)
  {
  $.post(home+commentsparam.getcomment,{idcomment: id},function(data)
    {
    var clear = "'clear'";
    var updatecomment = "'updatecomment'";
    $('.submit-button').html(editcommentbutton(clear, updatecomment));
    $('#adcomment legend').html('Редактировать комментарий')
    $('.titlecomment input').val(data.title);
    commentsparam.updateid = data.id;
    $("#wbbeditor").htmlcode(data.content);
    $("#wbbeditor").bbcode(data.content);
    });
 });

//Сабмит кнопок
var submitajax = (function(mode) {
  //Если добавляем
  if(mode == 'adcomment') {
    $.post(home+commentsparam.addcomment,
    { title: $('.titlecomment input').val(),
      comment: $('#wbbeditor').getBBCode(),
      userid: commentsparam.userid,
      com: commentsparam.component,
      comid: commentsparam.componentid,
      conttitle: commentsparam.titlecontent },
    function(data)
    {
      if(data == 'Комментарий успешно добавлен!')
        {
        var resultopt = '<div class="success">Успешно:</div>';
        $('#adcomment').css('display', 'none');
        $('#messagertimer').css('display', 'block');
        commentsload(1);
        setTimeout(comentreadyclear, 3000);
        }
        else
        {
        var resultopt = '<div class="error">Ошибка:</div>';
        }
        $('#result').html(arcticmodalmsgtpl(resultopt, data));
        arcticmodalmsg();
    });
  }
  //Если обновляем
  if(mode == 'updatecomment') {
   $.post(home+commentsparam.updatecomment,
   { itemid: commentsparam.updateid,
     title: $('.titlecomment input').val(),
     comment: $('#wbbeditor').getBBCode()},
    function(data)
    {
      if(data == 'Комментарий успешно отредактирован!')
      {
        var resultopt = '<div class="success">Успешно:</div>';
        $('#adcomment').css('display', 'none');
        $('#messagertimer').css('display', 'block');
        commentsload(1);
        setTimeout(comentreadyclear, 3000);
      }
      else
      {
        var resultopt = '<div class="error">Ошибка:</div>';
      }
      $('#result').html(arcticmodalmsgtpl(resultopt, data));
      arcticmodalmsg();
    });
  }
  
  //Если очищаем
  if(mode == 'clear') {
   resetformsubmit();
  }
});

//Сброс формы
var resetformsubmit = (function()
  {
  var adcomment = "'adcomment'";
  $('.submit-button').html(addcommentbutton(adcomment));
  $('.titlecomment input').val('');
  $('#updateid').val('0');
  $("#wbbeditor").htmlcode('');
  $("#wbbeditor").bbcode('');
  $('#adcomment legend').html('Новый комментарий')
});

//Между функциями
var comentreadyclear = (function()
  {
  $('#adcomment').css('display', 'block');
	 $('#messagertimer').css('display', 'none');
	 
	 var adcomment = "'adcomment'";
  $('.submit-button').html(addcommentbutton(adcomment));
  $('#updateid').val('0');
	 
	 $('.titlecomment input').val('');
	 $('.bodycomment textarea').val('');
	 
	 $("#wbbeditor").htmlcode('');
	 $("#wbbeditor").bbcode('');
});

//Подтверждение удаления
var deletecommentconfirm = (function(commentid)
  {
  resetformsubmit();
  var id = "'" + commentid + "'";
  $('#result').html(arcticmodalmsgtpl2(id));
  arcticmodalmsg('delete-box-modal');
});

//Удалить комментарий
var deletecomment = (function(commentid)
  {
   closearctic();
   $.post(home+commentsparam.removecomment,
   { itemid: commentid },
   function(data)
   {
    if (data == 'Комментарий удалён!')
    {
     var resultopt = '<div class="success">Успешно:</div>';
    }
    else
    {
     var resultopt = '<div class="error">Ошибка:</div>'; 
    }
    $('#result').html(arcticmodalmsgtpl(resultopt, data));
    arcticmodalmsg();
    commentsload(1);
   });
});

//-->arcticmodal
//Нстройки сообщения модального окна
var arcticmodalmsg = (function(id='box-modal')
  {
    $('#'+id).arcticmodal({
    closeOnEsc: false,
    closeOnOverlayClick: false,
    overlay:
     {
      css:
      {
        backgroundColor: '#fff',
        backgroundImage: 'url(images/overlay.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: '50% 0',
        opacity: .75
      }
     }
    });
});

//Закрыть модальное окно
var closearctic = (function()
 {
  $.arcticmodal('close');
});

//Обычное сообщение
var arcticmodalmsgtpl = (function(resultopt, msg){
  var data = {'resultopt': resultopt, 'msg': msg};
  var tf = doT.template($('.dotjs-comments-arcticmodalmsgtpl').html());
  return tf(data);
});

//Сообщение с подтверждением
var arcticmodalmsgtpl2 = (function(id){
  var data = {'id': id};
  var tf = doT.template($('.dotjs-comments-arcticmodalmsgtpl2').html());
  return tf(data);
});
//arcticmodal-->

//-->Кнопки
var addcommentbutton = (function(operand){
  var data = {'operand': operand};
  var tf = doT.template($('.dotjs-comments-addcommentbutton').html());
  return tf(data);
});

var editcommentbutton = (function(operand, operand2){
  var data = {'operand': operand, 'operand2': operand2};
  var tf = doT.template($('.dotjs-comments-editcommentbutton').html());
  return tf(data);
});
//Кнопки-->

//-->Цитирование
var quotecommenttpl = (function(usercomment, datecomment, titlecomment, bodycomment){
  var data = {'usercomment': usercomment, 'datecomment': datecomment, 'titlecomment': titlecomment, 'bodycomment': bodycomment};
  var tf = doT.template($('.dotjs-comments-quotecommenttpl').html());
  return tf(data);
});
//Кнопки-->

//Страничный менеджер
var pages = (function(page)
  {
    var url = home+commentsparam.getcomments+commentsparam.useavatars+'/'+commentsparam.component+'/'+commentsparam.componentid+'/'+page+'/'+commentsparam.total;
    $('#allcomments').load(url);
});
 
//Загрузка комментариев 
var commentsload = (function(count=0)
  {
    var url = home+commentsparam.getcomments+commentsparam.useavatars+'/'+commentsparam.component+'/'+commentsparam.componentid+'/'+commentsparam.page+'/'+commentsparam.total;
    if (count==0)
     {
      $('.comments').load(url);
     }
    else
     {
      data = {'component': commentsparam.component, 'componentid': commentsparam.componentid};
      $.ajax({
        "async": false,
        "url": home+commentsparam.countcomments,
        'type': 'POST',
        'data': data,
        "success": function(data)
          {
            commentsparam.total = data
          }
          });
      $('.comments').load(url);
     }
});