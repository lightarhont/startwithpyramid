var pages = (function(page) {
  var url = home+commentsparam.getcomments+commentsparam.useavatars+'/'+commentsparam.component+'/'+commentsparam.componentid+'/'+page+'/'+commentsparam.total;
  $('.comments').load(url);
});
  
  var commentsload = (function() {
              var url = home+commentsparam.getcomments+commentsparam.useavatars+'/'+commentsparam.component+'/'+commentsparam.componentid+'/'+commentsparam.page+'/'+commentsparam.total;
              $('.comments').load(url);     
        });