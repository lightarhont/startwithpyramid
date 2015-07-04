//Кнопки управления добавления удаления
pageobj.editbuttons = (function(restorefunc=[]){
     
     $('#saveitem').click(function(){
         $('#editform').submit();
     });
     $('#restoreitem').click(function(){
         $('#tablefunc').html(editrestore);
         
	 var funcsarr = [];
	 funcs(funcsarr.concat(pageobj.editbuttons, pageobj.mainfuncsarr));
         
         pageobj.editbuttons(restorefunc);
         cgstatus = 'Сброшена начальная копия данных!';
         $('.opstatus').html(cgstatus);
        });
});

pageobj.newbuttons = (function(){
        $('#newitem').click(function(){
         $('#newform').submit();
        });
});