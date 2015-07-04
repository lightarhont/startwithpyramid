import transaction
import time

from testproject.models import setopt, DBSession
from testproject.models.models import Users, AccessLog
from . import Users_check_password

def get_user(username):
    setopt(Users, 'check_password', Users_check_password)
    user = DBSession.query(Users).filter(Users.username == username).all()
    if user:
        return user[0]
    else:
        return None

def new_accesslog(ip, e=1, u=0):
    
    l = AccessLog(ip, e, user_id=u)
    DBSession.add(l)
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False

def get_accesslog_badlogin(ip, e=1, t=180, attempt=3):
    
    ls = DBSession.query(AccessLog).filter(AccessLog.event_id == e).filter(AccessLog.ip == ip).filter(AccessLog.eventdate > int(time.time())-180).count()
    if ls < attempt:
        return True
    else:
        return False