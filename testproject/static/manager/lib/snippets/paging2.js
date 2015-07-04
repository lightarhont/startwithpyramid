pageobj.paging = $("#pagination").paging(pageobj.number, {
                       format: '[ < > ] . ( -) nnncnnn (- )',
                       perpage: pageobj.limit,
                       lapping: 0,
                       page: 1,
                       refresh: {'url': pageobj.preurl + 'count', 'interval': 300},
                       onRefresh: function (json) {
                        if(json.number != pageobj.number)
                        {
                         console.log('Данные изменились - ' + json.number + '!');
                         
                         if (confirm("Были получены новые данные! Перезагрузить таблицу?"))
                         {
                          console.log('Таблица обновлена!');
                          pageobj.paging.setNumber(json.number);
                          pageobj.paging.setPage();
                          pageobj.number = json.number;
                          pageobj.totalpages();
                         }
                         else
                         {
                          console.log('Команда отмены обновления таблицы!');
                         }
                        }
                        else
                        {
                         console.log('Данные не изменились - ' + json.number + '!');
                        }
                       },
                       onSelect: function (page) {
                       if(pageobj.pstart===2)
                       {
                            
                            url = pageobj.preurl + 'data/'+ this.slice[0] +'/'+ this.slice[1]
                            $('#loader1').show();
                            
                            pageobj.pcurrent = page
                            
                            $.ajax({
                             "async": false,
                             "url": url,
                             "type": "POST",
                             "data": pageobj.sort,
                             "success": function(data)
                             {
                                result = '';
                                for(i=0;i<data.length;i++)
                                {
                                 result += pageobj.tbody(data[i]);
                                }
                                $('#loader1').hide();
                                $('#cdt > tbody').html(result);
                                pageobj.tablefunc(pageobj.mainfuncsarr);
                             }
                             });
                       }
                       else
                       {
                        pageobj.pstart = 2;
                       }
                       },
                       onFormat: function (type) {
                        switch (type)
                         {
                         case 'block': // n and c
                          if(!this.active)
                          {
                           return '';
                          }
                          else if (this.value == this.page)
                          {
                           return '<p class="page">' + this.value + '</p>';
                          }
                          else
                          {
                           return '<a class="page" href="javascript: void(0);">' + this.value + '</a>';
                          }
                         case 'next': // >
                          if (this.active)
                          {
                           return '<a class="next" href="javascript: void(0);">Следующие</a>';
                          }
                          else
                          {
                           return '<p class="next">Следующие</p>';
                          }
                         case 'prev': // <
                          if (this.active)
                          {
                           return '<a class="previous" href="javascript: void(0);">Предыдущие</a>';
                          }
                          else
                          {
                           return '<p class="previous" >Предыдущие</p>';
                          }
                         case 'first': // [
                          if (this.active)
                          {
                           return '<a class="first" href="javascript: void(0);">К началу</a>';
                          }
                          else
                          {
                           return '<p class="first">К началу</p>';
                          }
                         case 'last': // ]
                          if (this.active)
                          {
                           return '<a class="last" href="javascript: void(0);">К концу</a>';
                          }
                          else
                          {
                           return '<p class="last">К концу</p>';
                          }
                         case "leap":
                          if (this.active)
                           return "   ";
                          return "";
                         case 'fill':
                          if (this.active)
                           return "...";
                          return "";
                         }
                        
                        }
                        
                      });
       