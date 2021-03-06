angular.module('foretServices', [])
	.service('Session', function (Auth, $http) {
		// var session = this

		// session.id = null
		// session.userNickname = null
		// session.userRole = null

		// session.create = function (sessionId, userNickname, userRole) {
		// 	session.id = sessionId
		// 	session.userNickname = userNickname
		// 	session.userRole = userRole
		// }
		// session.destroy = function () {
		// 	session.id = null
		// 	session.userNickname = null
		// 	session.userRole = null
		// }
		this.getSession = function () {
			return $http.get('/session')
				.success(function (data, status, headers, config) {
					// console.log(data.nickname)
					if (!!data) {
						// Auth.isAuthenticated = true
						// Auth.userNickname = data.nickname
						// Auth.userRole = data.role
						Auth.create(data.nickname, data.role)
					}

					// return data
				})
		}
	})

	.service('Authorization', function (Session) {
		this.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles]
			}
			return (!!Session.id && authorizedRoles.indexOf(Session.userRole) !== -1)
		}
	})

	.service('Auth', function ($http) {
		var auth = this

		auth.isAuthenticated = false
		auth.userNickname = null
		auth.userRole = 'guest'

		auth.create = function (userNickname, userRole) {
			auth.isAuthenticated = true
			auth.userNickname = userNickname
			auth.userRole = userRole
		}
		auth.destroy = function () {
			auth.isAuthenticated = false
			auth.userNickname = null
			auth.userRole = 'guest'
		}
	})

	.service('Position', function ($window) {
		var posService = this

		posService.positions = []
		angular.element($window).bind('resize', function () {
			posService.positions = []
		})
	})

	.service('Alert', function () {
		this.status = false
		this.type = ''
		this.msg = ''

		this.addAlert = function (type, msg) {
			this.status = true
			this.type = type
			this.msg = msg
		}
		this.closeAlert = function () {
			this.status = false
			this.type = ''
			this.msg = ''
		}
	})
