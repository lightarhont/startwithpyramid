pageobj.filter = (function()
              {
                $('#tablesearch').click(function(){
                       lke = $("#selecttablesearch :selected").val();
                       phr = $("#fieldtablesearch").val();
                       if(phr != '' && lke != 'none')
                       {
                        pageobj.sort.phr = phr;
                        pageobj.sort.lke = lke;
                        search = 1;
                        
                        url = pageobj.preurl + 'searchcount';
                        
                        post = {'phr': pageobj.sort.phr, 'lke': pageobj.sort.lke};
                        
                        $('#loader1').show();
                        
                        $.ajax({
                             "async": false,
                             "url": url,
                             "type": "POST",
                             "data": post,
                             "success": function(data)
                             {
                              pageobj.paging.setNumber(data);
                              pageobj.number = data
                              pageobj.totalpages();
                              pageobj.paging.setOptions({refresh: {'url': undefined}});
                              pageobj.paging.setPage();
                              $('#loader1').hide();
                             }
                        });
                       }
                      });
              }
             );