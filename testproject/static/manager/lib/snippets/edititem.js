pageobj.edititem = (function(item)
                  {
                        url = pageobj.preurl + 'loaditem/'+ item
                         
                        $.ajax({
                             "async": false,
                             "url": url,
                             "success": function(data)
                             {
                             $('#tablefunc').html(pageobj.edititemrender(data));
                             var funcsarr = [];
                             funcs(funcsarr.concat(pageobj.editbuttons, pageobj.mainfuncsarr));
                             $('html, body').animate({scrollTop: $('#tablefunc').offset().top}, 500);
                             },
                             error: function(XMLHttpRequest, textStatus)
                             {
                                alert('Произошла ошибка загрузки данных');
                             }
                             });
                        
                        
                  }
                 );