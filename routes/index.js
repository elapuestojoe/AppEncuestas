//Keys:

//NSArray *arrTiposEncuesta = 
//@[@"AMS", @"Capacitacion", @"Cloud", @"Consultoria", @"Producto", @"SolutionCenter", @"Staffing"];

const AMS = "AMS";
const CAPACITACION = "Capacitacion";
const CLOUD = "Cloud";
const CONSULTORIA = "Consultoria";
const PRODUCTO = "Producto";
const SOLUTIONCENTER = "SolutionCenter";
const STAFFING = "Staffing";

var express = require('express');
var router = express.Router();
var utilities = require('./utils.js');

var startDate;
var endDate;

var startDateC;
var endDateC;
// grab the packages we need
// var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/encuestas');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("Connected to DB");
// });

// var encuestaSchema = mongoose.Schema({
//     tipoEncuesta:     String,
//     fechaAplicacion:  String,
//     DN:               String,
//     //p1:               Number
//     // p8:               Number,
//     // p9:               Number,
    
// });

// var encuestaModel = mongoose.model('tipoEncuesta', encuestaSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    
  // var plot = require('plotter').plot;

  // plot({
  //     //data:		  [ 3, 1, 2, 3, 4 ],
  //     data:		{ 'Staffing' : {1 : 1, 2 : 2, 3 : 3, 4 : 4 }, 'AMS' : { 1: 3, 2 : 4, 3 : 5, 5 : 1} },
  //     style:    'linespoints',
  //     filename:	'public/images/output.png',
  //     title:    'Encuestas Praxis',
  //     xlabel:   'Pregunta',
  //     ylabel:   'Nivel de satisfacción'
  // });
  res.render('index', { title: 'Página principal' });
});

router.post('/postData', function(request, response){
  
  //Tratar de guardar
  var encuesta = new utilities.encuestaModel();
  //
  encuesta.tipoEncuesta = request.body.tipoEncuesta;
  encuesta.fechaAplicacion = request.body.fechaAplicacion;
  encuesta.DN = request.body.DN;
  encuesta.nombreCliente = request.body.nombreCliente;
  encuesta.promedioEncuesta = request.body.promedioEncuesta;
  encuesta.usuarioAltaGerencia = request.body.usuarioAltaGerencia;
  encuesta.serviciosFuturos = request.body.serviciosFuturos;
  encuesta.nombreUsuario = request.body.nombreUsuario;
  encuesta.CG = request.body.CG;
  encuesta.SG = request.body.SG;
  encuesta.adquirirSG = request.body.adquirirSG;
  encuesta.serviciosProyecto = request.body.serviciosProyecto;
  encuesta.comentarios = request.body.comentarios;
  encuesta.save(function (err, encuesta) {
    if (err) return console.error(err);
    console.log("Encuesta guardada");
  });
  
  
  console.log(request.body);      // your JSON
  response.send(request.body);    // echo the result back
});

router.get('/seleccionarFiltro', function(request, response){
  console.log("Encuestas:");
  
  encuestaModel.find(function (err, encuestas) {
    if (err) return console.error(err);
    console.log(encuestas);
  });
  response.render('seleccionarFiltro', { title: 'Encuestas' });
});

router.get('/promedioGeneral', function(request, response){
  
  var encuestasAMS = [];
  var encuestasCapacitacion = [];
  var encuestasCloud = [];
  var encuestasConsultoria = [];
  var encuestasProductoProyecto = [];
  var encuestasSolutionCenter = [];
  var encuestasStaffing = [];
  
  console.log("Encuestas:");
  
  encuestaModel.find(function (err, encuestas) {
    if (err) return console.error(err);
    console.log(encuestas);
  });
  
  
  //Un mundo de callbacks, eventualmente debo cambiar esto por promesas
  encuestaModel.find({ tipoEncuesta: /^AMS/ }, function(err, encuestas) {
    if (err) return console.error(err);
    encuestasAMS = encuestas;
    console.log("ENCUESTAS AMS");
    console.log(encuestasAMS);
    
    encuestaModel.find({ tipoEncuesta: /^Capacitacion/ }, function(err, encuestas) {
      if (err) return console.error(err);
      encuestasCapacitacion = encuestas;
      
      encuestaModel.find({ tipoEncuesta: /^Cloud/ }, function(err, encuestas) {
        if (err) return console.error(err);
        encuestasCloud = encuestas;
        
        encuestaModel.find({ tipoEncuesta: /^Consultoria/ }, function(err, encuestas) {
          if (err) return console.error(err);
          encuestasConsultoria = encuestas;
          
          encuestaModel.find({ tipoEncuesta: /^Producto/ }, function(err, encuestas) {
            if (err) return console.error(err);
            encuestasProductoProyecto = encuestas;
            
            encuestaModel.find({ tipoEncuesta: /^SolutionCenter/ }, function(err, encuestas) {
              if (err) return console.error(err);
              encuestasSolutionCenter = encuestas;
              
              encuestaModel.find({ tipoEncuesta: /^Staffing/ }, function(err, encuestas) {
                if (err) return console.error(err);
                encuestasStaffing = encuestas;
                generarGrafico();
              });  
            });
          });  
        });
      });
    });
  });
  
  //Fin del mundo de callbacks
  
  function generarGrafico() {
    //Preparar el paquete
    var arrNumeros = [];
    var arrTexto = [];
    var arrGraficos = [];
    arrGraficos.push(['AMS', encuestasAMS.length]);
    arrGraficos.push(['Capacitacion', encuestasCapacitacion.length]);
    arrGraficos.push(['Cloud', encuestasCapacitacion.length]);
    arrGraficos.push(['Consultoria', encuestasConsultoria.length]);
    arrGraficos.push(['Producto', encuestasProductoProyecto.length]);
    arrGraficos.push(['Solution Center', encuestasSolutionCenter.length]);
    arrGraficos.push(['Staffing', encuestasStaffing.length]);
    
    
    response.render('pieChart', {arrGraficos : arrGraficos, tituloGrafico: "Encuestas aplicadas por area"});
  }
});

router.get('/mostrarTodasEncuestas', function(request, response) {
  utilities.getAllEncuestas();
  response.render('index', { title: 'Todas encuestas' });
});

router.get('/filtrarPorDN', function(request, response){
  //HARDCODED
  utilities.filterEncuestasByDN("4").then(result => {
    console.log(result);
  });
  response.render('index', { title: 'Filtrar por DN' });
});

router.get('/filtrarPorTipo', function(request, response) {
  utilities.filterEncuestasByType("Producto").then(result => {
    console.log(result);
  });
  response.render('index', {title:"Filtrar por tipo"});
});

router.get('/filtrarPorFecha', function(request, response) {
  utilities.filterEncuestasByDate().then(result => {
    console.log(result);
  });
  response.render('index', {title:"Filtrar por fecha"});
});

router.get("/filtroTipoFecha", function(request, response) {

  utilities.filterEncuestasByType("AMS").then(result => {
    utilities.filterEncuestasByDate("", "", result).then(result => {
      console.log(result);
    })
  });
  response.render('index', {title: "Filtro Tipo/Fecha"});
})

router.get("/filtroFechaTipo", function(request, response) {

  utilities.filterEncuestasByDate().then(result => {
    utilities.filterEncuestasByType("Capacitacion").then(result => {
      console.log(result);
    })
  });
  response.render('index', {title: "Filtro Fecha/Tipo"});
})

router.get("/filtroTipoDN", function(request, response) {

  utilities.filterEncuestasByType("Consultoria").then(result => {
    var r = result;
    utilities.filterEncuestasByDN("4", r).then(result => {
      console.log(result);
    })
  });
  response.render('index', {title: "Filtro Tipo/DN"});
})

router.get("/groupBy", function(request, response) {

  console.log(utilities.getAllEncuestasGroupBy());
  response.render('index', {title: "Group by nombreCliente"});
})

router.get("/sorted", function(request, response) {

  console.log(utilities.getAllEncuestasSorted());
  response.render('index', {title: "Sorted"});
})

router.get("/generarReporteAcumulado", function(request, response) {
  console.log("generarReporteAcumulado");
  //Obtener encuestas
  utilities.getAllEncuestas().then(result => {

    //Filtrar por tipo
    var encuestas = utilities.groupEncuestasByType(result);
    var arrGraficos = [];
    for (var key in encuestas) {
      arrGraficos.push([key, encuestas[key].length]);
    }

    //Obtener promedio general
    var avg = utilities.getAverage(result);
    var count = result.length;

    //Todas las encuestas por promedio
    var muchasEncuestas = [];
    for (var i = result.length - 1; i >= 0; i--) {

      if(result[i].nombreCliente && result[i].promedioEncuesta){
        muchasEncuestas.push([result[i].nombreCliente, result[i].promedioEncuesta]);
      }
    };
    response.render('reporte', {title: "Reporte", arrGraficos: arrGraficos, tituloGrafico: "", muchasEncuestas: muchasEncuestas});
  });
  
})

router.get("/combo", function(request, response) {
  console.log("combo");
  utilities.getAllEncuestas().then(result => {
  //Primero separar las encuestas por dn
  var diccEncuestas = utilities.separarPorDN(result);

  var arrCombo = [];
  for(var key in diccEncuestas) {
    var SECCIONES = [AMS, CAPACITACION, CLOUD, CONSULTORIA, PRODUCTO, SOLUTIONCENTER, STAFFING];

    var encuestasDN = diccEncuestas[key];

    for(var kSeccion in SECCIONES) {
      var seccion = SECCIONES[kSeccion];
      var e = encuestasDN[seccion];
      //console.log(e);
      //Calcula el promedio
      if(e.total>0) {
        e.promedio = e.acumulativo/e.total;
      }
    }
    
    //crea la dn
    var dn = ["DN"+key, 
            encuestasDN[AMS].promedio, 
            encuestasDN[CAPACITACION].promedio, 
            encuestasDN[CLOUD].promedio, 
            encuestasDN[CONSULTORIA].promedio, 
            encuestasDN[PRODUCTO].promedio, 
            encuestasDN[SOLUTIONCENTER].promedio, 
            encuestasDN[STAFFING].promedio];

    arrCombo.push(dn);
  }
  console.log(arrCombo);
  response.render('combo', {arrCombo: arrCombo});
  });
});

router.get('/serviciosFuturos', function(request, response) {
  console.log("serviciosFuturos");

  utilities.getAllEncuestas().then(result => {

    var dic = utilities.obtenerServiciosFuturos(result);

    //Transformamos el diccionario para que sea compatible con el generador
    //de graficos

    var arrGraficos = [];
    for (var key in dic) {
      var obj = dic[key];
      arrGraficos.push([key, obj]);
    }
    response.render('serviciosFuturos', {arrGraficos: arrGraficos, tituloGrafico:"Servicios Futuros"});
  });
});

router.post("/filtrarPorFechaEncuestas", function(request, response) {
  startDate = request.body.startDate;
  endDate = request.body.endDate;
  generarReporte(startDate, endDate, response);
});

router.get("/filtrarPorFechaEncuestas", function(request, response) {
  if(startDate && endDate) {
    generarReporte(startDate, endDate, response);
  } else {
    response.redirect("/");
  }
})

function generarReporte(startDate, endDate, response) {

  utilities.getAllEncuestas().then(allEncuestas => {
    var allEncuestas = allEncuestas;
    utilities.filterEncuestasByDate(startDate, endDate, allEncuestas).then(result => {

      var encuestasFiltradas = result;

      //Rango de tiempo
      var strRango = "Entre: " + startDate + " y " + endDate;

      //Promedios 
      var promedioTotal = utilities.getPromedio(allEncuestas);
      var promedioFiltrado = utilities.getPromedio(encuestasFiltradas);

      //Filtrar por tipo
      var encuestas = utilities.groupEncuestasByType(result);
      var arrGraficos = [];
      for (var key in encuestas) {
        arrGraficos.push([key.split("encuestas")[1], encuestas[key].length]);
      }

      //Obtener promedio por tipo de encuesta
      var promedioEncuestasPorTipo = [];

      for(var key in encuestas) {
        var tipo = encuestas[key];
        var num = 0;
        var acumulado = 0;
        var promedio = 0;
        for(var encuesta in tipo) {
          num++;
          acumulado+=tipo[encuesta].promedioEncuesta;
        }     
        if(num>0) {
          promedio = acumulado/num;
        }

        promedioEncuestasPorTipo.push([key.split("encuestas")[1], promedio])
      }
      console.log(promedioEncuestasPorTipo);

      //Obtener promedio general
      var avg = utilities.getAverage(result);
      var count = result.length;

      //Todas las encuestas por promedio
      var muchasEncuestas = [];
      for (var i = result.length - 1; i >= 0; i--) {

        if(result[i].nombreCliente && result[i].promedioEncuesta){
          muchasEncuestas.push([result[i].nombreCliente+"-"+result[i].nombreUsuario, result[i].promedioEncuesta]);
        }
      };

      //Encuestas dn / modalidad
      var diccEncuestas = utilities.separarPorDN(encuestasFiltradas);

      var arrCombo = [];
      for(var key in diccEncuestas) {
        var SECCIONES = [AMS, CAPACITACION, CLOUD, CONSULTORIA, PRODUCTO, SOLUTIONCENTER, STAFFING];

        var encuestasDN = diccEncuestas[key];

        for(var kSeccion in SECCIONES) {
          var seccion = SECCIONES[kSeccion];
          var e = encuestasDN[seccion];
          //console.log(e);
          //Calcula el promedio
          if(e.total>0) {
            e.promedio = e.acumulativo/e.total;
          }
        }
        
        //crea la dn
        var dn = ["DN"+key, 
                encuestasDN[AMS].promedio, 
                encuestasDN[CAPACITACION].promedio, 
                encuestasDN[CLOUD].promedio, 
                encuestasDN[CONSULTORIA].promedio, 
                encuestasDN[PRODUCTO].promedio, 
                encuestasDN[SOLUTIONCENTER].promedio, 
                encuestasDN[STAFFING].promedio];

        arrCombo.push(dn);
      }
      //console.log(arrCombo);

      // Fin del combo DN / Modalidad

      // Comentarios generales

        // CG almacena las respuestas
      var CG = {0 : {"Si" : 0, "No" : 0, "NoSe" : 0, "Depende" : 0}, 
                1 : {"Si" : 0, "No" : 0, "NoSe" : 0, "Depende" : 0}, 
                2 : {"Si" : 0, "No" : 0, "NoSe" : 0, "Depende" : 0}
              };
      for (var i = encuestasFiltradas.length - 1; i >= 0; i--) {
        var e = encuestasFiltradas[i];

        for (var p = e.CG.length - 1; p >= 0; p--) {

          // Aquí sucede la magia
          CG[p][e.CG[p]]++;
        };

       };

      //Servicios Generales
      var SG = {}

      for (var i = encuestasFiltradas.length - 1; i >= 0; i--) {
        var e = encuestasFiltradas[i];

        for (var p = e.SG.length - 1; p >= 0; p--) {
          if(!SG[e.SG[p]]) {
            SG[e.SG[p]] = 1
          } else {
            SG[e.SG[p]]++;
          }
        };
      }
      var arrSG = [];
      for(var key in SG) {
        arrSG.push([key, SG[key]/encuestasFiltradas.length*100]);
      }

      // adquirir con nosotros?
      var adquirirSG = {"Si" : 0 , "No" : 0, "NoSe": 0,"BE": 0}
      for (var i = encuestasFiltradas.length - 1; i >= 0; i--) {
        var e = encuestasFiltradas[i];

        // arrAdquirirAlmacena los resultados
        adquirirSG[e.adquirirSG]++;
      }

      //convertir a formato para graficas
      var arrAdquirirSG = [];
      for(var key in adquirirSG) {
        var keyLimpia = key;
        if(key == "Si") {
          keyLimpia = "Sí";
        } else if(key == "NoSe"){
          keyLimpia = "No sé";
        } else if(key == "BE") {
          keyLimpia = "Bajo evaluación"
        } 
        arrAdquirirSG.push([keyLimpia, adquirirSG[key]]);
      }

      especialidadesFuturas = {};
      total = 0;
      // obtener servicios futuros proyecto (especialidades)
      for (var i = encuestasFiltradas.length - 1; i >= 0; i--) {
        var e = encuestasFiltradas[i];
        //Este diccionario almacenará el conteo de especialidades
        
        for(var j = e.serviciosProyecto.length - 1; j >= 0; j--) {
          var esp = e.serviciosProyecto[j];

          if(!especialidadesFuturas[esp]) {
            especialidadesFuturas[esp] = 1;
            total++;
          } else {
            especialidadesFuturas[esp]++;
            total++;
          }
        }
      }
      //
      var arrEspecialidadesFuturas = [];

      for(var key in especialidadesFuturas) {
        arrEspecialidadesFuturas.push([key, especialidadesFuturas[key]/total*100]);
      }
      //
      response.render('reporteFiltros', {title: "Reporte", arrGraficos: arrGraficos, 
        tituloGrafico: "", 
        muchasEncuestas: muchasEncuestas,
        arrCombo : arrCombo,
        allEncuestas: allEncuestas, 
        encuestasFiltradas: encuestasFiltradas,
        promedioTotal : promedioTotal,
        promedioEncuestasPorTipo : promedioEncuestasPorTipo,
        promedioFiltrado : promedioFiltrado,
        CG : CG,
        arrSG : arrSG,
        arrAdquirirSG : arrAdquirirSG,
        arrEspecialidadesFuturas : arrEspecialidadesFuturas,
        strRango: strRango});
    });
  });
}

router.post("/getComentarios", function(request, response) {
  startDateC = request.body.startDateC;
  endDateC = request.body.endDateC;
  generarReporteComentarios(startDateC, endDateC, response);
});

router.get("/getComentarios", function(request, response) {
  if(startDateC && endDateC) {
    generarReporteComentarios(startDateC, endDateC, response);
  } else {
    response.redirect("/");
  }
});

function generarReporteComentarios(startDate, endDate, response) {

  console.log("Generar reporte comentarios");
  utilities.getAllEncuestasSortedPromise().then(allEncuestas => {
    var allEncuestas = allEncuestas;

    //Filtrar por fecha
    utilities.filterEncuestasByDate(startDate, endDate, allEncuestas).then(result => {

      var encuestasFiltradasFecha = result;

      var encuestasFiltradasComentarios = utilities.filtrarPorComentarios(encuestasFiltradasFecha);

      response.render("getComentarios", {
        encuestasFiltradasComentarios : encuestasFiltradasComentarios
      });
    });
  });
}

router.post("/verComentarios", function(request, response) {
  var jsonComentarios = JSON.parse(request.body.comentarios);
  response.render("verComentarios", {jsonComentarios : jsonComentarios});
});

router.get("/appredirect", function(request, response) {
  response.redirect("https://itunes.apple.com/mx/app/cobro-movil/id904370680?mt=8");
})
module.exports = router;
