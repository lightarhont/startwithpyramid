def dotjsroutes(config, preurl='/dotjs/manager', routename='dotjsmanager', projectname='testproject', templatesfolder='templates', dotjspath='/manager/dotjstpls'):
    import os
    from pyramid.path import AssetResolver
    
    def tplpath():
        a = AssetResolver(projectname)
        resolver = a.resolve(templatesfolder)
        return resolver.abspath()
    
    cat = tplpath() + dotjspath
    pre = projectname + ':' + templatesfolder + dotjspath
    path_f = []
    
    def funcconstructor(self, request):
        self.request = request
    
    def funcclass(self):
        return {}

    i=0
    for d, dirs, files in os.walk(cat):
        for f in files:
            i = i + 1
            classname = 'classx' + str(i)
            funcname = 'funcx' + str(i)
            newclass = type(classname, (), {'__init__': funcconstructor, funcname: funcclass})        
            path = os.path.join(d,f)
            filein = path.split(cat)[1]
            path = pre + filein
            config.add_route(routename + str(i), preurl +filein.split('.')[0])
            config.add_view(eval('newclass.' + funcname), route_name=routename + str(i), renderer=path)
    
    return config