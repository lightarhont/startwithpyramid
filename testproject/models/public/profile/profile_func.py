from testproject.models import setopt, DBSession
from testproject.models.models import Users, Profiles
from testproject.libs.hash import hash_password
from . import Users_check_password

import transaction

def get_userprofile(userid):
    return DBSession.query(Profiles).filter(Profiles.userid == userid).one()

def put_userprofile(userid, post):
    p = DBSession.query(Profiles).filter(Profiles.userid == userid).one()
    
    p.fullname = post['fullname']
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return True

def set_userpassword(post):
    setopt(Users, 'check_password', Users_check_password)
    user = DBSession.query(Users).filter(Users.id == post['userid']).one()
    if user.check_password(post['oldpassword']):
        user.password = hash_password(post['password'])
        
        try:
            transaction.commit()
        except:
            DBSession.rollback()
            return False
        else:
            return 1
        
    else:
        return 2

def db_set_avatar(post):
    p = DBSession.query(Profiles).filter(Profiles.userid == post['id']).all()
    if not p[0]:
        return False
    p[0].avatar1 = post['avatarsource']
    p[0].avatar2 = post['avatarsize1']
    p[0].avatar3 = post['avatarsize2']
    
    try:
        transaction.commit()
    except:
        DBSession.rollback()
        return False
    else:
        return True

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)