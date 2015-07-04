var cmtplloader = (function(tpl){
        var url = home + 'dotjs/manager/' + tpl;
        var result = '0'
        $.ajax({
            "async": false,
            "url": url,
            "type": "GET",
            "success": function(data)
            {
                result = data;
            }
            });
        if (result == '0') {
            alert('Не удалось загрузить шаблон - "' + tpl + '"');
        }
        return result;
    });