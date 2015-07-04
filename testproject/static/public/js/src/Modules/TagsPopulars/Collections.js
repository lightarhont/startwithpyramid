define(['./Models',],function(){

var tpm = Project.Classes.Modules.TagsPopulars;

tpm.TagsCollection = Backbone.Collection.extend({
    model: tpm.TagModel,
    url: function(){
        return pfx+'blogs/alltags';
    },
});

tpm.PopularsCollection = Backbone.Collection.extend({
    model: tpm.PopularModel,
    url: function(){
        return pfx+'blogs/populars';
    },
});

return Project;
});