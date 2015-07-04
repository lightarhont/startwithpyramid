from pyramid.view import view_defaults

from . import *
from testproject.routes.froutes import froutes
from testproject.routes.publicxhr import pfx
import json


@view_defaults(renderer=tpl+'index.pt')
class Index(Public):
    
    def __init__(self, request):
        Public.__init__(self, request, 0)
       
    def index(self):
        
        resultparams = super().resultparams
        
        jslibs = resultparams['jslibs']
        jslibs.append(Public.requirejs(self, 'js/config.js', 'lib/bower_components/require/build/require.js'))
        
        
        csslibs = resultparams['csslibs']
        csslibs.append(Public.csslib(self, 'lib/wysibb/theme/default/wbbtheme.css'))
        csslibs.append(Public.csslib(self, 'lib/blogs/blogs.css'))
        csslibs.append(Public.csslib(self, 'lib/bower_components/colorbox/example4/colorbox.css'))
        
        resultparams['jsglobal'] += '''
        var routes = %s;
        var pfx = '%s';
        ''' % (json.dumps(froutes()), pfx)
        
        return super().prerender(resultparams)