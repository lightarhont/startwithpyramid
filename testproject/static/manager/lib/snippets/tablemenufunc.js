//Устанавливает функции меню таблицы
pageobj.tablemenufunc = (function(addfunc=[], editfunc=[])
                       {
                        $('#tadditem').click(function(){
                             $('#tablefunc').html(newrestore);
                             
                             funcs(addfunc);
                             
                             $('html, body').animate({scrollTop: $('#tablefunc').offset().top}, 500);
                            });
                        $('#tedititem').click(function(){
                             $('#cdt tbody td:nth-child(1)').children().each(function(){
                                 if($(this).prop("checked"))
                                 {
                                    var item = $(this).attr('id').split('-')[1];
                                    pageobj.edititem(item);
                                    return false;
                                 }
                                });
                            });
                        $('#tdeleteitem').click(function(){
                             var myarr = [];
                             $('#cdt tbody td:nth-child(1)').children().each(function(){
                                 if($(this).prop("checked"))
                                 {
                                    var item = $(this).attr('id').split('-')[1];
                                    myarr[myarr.length] = item;
                                    
                                 }
                                });
                             pageobj.deleteitems(myarr);
                            });
                       }
                      );