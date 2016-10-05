var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
  , db_lnk          = 'mongodb://localhost/supermercado'
  , db              = mongoose.createConnection(db_lnk);

var producto_schema = require('../models/producto')
  , Producto = db.model('Producto', producto_schema)

/* GET home page. */
router.get('/', function(req, res, next) {

   Producto.find(gotProducts);

  // NOTA: Creo que es bueno usar verbos en inglés para las funciones,
  //       por lo cómodo que son en estos casos (get, got; find, found)
  function gotProducts (err, productos) {
    if (err) {
      console.log(err);
      return next();
    }
    return res.render('index', {title: 'Lista de Productos', productos: productos});
  }
});

router.get('/producto/:id', function(req, res, next) {
	// Obteniendo id desde la url
	var id= req.params.id;

	Producto.findById(id, gotProduct);

	function gotProduct(err, producto) {
		if(err){
			console.log(err);
			return next(err);
		}
		return res.render('show-edit',{title:'Ver Productos', producto: producto});
	}
});

router.post('producto/:id',function (req, res, next) {
	var id= req.params.id;

	var nombre=req.body.nombre || '';
	var descripcion=req.body.descripcion || '';
	var precio=req.body.precio || '';

	// Validemos que nombre o descripcion no vengan vacíos
  if ((nombre=== '') || (descripcion === '')) {
    console.log('ERROR: Campos vacios');
    return res.send('Hay campos vacíos, revisar');
  }

  // Validemos que el precio sea número
  if (isNaN(precio)) {
    console.log('ERROR: Precio no es número');
    return res.send('Precio no es un número !!!!!');
  }

  Producto.findById(id, gotProduct);

  function gotProduct(err, producto) {
  	if (erro) {
  		console.log(err);
  		return next(err);
  	}

  	if (!producto) {
  		console.log('Error: ID no existe');
  		return res.send('ID invalida!');
  	} else {
  		producto.nombre = nombre;
  		producto.descripcion=descripcion;
  		producto.precio=precio;

  		producto.save(onSaved);
  	}
  }

  function onSaved(err) {
  	if(err){
  		console.log(err);
  		return next(err);
  	}
  	return res.redirect('/');
  }
});

router.post('delete-producto/:id', function (req, res, next) {
	var id=req.params.id;
	Producto.findById(id, gotProduct);

  function gotProduct (err, producto) {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (!producto) {
      return res.send('Invalid ID. (De algún otro lado la sacaste tú...)');
    }

    // Tenemos el producto, eliminemoslo
    producto.remove(onRemoved);
  }

  function onRemoved (err) {
    if (err) {
      console.log(err);
      return next(err);
    }

    return res.redirect('/'+id);
  }
});

router.get('/nuevo-producto', function (req, res ,next) {
	return res.render('show-edit', {title:'Nuevos Productos', producto:{}});
});

router.post('/nuevo-producto', function (req, res, next) {
	// Obtenemos las variables y las validamos
    var nombre      = req.body.nombre       || '';
    var descripcion = req.body.descripcion  || '';
    var precio      = req.body.precio       || '';

    // Validemos que nombre o descripcion no vengan vacíos
    if ((nombre=== '') || (descripcion === '')) {
      console.log('ERROR: Campos vacios');
      return res.send('Hay campos vacíos, revisar');
    }

    // Validemos que el precio sea número
    if (isNaN(precio)) {
      console.log('ERROR: Precio no es número');
      return res.send('Precio no es un número !!!!!');
    }
    // Creamos el documento y lo guardamos
    var producto = new Producto({
        nombre        : nombre
      , descripcion   : descripcion
      , precio        : precio
    });

    producto.save(onSaved);

    function onSaved (err) {
      if (err) {
        console.log(err);
        return next(err);
      }

      return res.redirect('/');
    } 
});

module.exports = router;

