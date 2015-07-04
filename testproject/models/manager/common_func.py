from testproject.models import DBSession
from testproject.models.models import Users

def get_user2(itemid):
    return DBSession.query(Users).filter(Users.id == itemid).one()

def get_user(username):
    user = DBSession.query(Users).filter(Users.username == username).all()
    if user:
        return user[0]
    else:
        return None