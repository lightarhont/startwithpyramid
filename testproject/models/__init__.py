# -*- encoding: utf-8 -*-

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    )

from zope.sqlalchemy import ZopeTransactionExtension

from sqlalchemy.ext.declarative import declarative_base

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension(), autocommit=False, expire_on_commit=False))
Base = declarative_base()


def setopt(o, n, f):
    if n in o.__dict__:
        try:
            delattr(o, n)
        except:
            logwrite('Setopt не удалось удалить атрибут!')
        try:
            setattr(o, n, f)
        except:
            logwrite('Setopt не удалось добавить атрибут!')
    else:
        try:
            setattr(o, n, f)
        except:
            logwrite('Setopt не удалось добавить атрибут!')

def setall(arr):
    for e in arr:
        setopt(e[0], e[1], e[2])

import datetime
def SiteMap_datefromtimestamp(self, dateformat='%Y-%m-%d'):
    return str(datetime.datetime.fromtimestamp(self.lastmodifed).strftime(dateformat))

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)