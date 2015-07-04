var invertroutes = _.invert(routes);
invertroutes[''] = "index";
Project.Router = new Marionette.AppRouter({
controller: Project.Controllers.MainControllerObj,
appRoutes: invertroutes
});