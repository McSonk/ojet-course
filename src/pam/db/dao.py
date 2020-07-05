
from pam.db.models import Employee

from sqlalchemy import or_

class EmployeeDao():

    def __init__(self, request):
        self.session = request.dbsession

    def add(self, employee):
        self.session.add(employee)

    def get_by_id(self, id) -> Employee:
        return self.session.query(Employee).filter(Employee.id == id).one_or_none()



    def fetch_all(self):
        return self.session.query(Employee).filter(or_(Employee.status == True, Employee.id_area == 1)).all()

