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

mongoose.connect('mongodb://localhost/data');
var User = mongoose.model('foret', {
	nickname: String,
	email: String,
	password: String
});

app.get('/auth', function (req, res) {
	if (req.session.email)
		res.send(req.session.email)
	else
		res.send('ko')
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
	User.find(req.body, function (err, user) {
		console.log(user)
		if (user.length == 0)
		{
			User.create(req.body, function (err, user) {
				if (err)
					res.send(err);
				else
				{
					req.session.nickname = req.body.nickname;
					res.send(user);
				}
			});
		}
		else
		{
			res.status(422).send('User already exists!');
		}
	});
});


app.post('/signin', function (req, res) {

	console.log(req.body)
	User.find(req.body, function (err, user) {
		console.log(user)
		if (user.length == 0)
		{
			res.status(422).send('Invalid user or password!');
		}
		else
		{
			req.session.nickname = req.body.nickname;
			res.send(user[0]);
		}
	});
});