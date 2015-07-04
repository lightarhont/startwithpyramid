import datetime

def Post_datefromtimestamp(self, dateformat='%Y-%m-%d %H:%M:%S'):
    return str(datetime.datetime.fromtimestamp(self.created).strftime(dateformat))

def Post_datefromtimestamp2(self, dateformat='%Y-%m-%d %H:%M:%S'):
    return str(datetime.datetime.fromtimestamp(self.last_edited).strftime(dateformat))