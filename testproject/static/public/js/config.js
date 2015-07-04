require.config({
    
    //baseUrl: "/js",
    
    deps: ['./project/start'],
    
    paths: {
        
        text                : '../lib/bower_components/requirejs-text/text',
        modernizr           : '../lib/foundation/bower_components/modernizr/modernizr',
        jquery              : '../lib/bower_components/jquery/jquery',
        underscore          : '../lib/bower_components/underscore/underscore',
        backbone            : '../lib/bower_components/backbone/backbone',
        backbonewreqr       : '../lib/bower_components/backbone.wreqr/lib/backbone.wreqr',
        backbonebabysitter  : '../lib/bower_components/backbone.babysitter/lib/backbone.babysitter',
        marionette          : '../lib/bower_components/marionette/lib/backbone.marionette',
        wysibb              : '../lib/wysibb/jquery.wysibb',
        datef               : '../lib/datef/datef',
        datef_ru            : '../lib/datef/lang/ru',
    
        
        
        },
    
    shim: {
        backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'backbone'
    },
    marionette: {
      deps: ['backbone', 'backbonewreqr', 'backbonebabysitter'],
      exports: 'marionette'
    },
    wysibb: {
    }
    },
    
});