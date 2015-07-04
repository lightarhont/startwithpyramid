from pyramid.view import view_config
from . import *

#Нужно для загрузки файлов
import os
import uuid
import shutil
import time
from pyramid.response import Response
from PIL import Image

#Параметры
preurl = m_statictmp + 'ajaxuploadimg/'
preurlcrop = preurl + 'crop/'
storagepath =  m_staticpath() + preurl
pathcrop = storagepath + 'crop/'
basewidth = 750
timelife = 3600

#Загружает окно загрузки файла
@view_config(route_name='ajaxuploadimgindex',  renderer=m_tpl + 'ajaxuploadimg.pt')
def auindex(request):
    id = request.matchdict['img']
    func = request.matchdict['func']
    url = request.route_url('home')
    crop = request.matchdict['crop']
    width = request.matchdict['width']
    height = request.matchdict['height']
    
    return {'id': id,
            'func': func,
            'url': url,
            'crop': crop,
            'staticfiles': m_staticfilesfolder,
            'preurl': preurl,
            'preurlcrop': preurlcrop,
            'width': width,
            'height': height,
            'stpath': request.static_url(m_staticpreurl)}

#Загружает файл изображения
@view_config(route_name='ajaxuploadimghandler')
def auhandler(request):
    
    filename = request.POST['loadfile'].filename
    ext = filename.split('.')[-1]
    
    input_file = request.POST['loadfile'].file
    
    filetmp = '%s.' % uuid.uuid4()
    file_path = os.path.join(systemtmp, filetmp + ext)
    
    temp_file_path = file_path + '~'
    output_file = open(temp_file_path, 'wb')
    
    input_file.seek(0)
    while True:
        data = input_file.read(2<<16)
        if not data:
            break
        output_file.write(data)
    
    output_file.close()
    os.rename(temp_file_path, file_path)
    
    original = Image.open(file_path)
    width  = original.size[0]
    height = original.size[1]
    
    if width>basewidth:
        wpercent = (basewidth/float(width))
        hsize = int((float(height)*float(wpercent)))
        #Меняем размер и сохраняем
        original.resize((basewidth,hsize), Image.ANTIALIAS).save(file_path)
        width = basewidth
    
    #Перемещение
    strtime = str(time.time())
    sectime = strtime.split('.')[0]
    
    newfilename = sectime + '_' + filename
    mvpath = storagepath + newfilename
    
    try:
        shutil.move(file_path, mvpath)
    except IOError:
        logwrite('Невозможно переместить файл!')
        raise
    
    jsobj = '''{'filename':'%s', 'width':'%s'}''' % (newfilename, width)
    #Очистка временных файлов
    clearfiles(storagepath)
    
    return Response(body=jsonresponse(jsobj), content_type='text/html')

#Формат отображения вывода
def jsonresponse(obj):
    result = '''
       <script type="text/javascript">
        window.parent.onResponse("%s");
       </script>
       ''' % obj
    return result

#Обрезает файл изображения
@view_config(route_name='ajaxuploadimgcrop')
def crop(request):
    
    #POST
    post = request.POST.mixed()
    
    file = storagepath + post['image']
    if os.path.exists(file) and os.path.isfile(file):
        #GET
        width = int(request.matchdict['width'])
        height = int(request.matchdict['height'])
        original = Image.open(file)
        w = int(round(float(post['w'])))
        h = int(round(float(post['h'])))
        x = int(round(float(post['x'])))
        y = int(round(float(post['y'])))
        savefile = pathcrop + post['image']
        #Обрезаем, меняем размер и сохраняем
        original.crop((x, y, w+x, h+y)).resize((width, height), Image.ANTIALIAS).save(savefile)
        #Очистка временных файлов
        clearfiles(pathcrop)
        
        return Response(body=post['image'], content_type='text/html')

#Функция удаляет старые несохранённые файлы
def clearfiles(path):
    content = ''
    for filename in os.listdir(path):
        if os.path.isfile(path + filename):
            created = int(filename.split('_')[0])
            strtime = str(time.time())
            sectime = int(strtime.split('.')[0])
        
            if created < (sectime - timelife):
                try:
                    os.remove(path + filename)
                except IOError:
                    logwrite('Невозможно удалить файл!')
                    raise

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)
