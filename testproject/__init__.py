from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

from .models import (DBSession,Base)

from pyramid.session import UnencryptedCookieSessionFactoryConfig
sessioncode = 'hidenmysecret'
my_session_factory = UnencryptedCookieSessionFactoryConfig(sessioncode)

from testproject.routes import getroutes

#from .security import groupfinder

#MongoDB
#from gridfs import GridFS
#import pymongo

def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    authn_policy = AuthTktAuthenticationPolicy(sessioncode)
    authz_policy = ACLAuthorizationPolicy()
    config = Configurator(settings=settings)
    config = Configurator(session_factory = my_session_factory)
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)
    config.include('pyramid_chameleon')
    config.include('pyramid_debugtoolbar')
    config = getroutes(config)
    config.scan()
    return config.make_wsgi_app()
