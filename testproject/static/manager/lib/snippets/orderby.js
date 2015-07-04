pageobj.orderby = (function(exl=[]){
                      var len = $('#cdt thead th').size();
                      var el = '';
                      for(i=1;i<len+1; i++)
                      {
                       if(i!=1 && exl.indexOf(i) == '-1')
                       { 
                        $('#cdt th:nth-child('+ i +')').click(function(){
                         
                         i = $(this).index()+1;
                         el = '#cdt th:nth-child('+ i +')';
                         if(i != pageobj.sort.col)
                         {
                          pageobj.sort.col = i;
                          pageobj.sort.asc = 1;
                          $('#cdt th').css('background-image','url(lib/datatables/images/sort_both.gif)');
                          if (exl.length != 0)
                          {
                           for(k=1; k<len+1; k++)
                           {
                            if (exl.indexOf(k) != '-1')
                            {                                            
                             $('#cdt th:nth-child('+ k +')').css('background-image','none');
                            }
                           }
                          }
                          $(el).css('background-image','url(lib/datatables/images/sort_desc.gif)');
                         }
                         else
                         {
                          if(pageobj.sort.asc == 1)
                          {
                           $(el).css('background-image','url(lib/datatables/images/sort_asc.gif)');
                           pageobj.sort.asc = 0;
                          }
                          else
                          {
                           $(el).css('background-image','url(lib/datatables/images/sort_desc.gif)');
                           pageobj.sort.asc = 1;
                          }
                         }
                         pageobj.paging.setPage();
                         pageobj.paging.setPage(pageobj.pcurrent);
                       });
                       }
                      }
                      });