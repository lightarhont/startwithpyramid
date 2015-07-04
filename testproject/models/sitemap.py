from . import DBSession, setopt, SiteMap_datefromtimestamp
from .models import SiteMap

def get_sitemap():
    setopt(SiteMap, 'lastmodfromtimestamp', SiteMap_datefromtimestamp)
    return DBSession.query(SiteMap).all();