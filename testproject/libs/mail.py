# -- coding: utf-8 --

import smtplib
import email.utils
from email.mime.text import MIMEText

def sendmail(fromaddr, toaddr, fromname, toname, subj, msg_txt):
    msg = MIMEText(msg_txt, "", "utf-8")
    msg['From'] = email.utils.formataddr((fromname, fromaddr))
    msg['To'] = email.utils.formataddr((toname, toaddr))
    msg['Subject'] = subj
    username = 'mikha-nikiforov'
    password = 'speed1'
    server = smtplib.SMTP('smtp.yandex.ru:587')
    server.starttls()
    server.login(username,password)
    try:
        server.sendmail(fromaddr, toaddr, msg.as_string())
    except smtplib.SMTPDataError as exception:
        logwrite('При отправке сообщения пользователю с адрессом ' + toaddr + ' возникла ошибка ' + smtplib.SMTPDataError.__doc__)
        logwrite(exception)
    except Exception as exception:
        logwrite(exception)
    finally:
        server.quit()

#Лог    
import logging
def logwrite(text):
    log = logging.getLogger(__name__) 
    log.debug(text)