var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pos-unoesc');

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('Erro de conexão', err);
});

db.on('open', function () {
	console.log('Conexão aberta');
});

db.on('connected', function () {
	console.log('Conectado');
});

db.on('disconnected', function (err) {
	console.log('Desconectado');
});

var Cat = mongoose.model('Cat' , {name : String});

var kitty = new Cat({name : 'Osvaldinho'});

kitty.save(function(err,data) {
	if(err) {
		console.log(err);
	}
	console.log(data);
});