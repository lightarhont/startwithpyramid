import datetime
import time

def User_datefromtimestamp(self, dateformat='%Y-%m-%d %H:%M:%S'):
    return str(datetime.datetime.fromtimestamp(self.created).strftime(dateformat))

def User_activityparams(self, activitytime=300, classactiv='useract', classnoactiv='usernoact', dateformat='%Y-%m-%d %H:%M:%S'):
    if (int(time.time()) - self.activity) <= activitytime:
        p1 = classactiv
    else:
        p1 = classnoactiv
    p2 = str(datetime.datetime.fromtimestamp(self.activity).strftime(dateformat))
    return (p1, p2)

def Blocks_datefromtimestamp1(self, classactiv='blockact', classnoactiv='blocknoact', dateformat='%Y-%m-%d %H:%M:%S'):
    if int(time.time()) < self.datestart:
        p1 = classactiv
    else:
        p1 = classnoactiv
    p2 = str(datetime.datetime.fromtimestamp(self.datestart).strftime(dateformat))
    return (p1, p2)

def Blocks_datefromtimestamp2(self, classactiv='blockact', classnoactiv='blocknoact', dateformat='%Y-%m-%d %H:%M:%S'):
    if int(time.time()) < self.dateend:
        p1 = classactiv
    else:
        p1 = classnoactiv
    p2 = str(datetime.datetime.fromtimestamp(self.dateend).strftime(dateformat))
    return (p1, p2)

def shortdesc(self, getsize):
    if len(self.description) >= getsize:
        return self.description[:getsize] + '...'
    else:
        return self.description

def Permissions_shortdesc(self, getsize=68):
    return shortdesc(self, getsize)

def Roles_shortdesc(self, getsize=68):
    return shortdesc(self, getsize)