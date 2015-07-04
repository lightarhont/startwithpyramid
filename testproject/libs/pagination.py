from pypages import Paginator

def pagination(total, per_page, page, range_num):
    objects = range(per_page)
    p = Paginator(total, per_page=per_page, current=page, range_num=range_num)
    p.objects = objects
    return p

def getoffset(per_page, page):
    return per_page*page-per_page

def getlimit(per_page, page, total):
    offset = getoffset(per_page, page)
    if (offset + per_page) <= total:
        limit = offset + per_page
    else:
        limit = total
    return limit