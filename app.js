var http = require('http');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pos-unoesc');

var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Erro de conexão.', err);
});

db.on('open', function() {
	console.log('Conexão aberta.');
});

db.on('connected', function(err) {
	console.log('Conectado.');
});

db.on('disconnected', function(err) {
	console.log('Desconectado.');
});

var Schema = mongoose.Schema;

var json_schema = {
	name : {type: String, default : ''},
	description : {type : String, default : ''},
	alcohol : {type : Number, min: 0},
	price : {type : Number, min: 0},
	category : {type : String, default : ''},
	created_at : {type : Date, default : Date.now}
};

var BeerSchema = new Schema(json_schema);

var Beer = mongoose.model('Beer', BeerSchema);

var Controller = {
	create : function(req, res) {
		var dados = {
			name : 'Skol',
			description : 'Mijo de rato',
			alcohol : 4.5,
			price : 3.0,
			category : 	'pilsen'
		}

		var model = new Beer(dados);

		model.save(function(err,data) {

			if(err) {
				console.log(err);
				msg = 'Erro: ' + err;
			} else {
				console.log(data);
				msg = 'Cerveja inserida: ' + data;
			}
			res.write(msg);
			res.end();
		}); 
	},
	retrieve :  function(req, res) {
		var query = {};

		Beer.find(query, function(err, data) {
			if(err) {
				console.log(err);
				msg = 'Erro: ' + err;
			} else {
				console.log('Listagem',data);
				msg = 'Listagem: ' + data;
			}
			res.write(msg);
			res.end();
		});	
	},
	update :  function(req, res) {
		var query = {name : /skol/i};

		var mod = {
			name : 'Brahma',
			alcohol : 6,
			price : 6,
			category : 'pilsen'
		};
		var optional = {
			upsert : false,
			multi : true
		};

		Beer.update(query, mod, optional, function (err, data) {
			if(err) {
				console.log(err);
				msg = 'Erro: ' + err;
			} else {
				console.log(data);
				msg = 'Cerveja atualizada: ' + data;
			}
			res.write(msg);
			res.end();
		});
	},
	delete :  function(req, res) {
		var query = {name : /skol/i};
		Beer.remove(query, function(err, data) {
			if(err) {
				console.log(err);
				msg = 'Erro: ' + err;
			} else {
				console.log(data);
				msg = 'Cerveja(s) deletada(s) com sucesso: ', data
			}
			res.write(msg);
			res.end();
		});
	}
};

http.createServer(function (req, res) {
	var url = req.url;
	var msg = '';

	console.log('URL:', req.url);
	res.writeHead(200, {'Content-Type': 'text/plain'});


	switch(url) {
		case '/api/beers/create' :
			Controller.create(req,res);
			break;
		case '/api/beers/update' :
			Controller.update(req,res);
			break;
		case '/api/beers/delete' :
			Controller.delete(req,res);
			break;
		case '/api/beers/retrieve' :
			Controller.retrieve(req,res);
			break;
		default:
			msg = 'url invalida';			
			res.write(msg);
			res.end();
	}
	
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000/');