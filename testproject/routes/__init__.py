from .routeslist import routes
from .publicxhr import publicxhr
from .dotjsroutes import dotjsroutes
from .froutes import broutes

from testproject.views.public.index import Index

def getroutes(config):

    config.add_static_view('static', 'static', cache_max_age=3600)
        
    for r in routes():
        config.add_route(r[0], r[1])
    
    for r in publicxhr:
        config.add_route(r[0], r[1], xhr=True)
    
    config.add_route('home', '/')
    config.add_view(Index, attr='index', route_name='home' )
        
    for e in broutes.items():
        config.add_route(e[0], e[1])
        config.add_view(Index, attr='index', route_name=e[0])
    
    config = dotjsroutes(config)
    
    config.add_route('test', '/test')
    return config


