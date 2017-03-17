//Constantes
//@[@"AMS", @"Capacitacion", @"Cloud", @"Consultoria", @"Producto", @"SolutionCenter", @"Staffing"];

//FORMATO FECHA:
//21-12-2016
//Dia-Mes-Año

const AMS = "AMS";
const CAPACITACION = "Capacitacion";
const CLOUD = "Cloud";
const CONSULTORIA = "Consultoria";
const PRODUCTO = "Producto";
const SOLUTIONCENTER = "SolutionCenter";
const STAFFING = "Staffing";


function Utilities(){}

Utilities.prototype.ei=1;

// grab the packages we need
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/encuestas');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to DB");
});

var encuestaSchema = mongoose.Schema({
    tipoEncuesta:     		String,
    fechaAplicacion:  		Date,
    DN:               		[String],
    nombreCliente: 				String,					//Ejemplo: FerroMex
    nombreUsuario: 				String, 				//Ejemplo: Juan Manuel Rodriguez
    promedioEncuesta:			Number,
    serviciosFuturos: 		[String],
    usuarioAltaGerencia: 	Boolean,
    CG : 									[String], 			//Comentarios Generales
    SG : 									[String], 			//Servicios Generales
    adquirirSG : 					String,
    serviciosProyecto : 	[String],
    respuestas : 					[Number],
    comentarios : [[String, String]]
    //p1:               Number
    // p8:               Number,
    // p9:               Number,
    
});

Utilities.prototype.encuestaModel = mongoose.model('tipoEncuesta', encuestaSchema);

Utilities.prototype.getAllEncuestas = function(){
	//devuelve una lista con todas las encuestas
	console.log("getAllEncuestas")

	var e = this.encuestaModel;

	return new Promise( function(resolve, reject) {
  	e.find(function (err, encuestas) {
    	if (err) reject(err);
    	resolve(encuestas);
  	});
  });
}

Utilities.prototype.filterEncuestasByType = function(tipo, encuestas) {
	//Si recibe una lista de encuestas, aplica el filtro sobre dicha lista, sino
	//el filtro se aplica sobre todas las encuestas
	//TODO: revisar string formatting
	console.log("filterEncuestasByType");
	console.log(tipo);
	if(!encuestas) {
		var e = this.encuestaModel;
		//Usamos Promises para manejar la función asíncrona
		return new Promise( function(resolve, reject) {
			e.find({ tipoEncuesta: tipo }, function(err, encuestas) {
    		if (err) reject(err);
    		resolve(encuestas);
    	});
    });
  //Hacemos el filtro en base a las encuestas que recibimos
	} else {
		function filtroTipo(encuesta) {
			var tipoEncuesta = encuesta.tipoEncuesta;
			return tipoEncuesta == tipo;
		}

		return new Promise( function(resolve,reject) {
			resolve(encuestas.filter(filtroTipo));
		});
	}
}

Utilities.prototype.filterEncuestasByDN = function(DNBusqueda, encuestas) {
	//Si recibe una lista de encuestas, aplica el filtro sobre dicha lista, sino
	//el filtro se aplica sobre todas las encuestas

	console.log("filterEncuestasByDN");
	console.log(DNBusqueda);
	if(!encuestas) {
		var e = this.encuestaModel;
		//Usamos Promises para manejar la función asíncrona
		return new Promise( function(resolve, reject) {
			e.find({DN:DNBusqueda}, function(err, encuestas) {
    		if (err) reject(err);
    		resolve(encuestas);
    	});
		});
	//Hacemos el filtro en base a las encuestas que recibimos
	} else {
		function filtroDN(encuesta) {
			var dn = encuesta.DN;
			return contains(dn, DNBusqueda);
		}

		return new Promise( function(resolve,reject) {
			resolve(encuestas.filter(filtroDN));
		});
	}
}

Utilities.prototype.filterEncuestasByDate = function(fechaInicio, fechaFin, encuestas) {

	console.log("filterEncuestasByDate");
	console.log(fechaInicio, fechaFin);

	// var fInicio = this.stringToDate(fechaInicio);
	// var fFin = this.stringToDate(fechaFin);
	var fInicio = new Date(fechaInicio);
	var fFin = new Date(fechaFin);
	console.log(fInicio, fFin);
	if(!encuestas) {
		var e = this.encuestaModel;
		//Usamos Promises para manejar la función asíncrona
		return new Promise( function(resolve, reject) {
			e.find({fechaAplicacion: {$gt: fInicio,$lt:fFin}}, function(err, encuestas){
				if (err) reject(error);
				resolve(encuestas);
			});
		});
		//Hacemos el filtro en base a las encuestas que recibimos
	} else {
		function filtroFecha(encuesta) {
			var fechaEncuesta = new Date(encuesta.fechaAplicacion);
			return fechaEncuesta.getTime() > fInicio.getTime() && fechaEncuesta.getTime() < fFin.getTime();
		}

		return new Promise( function(resolve,reject) {
			resolve(encuestas.filter(filtroFecha));
		});
	}
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

Utilities.prototype.stringToDate = function(string) {
	//El string está formado por AAAA-MM-DD, necesitamos convertirlo a DD-MM-AAAA
	//El -1 es porque en javascript el conteo de meses empieza en cero
	var parts =string.split('-');
	var date = new Date(parts[2],parts[1]-1,parts[0]); 
	return date;
}

Utilities.prototype.getAllEncuestasGroupBy = function() {
	//devuelve una lista con todas las encuestas ordenadas por nombre del cliente
	console.log("getAllEncuestasGroupBy")
  this.encuestaModel.find({}, {}, {"sort": "nombreCliente"}, function (err, encuestas) {
    if (err) return console.error(err);
    console.log(encuestas);
    return encuestas;
  });
}

Utilities.prototype.getAllEncuestasSorted = function() {
	//devuelve una lista con todas las encuestas ordenadas por promedio
	console.log("getAllEncuestasSorted")
  this.encuestaModel.find({}, {}, {"sort": "promedioEncuesta"}, function (err, encuestas) {
    if (err) return console.error(err);
    console.log(encuestas);
    return encuestas;
  });
}

Utilities.prototype.getAllEncuestasSortedPromise = function() {
	//devuelve una lista con todas las encuestas ordenadas por promedio
	console.log("getAllEncuestasSortedPromise")

	var e = this.encuestaModel;
	return new Promise( function(resolve, reject) {
	  e.find({}, {}, {"sort": "promedioEncuesta"}, function (err, encuestas) {
	    if (err) reject(err);
	    //console.log(encuestas);
	    resolve(encuestas);
	  });
	});
}

Utilities.prototype.groupEncuestasByType = function(encuestas) {

	console.log("groupEncuestasByType");
	//Devuelve un diccionario con todas las encuestas ordenadas por tipo
	//@[@"AMS", @"Capacitacion", @"Cloud", @"Consultoria", @"Producto", @"SolutionCenter", @"Staffing"];
	var diccionarioEncuestas = {};
	diccionarioEncuestas.encuestasAMS = [];
	diccionarioEncuestas.encuestasCapacitacion = [];
	diccionarioEncuestas.encuestasCloud = [];
	diccionarioEncuestas.encuestasConsultoria = [];
	diccionarioEncuestas.encuestasProducto = [];
	diccionarioEncuestas.encuestasSolutionCenter = [];
	diccionarioEncuestas.encuestasStaffing = [];

	for (var i = encuestas.length - 1; i >= 0; i--) {
		var e = encuestas[i];

		if (e.tipoEncuesta == AMS) {
			diccionarioEncuestas.encuestasAMS.push(e);
		} else if(e.tipoEncuesta == CAPACITACION) {
			diccionarioEncuestas.encuestasCapacitacion.push(e);
		} else if(e.tipoEncuesta == CLOUD) {
			diccionarioEncuestas.encuestasCloud.push(e);
		} else if(e.tipoEncuesta == CONSULTORIA) {
			diccionarioEncuestas.encuestasConsultoria.push(e);
		} else if(e.tipoEncuesta == PRODUCTO) {
			diccionarioEncuestas.encuestasProducto.push(e);
		} else if(e.tipoEncuesta == SOLUTIONCENTER) {
			diccionarioEncuestas.encuestasSolutionCenter.push(e);
		} else if(e.tipoEncuesta == STAFFING) {
			diccionarioEncuestas.encuestasStaffing.push(e);
		} else {
			console.log("Encuesta de tipo desconocido");
		}
	};

	return diccionarioEncuestas;
}

Utilities.prototype.getAverage = function(encuestas) {
	total = 0;
	for (var i = encuestas.length - 1; i >= 0; i--) {

		if(encuestas[i].promedioEncuesta) {
			total += encuestas[i].promedioEncuesta;
		}
	};
	return total/encuestas.length;
}

Utilities.prototype.separarPorDN = function(encuestas) {

	//Como cada encuesta puede pertenecer a una o varias DNS, lo primero 
	//Que necesitamos hacer al generar promedios por DN es separarlas
	//Esta funcion devuelve un diccionario con cada DN como llave, como valor de cada DN 
	//Devuelve un arreglo con cada encuesta que pertenezca a la DN llave
	var diccionario = {};
	for (var i = encuestas.length - 1; i >= 0; i--) {
		var e = encuestas[i];
		for (var j = e.DN.length - 1; j >= 0; j--) {
			var dn = e.DN[j]

			if(!diccionario[dn]) {
				diccionario[dn] = []
				diccionario[dn][AMS] = {total : 0, acumulativo: 0, promedio: 0};
				diccionario[dn][CAPACITACION] = {total : 0, acumulativo: 0, promedio: 0}
				diccionario[dn][CLOUD] = {total : 0, acumulativo: 0, promedio: 0}
				diccionario[dn][CONSULTORIA] = {total : 0, acumulativo: 0, promedio: 0}
				diccionario[dn][PRODUCTO] = {total : 0, acumulativo: 0, promedio: 0}
				diccionario[dn][SOLUTIONCENTER] = {total : 0, acumulativo: 0, promedio: 0}
				diccionario[dn][STAFFING] = {total : 0, acumulativo: 0, promedio: 0}
			}
			if(e.tipoEncuesta && e.promedioEncuesta){
				diccionario[dn][e.tipoEncuesta].total+=1;
				diccionario[dn][e.tipoEncuesta].acumulativo+=e.promedioEncuesta;
			}
		
		};
	};
	console.log(diccionario);
	return diccionario;
}

Utilities.prototype.filtrarPorComentarios = function(encuestas) {
	var arr = [];
	var c = 0;
	for(var i = 0; i < encuestas.length; i++) {
		var encuesta = encuestas[i];
		if(encuesta.comentarios.length > 0) {
			arr[c] = encuesta;
			c = c + 1;
		}
	}
	return arr;
}

Utilities.prototype.obtenerServiciosFuturos = function(encuestas) {

	var diccionario = {};

	for(var i = encuestas.length - 1; i >= 0; i--) {
		var encuesta = encuestas[i];

		//Al obtener la encuesta, iteramos sobre los servicios futuros, si no existen
		//en el diccionario los creamos con la llave del servicio y valor 1
		//posteriormente aumentamos el valor por cada servicio futuro encontrado
		for(var j = encuesta.serviciosFuturos.length - 1; j >=0; j--) {
			if(!diccionario[encuesta.serviciosFuturos[j]]) {
				diccionario[encuesta.serviciosFuturos[j]] = 1;
			} else {
				diccionario[encuesta.serviciosFuturos[j]] ++;
			}
		}
	}

	//En este punto ya tenemos un diccionario con llave-valor requivalentes al servicio-rank
	//lo que falta es transformarlo para poderlo usar en la grafica
	console.log(diccionario);
	return diccionario;
}

Utilities.prototype.getPromedio = function(encuestas) {
	acumulativo = 0;
	numEncuestas = 0;
	promedio = 0;
	for (var i = encuestas.length - 1; i >= 0; i--) {
		var e = encuestas[i];
		acumulativo += encuestas[i].promedioEncuesta;
		numEncuestas++;
	};

	if(numEncuestas>1) {
		promedio = acumulativo/numEncuestas;
	}
	return promedio;
}

var utility = new Utilities();
module.exports = utility;