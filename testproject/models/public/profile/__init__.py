from testproject.libs.hash import check_password

def Users_check_password(self, passwd):
        return check_password(self.password, passwd)