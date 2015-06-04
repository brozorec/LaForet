angular.module('foretServices', [])
	.service('AuthService', function ($http, Session) {
		var auth = this

		auth.getUser = function  (credentials) {
			return $http.post('/login', credentials)
					.then(function (res) {
						// Session.create(res.data._id, res.data.nickname, res.data.userRole)
						console.log(res.data._id, res.data.nickname, res.data.userRole)
						return res.data
					})
		}
	})

	.service('Session', function () {
		var session = this

		session.create = function (sessionId, userNickname, userRole) {
			session.id = sessionId
			session.userNickname = userNickname
			session.userRole = userRole
		}
		session.destroy = function () {
			session.id = null
			session.userNickname = null
			session.userRole = null
		}
	})

	.service('PositionService', function ($window) {
		var posService = this

		posService.positions = []
		angular.element($window).bind('resize', function () {
			posService.positions = []
		})
	})
