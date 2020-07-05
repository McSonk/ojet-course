from sqlalchemy import (Boolean, Column, Date, DateTime, ForeignKey, Integer,
                        LargeBinary, MetaData, Numeric, String)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, deferred
from sqlalchemy.sql import func

import logging

logger = logging.getLogger(__name__)

#Indicar que todas las tablas estan en el schema ""
mymetadata = MetaData(schema="controles_schm")
Base = declarative_base(metadata=mymetadata)


class Employee(Base):
    __tablename__ = 'employee'
    id = Column('id_employee', Integer, primary_key=True)
    id_area = Column(Integer)
    id_user  = Column(Integer)
    name = Column(String)
    last_first = Column(String)
    last_second = Column(String)
    status = Column(Boolean)
    creation_user = Column(String)
    creation_date = Column(DateTime)
    modification_user = Column(String)
    modification_date = Column(DateTime)

    def __json__(self, request):
        return {
            'id': self.id,
            'idArea': self.id_area,
            'name': self.name,
            'lastFirst': self.last_first,
            'creationDate': str(self.creation_date)
        }

