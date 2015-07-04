from testproject.models import setopt, DBSession
from testproject.models.models import Users, Profiles, RolesUsers, UsersActivation, PostTags, Blogs
from . import Users_check_password
from testproject.libs.hash import hash_password
import transaction
import time
from sqlalchemy import or_

def get_user(userid):
    setopt(Users, 'check_password', Users_check_password)
    user = DBSession.query(Users).filter(Users.id == userid).all()
    if user:
        return user[0]
    else:
        return None
    
def get_user2(username):
    setopt(Users, 'check_password', Users_check_password)
    user = DBSession.query(Users).filter(Users.username == username).all()
    if user:
        return user[0]
    else:
        return None

def db_get_useractivation(post, roles):
    ua = DBSession.query(UsersActivation).filter(UsersActivation.code == post['ticket']).all()
    if ua:
        DBSession.query(RolesUsers).filter(RolesUsers.user_id == ua[0].userid).delete()
        for e in roles:
            ru = RolesUsers(ua[0].userid, e)
            DBSession.add(ru)
        
        try:
            transaction.commit()
        except:
            DBSession.rollback()
            return False
        else:
            return True
        
        return ua[0]
    else:
        return None

def db_put_user(post, roles, token):
    user = DBSession.query(Users).filter(or_(Users.username == post['username'], Users.email == post['email'])).all()
    if not user:
        ts = time.time()
        DBSession.autoflush = False
        addprofiles = Profiles(post['fullname'], '', '', '')
        usersactivation = UsersActivation(token, ts)
        u = Users(post['username'], post['email'], hash_password(post['password']), ts, 1, addprofiles, usersactivation=usersactivation)
    
        DBSession.add(u)
        DBSession.flush()
        DBSession.refresh(u)
    
        for e in roles:
            ru = RolesUsers(u.id, e)
            DBSession.add(ru)
            DBSession.flush()
    
        try:
            transaction.commit()
        except:
            DBSession.rollback()
            return False
        else:
            return True
    else:
        return 3


        
#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)