pageobj.deleteitems = (function(items){
     data = {'delitems': JSON.stringify(items)};
     url = pageobj.preurl + 'deleteitems';
     $.ajax({
        "async": false,
        'url': url,
        'type': 'POST',
        'data': data,
        "success": function(data)
         {
          if(data == 1)
          {
            if(items.length>0)
            {
             $('#tablesearchclear').click();
            }
          }
          else
          {
            alert('Возникла какая-то ошибка!');
          }
         }
        });
    });