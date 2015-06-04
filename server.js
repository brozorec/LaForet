var express = require('express');
var bodyParser = require('body-parser');
// var morgan = require('morgan');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session');


var app = express();

// app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
// app.use(morgan('dev'));
app.use(session({
	secret: 'topsecret',
	resave: false,
	saveUninitialized: false }));

app.listen(8080);

mongoose.connect('mongodb://foretadmin:jesuisdelaforet@ds043002.mongolab.com:43002/foret');
mongoose.connection.on('error', function () {
	console.log('mongoose connection error')
})
var User = mongoose.model('foret', {
	nickname: String,
	userRole: String,
	email: String,
	password: String
});

app.get('/auth', function (req, res) {
	if (req.session.nickname)
		res.send(req.session.nickname)
	else
		res.send('ko')
})

app.post('/login', function (req, res) {
	User.find(req.body, function (err, user) {
		// console.log(user)
		res.send(user[0])
	});
})

app.get('/all', function (req, res) {
	User.find({}, function (err, user) {
		console.log(user)
	})
})

app.get('/logout', function (req, res) {
	req.session.destroy()
	res.send()
})

app.get('*', function(req, res) {
	// if (req.url == '/templates/signin.html')
	// console.log(req.session.email)
	res.sendFile(__dirname + req.url);
});


app.post('/signup', function(req, res) {

	console.log(req.body)
	User.find({$or: [
		{nickname: req.body.nickname},
		{email: req.body.email} ] }, function (err, user) {
			console.log(user)
			if (user.length == 0) {
				User.create(req.body, function (err, user) {
					if (err)
						res.send(err);
					else {
						req.session.nickname = req.body.nickname;
						res.send(user);
					}
				});
			}
			else
				res.status(422).send('User or email already in use!');
	});
});


app.post('/signin', function (req, res) {

	// console.log(req.body)
	User.find(req.body, function (err, user) {
		// console.log(user)
		if (user.length == 0)
			res.status(422).send('Invalid nickname or password!');
		else {
			req.session.nickname = req.body.nickname;
			res.send(user[0]);
		}
	});
});

app.post('/changepassword', function (req, res) {
	User.find({nickname: req.session.nickname}, function (err, user) {
		if (user.length != 0) {
			if (user[0].password !== req.body.oldPwd)
				res.status(422).send('Wrong password!')
			else {
				user[0].password = req.body.newPwd
				user[0].save()
				res.send(user[0])
			}
		}
		else
			res.status(422).send('Server error!')
	})
})
