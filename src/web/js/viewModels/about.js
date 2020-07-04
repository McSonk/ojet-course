define(['knockout', 'ojs/ojarraydataprovider', 'jquery',
        'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojtable'], 
function(ko, ArrayDataProvider, $){
    function AboutVM(){
        var self = this;
        this.nombre = ko.observable();
        this.apellido = ko.observable();
        this.valores = ko.observableArray();

        this.columns = [
            {
                "headerText": 'Nombre',
                "field": "nombre"
            },
            {
                "headerText": 'Apellido',
                "field": "apellido"
            },
            {
                "headerText": 'Estatus',
                "field": 'estatus.activado'
            },
            {
                "headerText": 'Actualizado el',
                "renderer": function(context){
                    console.log(context.row);
                    return {'insert': context.row.estatus.lastUpdated.toLocaleString()  }
                }
            }
        ];

        this.dataProvider = new ArrayDataProvider(this.valores, {keyAttributes: 'apellido'});

        /**
         * Disparada cuando el valor de la variable "nombre" cambia
         * @param {string} newValue El valor actualizado de la variable
         */
        var _onNombreUpdated = function(newValue){
            console.log("El nuevo valor es: " + newValue);
        };

        this.nombre.subscribe(_onNombreUpdated);

        this.onAccept = function(){
            var datos = {
                nombre: this.nombre(),
                apellido: this.apellido(),
                estatus: {
                    "activado": true,
                    "lastUpdated": new Date()
                }
            };
            $.ajax({
                'url': 'persona/',
                'method': 'post',
                'data': datos,
                'success': function(data){
                    this.valores.push(datos);
                    this.nombre(null);
                    this.apellido(null);
                },
                'error': function(jqXhr, textStatus, errorThrown){
                    console.error("Algo paso al agregar usuario\n" + textStatus + ": " + errorThrown);
                }
            });
        }.bind(this);

        this.onModify = function(){
            self.nombre('El villegas lokote');
            self.apellido("Lokote chacka");
        };

        this.connected = function(){
            $.ajax({
                url: 'persona/',
                method: 'get',
                success: function(data){
                    self.valores(data);
                    $.ajax({
                        url: 'persona/1/',
                        success: function(data){
                            console.log(data);
                        }
                    });
                }
            });
        };

        this.disconnected = function(){
            self.valores.removeAll();
        }

        this.init = function(){
            console.log('init');
            return self;
        };

    }


    return new AboutVM().init();

});

