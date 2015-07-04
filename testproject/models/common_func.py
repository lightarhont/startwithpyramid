import transaction
import time

from testproject.models import DBSession
from testproject.models.models import Users, Blocks

def get_user(itemid):
    return DBSession.query(Users).filter(Users.id == itemid).one()

def activity_user(itemid):
    user = get_user(itemid)
    user.activity = time.time()
    try:
        transaction.commit()
    except:
        transaction.rollback()

def get_userblocks(id):
     return DBSession.query(Blocks).filter(Blocks.user_id == id).all()