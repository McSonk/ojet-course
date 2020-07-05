from pyramid.view import view_config
from pyramid.response import FileResponse
from pathlib import Path
from pam.db.dao import EmployeeDao
from pam.db.models import Employee

import logging

logger = logging.getLogger(__name__)

@view_config(route_name='personas', renderer='json', request_method='POST')
def id_ejemplo(request):
    logger.debug(request.params)
    # Si nombre no existe, regresa None

    employee = Employee()
    employee.name = request.params.get('nombre')
    employee.id_area = 1

    EmployeeDao(request).add(employee)

    activated = request.params.get('estatus[lastUpdated]')

    return {
        'nombre': request.params.get('nombre'),
        'activated': activated
    }

@view_config(route_name='personas', renderer='json', request_method='GET')
def retrieve_fake_data(request):
    return EmployeeDao(request).fetch_all()

@view_config(route_name='get_persona_info', renderer='json', request_method='GET')
def get_persona_info(request):
    id = request.matchdict.get('id_persona')

    employee = EmployeeDao(request).get_by_id(id)

    # update
    employee.last_first = 'Villegas'

    logger.debug('idPersona: %s', id)
    return employee

@view_config(route_name='home')
def home(request):
    p = Path(__file__)
    file_location = p.parent.parent.parent.parent.joinpath('web/index.html')
    return FileResponse(file_location, request=request, content_type='text/html')
