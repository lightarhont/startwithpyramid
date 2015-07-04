from .manager import manager

def routes():
    routes = [
    ['sitemap', '/sitemap.xml'],
    #ajaxuploadimg
    ['ajaxuploadimgindex', '/ajaxuploadimg/index/{func}/{img}/{crop}/{width}/{height}'],
    ['ajaxuploadimghandler', '/ajaxuploadimg/handler'],
    ['ajaxuploadimgcrop', '/ajaxuploadimg/crop/{width}/{height}'],
    #user avatar tmp
    ['uatmp', '/uatmp/{userid}'],
    
    ['restuser', '/comments/restuser'],
    
    #Manager
    ['manager', '/manager'],
    ]
    
    routes = routes+manager
    
    return routes