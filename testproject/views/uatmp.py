
from pyramid.view import view_config
from . import *

userstmpimgfolder = 'uatmp/'
fuserstmpimgfolder = m_staticpath() + m_statictmp + userstmpimgfolder
size1width = 200
size1height = 200
size2width = 100
size2height = 100
colorformat = 'RGBA'
backgroundcolor = (255, 255, 255, 0)
fileformat = 'png'
sourcefilename = 'source'
cropfilename = 'crop'

import os
import shutil
from PIL import Image
from testproject.views.ajaxuploadimg import storagepath, pathcrop

#Основной контроллер
@view_config(route_name='uatmp', renderer='json', xhr=True)
def imgtmp(request):
    userid = request.matchdict['userid']
    iduserabspath = fuserstmpimgfolder + userid + '/'
    
    if not os.path.isdir(iduserabspath):
        try:
            os.mkdir(iduserabspath)
        except IOError:
            logwrite("Каталог не был создан!")
            raise 
    
    post = request.POST.mixed()
    img = post['image'].split('/')[-1]
    ext = img.split('.')[-1]
    
    imgpath = storagepath + img
    
    newfilename = sourcefilename + '.' + ext
    newfilesourceabspath = iduserabspath + newfilename
    
    #Перемещаем
    try:
        shutil.move(imgpath, newfilesourceabspath)
    except IOError:
        logwrite("Переместить не получилось!")
        raise 
        
    size1 = urlpath(newfilename, userid)
    
    newfilename = cropfilename + '.' + ext
    newfilecropabspath = iduserabspath + newfilename
    
    if post['status'] == '2':
        imgpath = pathcrop + img
        
        #Перемещаем
        try:
            shutil.move(imgpath, newfilecropabspath)
        except IOError:
            logwrite("Переместить не получилось!")
            raise 
    else:
        #Копируем
        try:
            shutil.copy(newfilesourceabspath, newfilecropabspath)
        except IOError:
            logwrite("Копирование не получилось!")
            raise 
    
    #size1
    size2 = urlpath(buildimg(size1width, size1height, newfilecropabspath,  iduserabspath), userid)
    
    #size2
    size3 = urlpath(buildimg(size2width, size2height, newfilecropabspath, iduserabspath), userid)
    
    return {'size1' : size1, 'size2' : size2, 'size3' : size3}

#Строим изображения по параметрам
def buildimg(basewidth, baseheight, cropsource, workpath):
    try:
        original = Image.open(cropsource)
    except IOError:
        logwrite("Открыть не получилось!")
        raise 
    
    width  = original.size[0]
    height = original.size[1]
    
    newfilename = str(basewidth) + 'x' + str(baseheight) + '.' + fileformat
    targetpath = workpath+newfilename
    
    if float(basewidth/baseheight) == float(width/height):
        try:
            original.resize((basewidth, baseheight), Image.ANTIALIAS).save(targetpath)
        except IOError:
            logwrite("Сохранить не получилось!")
            raise
    else:
        original.thumbnail((basewidth,baseheight), Image.ANTIALIAS)
    
        width  = original.size[0]
        height = original.size[1]
    
        background = Image.new(colorformat, (basewidth,baseheight), backgroundcolor)
        param1 = int(round((basewidth - width) / 2))
        param2 = int(round((baseheight - height) / 2))
        background.paste(original, (param1, param2))
        try:
            background.save(targetpath)
        except IOError:
            logwrite("Сохранить не получилось!")
            raise 
    
    return newfilename

#Относительный путь
def urlpath(filename, userid):
    return m_staticfilesfolder + m_statictmp + userstmpimgfolder + userid + '/' + filename

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)