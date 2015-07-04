pageobj.filterclear = (function(){
                       $('#tablesearchclear').click(function(){
                       $("#fieldtablesearch").val('')
                       
                       delete pageobj.sort.lke;
                       delete pageobj.sort.phr;
                       
                       url = pageobj.preurl + 'count';
                       
                       $('#loader1').show();
                       
                       $.ajax({
                             "async": false,
                             "url": url,
                             "success": function(data)
                             {
                              pageobj.paging.setNumber(data.number);
                              pageobj.number = data.number;
                              pageobj.totalpages();
                              pageobj.paging.setOptions({refresh: {'url': pageobj.preurl + 'count', 'interval': 300}});
                              pageobj.paging.setPage();
                              $('#loader1').hide();
                             }
                        });
                      });
                      });