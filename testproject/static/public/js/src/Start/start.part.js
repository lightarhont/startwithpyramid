require(['modernizr'], function(){

// Проверяем браузер и поддержку кук
//navigator.cookieEnabled

require([
    
  'text',
  'jquery',
  'underscore',
  'backbone',
  'backbonewreqr',
  'backbonebabysitter',
  'marionette',
  'datef',
  'datef_ru',
], function(text, $, _, Backbone, backbonewreqr, backbonebabysitter, marionette, datef){
  datef.lang('ru');
  window.datef = datef;
  window.Project = new Marionette.Application();
  Project.Classes = {Models: {}, Collections: {}, Views: {}, Layouts: {}, Controllers: {}, Modules: {}};
  Project.Objects = {Models: {}, Collections: {}, Views: {}, Layouts: {}, Controllers: {}, Modules: {}};
  Project.Models = {};
  Project.Collections = {};
  Project.Views = {};
  Project.Layouts = {};
  Project.Controllers = {};
  Project.Helpers = {};
  Project.Temporary = {};
  Project.Templates = {};
  Project.TemplateHelper = (function(html, id){
               var r;   
               $(html).each(function(){
               if($(this).attr("id") == id){r = this}});
               return $(r).html();
               });
  
  Project.RenderTasksGet = {};
  Project.RenderTasksSet = (function(tasks){
    
    var values = [];
    for(i=0;i<tasks.length;i++){
      values[i] = true;
    }
    
    Project.RenderTasksGet = _.object(tasks, values);
    
  });
  Project.RenderStatusGet = {};
  Project.RenderStatusSet = (function(task){
    
    Project.RenderStatusGet[task] = true;
    if(_.isEqual(Project.RenderTasksGet, Project.RenderStatusGet)){
      Project.RenderTasksGet = {};
      Project.RenderStatusGet = {};
      console.log('Tasks complete!');
      $('#lwr').hide();
      $('#mwr').show();
      Project.Router.on('route', function(){$('#mwr').hide();});
    } 
    
  });
  
  window.link = (function(url){
    Project.Router.navigate(url, {trigger: true} );
    return false;
  });
  
  Project.MWR = new Marionette.Region({el: "#mwr"});
  
  Project.on('start', function(){
    
    if(Backbone.history){
        Backbone.history.start({pushState: true});
    }
  });