import time
from testproject.models.common_func import get_userblocks

#Возвращает список id привелегий    
def userpermission(user):
    
    pid = []
    blockslist = []
    
    if len(user.roles) != 0:
        for r in user.roles:
            for p in r.permissions:
                pid.append(p.id)
    
        pid = list(set(pid))
        
        blocks = get_userblocks(user.id)
        
        if blocks:
            
            for b in blocks:
                if int(time.time()) < b.dateend:
                    blockslist.append(b.permission_id)
                
            if len(blockslist) != 0:
                for e in blockslist:
                    pid.remove(e)
        else:
            pass
    
    return (pid, blockslist)