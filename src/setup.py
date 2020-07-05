"""Does all the setup configuration (mostly package dependencies)
for the correct developing of the application.
Install all the required packages by doing:
$VENV/pip install -e .
(being in the "ctr/src" directory)
"""
from setuptools import setup

__version__ = "1.1"

REQUIRED_PACKAGES = [
    #Pyramid framework
    'pyramid',
    #Pyramid debug toolbar (red square)
    'pyramid_debugtoolbar',
    #Pyramid Transaction Manager
   'pyramid_tm',
   #Python ORM
   'sqlalchemy',
   'zope.sqlalchemy',
    #ODBC for postgres
    'psycopg2'
]

setup(name='pam',
      version=__version__,
      install_requires=REQUIRED_PACKAGES,
      entry_points="""\
      [paste.app_factory]
      main = pam:main
      """,
)
