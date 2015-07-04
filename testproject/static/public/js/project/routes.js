define(['./controllers'], function(){

//var values = _.values(routes);
//var keys = _.keys(routes);
//for(i=0;i<values.length;i++){
//  values[i] = values[i];
//}
//routes = _.object(keys, values); 
var invertroutes = _.invert(routes);
invertroutes[''] = "index";
  
Project.Router = new Marionette.AppRouter({
  
  controller: Project.Controllers.MainControllerObj,
  
  appRoutes: invertroutes
  });

  return Project;

});
