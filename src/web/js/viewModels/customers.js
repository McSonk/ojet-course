define(['knockout', 'ojs/ojarraydataprovider', 'jquery',
        'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojtable'], 
        function(ko, ArrayDataProvider, $) { function CustomerViewModel(){
        var self = this;
        this.name = ko.observable();
        this.lastname = ko.observable();
        this.user = ko.observable();
        this.pwd = ko.observable();
        this.repwd = ko.observable();
        this.valores = ko.observableArray();

        this.columns = [ {
              "headerText": 'Nombre',
              "field": "name" }, 
            {
              "headerText": 'Apellido',
              "field": "lastname" },
            {
              "headerText": 'Usuario',
              "field": "user" },
            {
              "headerText": 'Contraseña',
              "field": "pwd" },
            {
              "headerText": 'Confirmar Contraseña',
              "field": "repwd" },    
            {
              "headerText": 'Estatus',
              "field": 'estatus.activado' },
            {
              "headerText": 'Actualizado el',
              "renderer": function(context){
              console.log(context.row);
              return {'insert': context.row.estatus.lastUpdated.toLocaleString()  }
            }}];

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
                name: this.name(),
                lastname: this.lastname(),
                user: this.user(),
                pwd: this.pwd(),
                repwd: this.repwd(),
                estatus: {
                    "activado": true,
                    "lastUpdated": new Date()
                }
            };
            $.ajax({
                'url': 'agregarDato',
                'data': datos,
                'success': function(data){
                    this.valores.push(datos);
                    this.nombre(null);
                    this.apellido(null);
                },
                'error': function(jqXhr, textStatus, errorThrown){
                    console.error("Error\n" + textStatus + ": " + errorThrown);
                }
            });
        }.bind(this);

        this.onModify = function() {
            self.name();
            self.lastname();
            self.user();
            self.pwd();
            self.repwd();
        };

        this.connected = function(){
            console.log('Connected');
        };

        this.disconnected = function(){
            console.log('Disconnected');
        }

        this.init = function(){
            console.log('init');
            return self;
        };
    }
    return new CustomerViewModel().init();
});
