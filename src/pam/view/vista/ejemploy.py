from pyramid.view import view_config
from pyramid.response import FileResponse
from pathlib import Path

import logging

logger = logging.getLogger(__name__)

@view_config(route_name='personas', renderer='json', request_method='POST')
def id_ejemplo(request):
    logger.debug(request.params)
    # Si nombre no existe, regresa None
    nombre = request.params.get('nombre')
    activated = request.params.get('estatus[lastUpdated]')

    return {
        'nombre': nombre,
        'activated': activated
    }

@view_config(route_name='personas', renderer='json', request_method='GET')
def retrieve_fake_data(request):
    data = []
    data.append({
        'nombre': 'Angel',
        'apellido': 'Ramirez',
        'estatus': {
            'activado': True,
            'lastUpdated': 'Hoy'
        }
    })
    return data

@view_config(route_name='get_persona_info', renderer='json', request_method='GET')
def get_persona_info(request):
    id = request.matchdict.get('id_persona')
    logger.debug('idPersona: %s', id)
    return {
        'id': id
    }

@view_config(route_name='home')
def home(request):
    p = Path(__file__)
    file_location = p.parent.parent.parent.parent.joinpath('web/index.html')
    return FileResponse(file_location, request=request, content_type='text/html')
