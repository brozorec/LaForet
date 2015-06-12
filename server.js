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
	service: 'Gmail',
	auth: {
		user: 'boyan.barakov@gmail.com',
		pass: ''
	}
})

var authAdmin = function (req, res, next) {
	if (req.session.userRole === 'admin')
		next()
	else
		res.send('Access denied')
}

app.get('/session', function (req, res) {
	if (req.session.nickname)
		res.send({'nickname':req.session.nickname, 'role':req.session.userRole})
	else
		res.send()
})

app.get('/dashboard/users', authAdmin, function (req, res) {
	var usersArray = []

	User.find({}, function (err, users) {
		users.forEach(function (user) {
			usersArray.push({'_id': user._id, 'nickname': user.user.nickname, 'role': user.user.role, 'email': user.credentials.email})
		})
		res.send(usersArray)
	})
})

app.delete('/dashboard/users', authAdmin, function (req, res) {
	var userId = req.query.userid

	User.find({'_id': userId}).remove(function () {
		res.send('deleted')
	})
})

app.post('/dashboard/users', authAdmin, function (req, res) {
	var userId = req.body.userid

	User.find({'_id': userId}, function (err, userData) {
		userData[0].credentials.email = req.body.email
		userData[0].user.nickname = req.body.nickname
		userData[0].user.role = req.body.role
		userData[0].save()
		res.send('modified')
	})
})

app.get('/logout', function (req, res) {
	req.session.destroy()
	res.send()
})

app.post('/signup', function(req, res) {
	User.find({$or: [
		{'user.nickname': req.body.nickname},
		{'credentials.email': req.body.email} ] }, function (err, user) {
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
					}, function (err, userData) {
						if (err)
							res.status(422).send('Server error!');
						else {
							req.session.nickname = userData.user.nickname;
							req.session.userRole = userData.user.role;
							res.send({'nickname':req.session.nickname, 'role':req.session.userRole});
						}
				});
			}
			else
				res.status(422).send('User or email already in use!');
	});
});

app.post('/signin', function (req, res) {
	User.find({
		'user.nickname': req.body.nickname,
		'credentials.password': req.body.password
	}, function (err, userData) {
		if (userData.length != 0) {
			req.session.nickname = userData[0].user.nickname;
			req.session.userRole = userData[0].user.role;
			res.send({'nickname':req.session.nickname, 'role':req.session.userRole})
		}
		else
			res.status(422).send('Invalid nickname or password!')
	});
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
				if (error) {
					console.log(error)
					res.status(422).send('Sorry, we cannot send you an email!')
				}
				else {
					console.log(response)
					res.send('You will receive an email with your password!')
				}
			})
		}
		else
			res.status(422).send('No user with this email or nickname!')
	})
})

app.post('/changepwd', function (req, res) {
	User.find({
		'user.nickname': req.body.nickname
	}, function (err, user) {
		if (user.length != 0) {
			if (user[0].credentials.password !== req.body.password)
				res.status(422).send('Wrong password!')
			else {
				user[0].credentials.password = req.body.newPwd
				user[0].save()
				res.send('Your password was successfully changed!')
			}
		}
		else
			res.status(422).send('Server error!')
	})
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
	console.log('public url:' + req.originalUrl)
	res.sendFile(__dirname + req.originalUrl);
	// next()
});


