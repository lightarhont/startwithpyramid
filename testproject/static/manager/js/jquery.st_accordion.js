/*
* smartresize: debounced resize event for jQuery
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery.smartresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/
(function(h,b){var e=b.event,f;e.special.smartresize={setup:function(){b(this).bind("resize",e.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",e.special.smartresize.handler)},handler:function(a,b){var d=this,e=arguments;a.type="smartresize";f&&clearTimeout(f);f=setTimeout(function(){jQuery.event.handle.apply(d,e)},"execAsap"===b?0:100)}};b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])};b.st_accordion=function(a,c){this.$el= b(c);this.$items=this.$el.children("ul").children("li");this.itemsCount=this.$items.length;this._init(a)};b.st_accordion.defaults={open:-1,oneOpenedItem:!1,speed:600,easing:"easeInOutExpo",scrollSpeed:900,scrollEasing:"easeInOutExpo"};b.st_accordion.prototype={_init:function(a){this.options=b.extend(!0,{},b.st_accordion.defaults,a);this._validate();this.current=this.options.open;this.$items.find("div.st-content").hide();this._saveDimValues();-1!=this.current&&this._toggleItem(this.$items.eq(this.current)); this._initEvents()},_saveDimValues:function(){this.$items.each(function(){var a=b(this);a.data({originalHeight:a.find("a:first").outerHeight(),offsetTop:a.offset().top})})},_validate:function(){if(-1>this.options.open||this.options.open>this.itemsCount-1)this.options.open=-1},_initEvents:function(){var a=this;this.$items.find("a:first").bind("click.st_accordion",function(){var c=b(this).parent();a.options.oneOpenedItem&&a._isOpened()&&a.current!==c.index()&&a._toggleItem(a.$items.eq(a.current));a._toggleItem(c); return!1});b(h).bind("smartresize.st_accordion",function(){a._saveDimValues();a.$el.find("li.st-open").each(function(){var a=b(this);a.css("height",a.data("originalHeight")+a.find("div.st-content").outerHeight(!0))});a._isOpened()&&a._scroll()})},_isOpened:function(){return 0<this.$el.find("li.st-open").length},_toggleItem:function(a){var b=a.find("div.st-content");a.hasClass("st-open")?(this.current=-1,b.stop(!0,!0).fadeOut(this.options.speed),a.removeClass("st-open").stop().animate({height:a.data("originalHeight")}, this.options.speed,this.options.easing)):(this.current=a.index(),b.stop(!0,!0).fadeIn(this.options.speed),a.addClass("st-open").stop().animate({height:a.data("originalHeight")+b.outerHeight(!0)},this.options.speed,this.options.easing),this._scroll(this))},_scroll:function(a){var a=a||this,c;-1!==a.current?c=a.current:c=a.$el.find("li.st-open:last").index();b("html, body").stop().animate({scrollTop:a.options.oneOpenedItem?a.$items.eq(c).data("offsetTop"):a.$items.eq(c).offset().top},a.options.scrollSpeed, a.options.scrollEasing)}};var g=function(a){this.console&&console.error(a)};b.fn.st_accordion=function(a){if("string"===typeof a){var c=Array.prototype.slice.call(arguments,1);this.each(function(){var d=b.data(this,"st_accordion");d?!b.isFunction(d[a])||"_"===a.charAt(0)?g("no such method '"+a+"' for accordion instance"):d[a].apply(d,c):g("cannot call methods on accordion prior to initialization; attempted to call method '"+a+"'")})}else this.each(function(){b.data(this,"st_accordion")||b.data(this, "st_accordion",new b.st_accordion(a,this))});return this}})(window,jQuery);
