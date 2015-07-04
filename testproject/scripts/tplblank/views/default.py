from pyramid.view import view_config, view_defaults
from .common import *

appconfig = {}

class Custom(Manager):
    
    def __init__(self, request):
        Manager.__init__(self, request, 0)
        self.request = request
        
    @view_config(renderer=tpl+'roles.pt', match_param=('p1=options', 'p2=control', 'p3=roles'))
    def roles(self):
        resultparams = super().resultparams
        
        return super().prerender(resultparams)
