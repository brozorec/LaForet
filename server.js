var express = require('express');
var bodyParser = require('body-parser');
// var morgan = require('morgan');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session');
var nodemailer = require('nodemailer')


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
	user: {
		nickname: String,
		role: String
	},
	credentials: {
		email: String,
		password: String
	}
});

var smtpTransport = nodemailer.createTransport('SMTP', {
	host: 'appssmtp.abv.bg',
	port: 465,
	secure: true,
	auth: {
		user: 'boyan_barakov@abv.bg',
		pass: ''
	}
})

app.get('/session', function (req, res) {
	if (req.session.nickname)
		res.send({'nickname':req.session.nickname, 'role':req.session.userRole})
	else
		res.send()
})

app.post('/signin', function (req, res) {
	User.find({
		'user.nickname': req.body.nickname,
		'credentials.password': req.body.password
	}, function (err, userData) {
		if (userData.length != 0) {
			req.session.nickname = userData[0].user.nickname;
			req.session.userRole = userData[0].user.role;
		}
		res.send(userData[0])
	});
})

app.post('/changepwd', function (req, res) {
	User.find({
		'user.nickname': req.body.nickname,
		'credentials.password': req.body.password
	}, function (err, user) {
		if (user.length != 0) {
			if (user[0].credentials.password !== req.body.password)
				res.status(422).send('Wrong password!')
			else {
				user[0].credentials.password = req.body.newPwd
				user[0].save()
				res.send(user[0])
			}
		}
		else
			res.status(422).send('Server error!')
	})
})

app.post('/forgottenpwd', function (req, res) {
	User.find({
		'user.nickname': req.body.nickname,
		'credentials.email': req.body.email
	}, function (err, user) {
		if (user.length != 0) {
			smtpTransport.sendMail({
				to: req.body.email,
				subject: 'Forgotten Password',
				text: 'Your password is: ' + user[0].credentials.password
			}, function (error, response) {
				if (error)
					console.log(error)
				else {
					console.log(response)
					req.send()
				}
			})
		}
		else
			res.status(422).send('Server error!')
	})
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

app.use('/templates/private', function (req, res, next) {
	console.log('private url:' + req.originalUrl)
	if (req.session.nickname)
		res.sendFile(__dirname + req.originalUrl);
	else
		res.send('Access denied!')
	// next()
})

app.use(function(req, res, next) {
	console.log('another url:' + req.originalUrl)
	res.sendFile(__dirname + req.originalUrl);
	// next()
});

app.post('/signup', function(req, res) {

	console.log(req.body)
	User.find({$or: [
		{'user.nickname': req.body.nickname},
		{'credentials.email': req.body.email} ] }, function (err, user) {
			console.log(user)
			if (user.length == 0) {
				User.create({
					user: {
						nickname: req.body.nickname,
						role: 'member'
					},
					credentials: {
						email: req.body.email,
						password: req.body.password
					}
					}, function (err, user) {
						if (err)
							res.send(err);
						else {
							// req.session.nickname = req.body.nickname;
							console.log(user)
							res.send(user);
						}
				});
			}
			else
				res.status(422).send('User or email already in use!');
	});
});


// app.post('/signin', function (req, res) {

// 	// console.log(req.body)
// 	User.find(req.body, function (err, user) {
// 		// console.log(user)
// 		if (user.length == 0)
// 			res.status(422).send('Invalid nickname or password!');
// 		else {
// 			req.session.nickname = req.body.nickname;
// 			res.send(user[0]);
// 		}
// 	});
// });

