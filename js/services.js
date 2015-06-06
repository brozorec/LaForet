angular.module('foretServices', [])
	.service('Session', function (Auth, $http) {
		var session = this

		session.id = null
		session.userNickname = null
		session.userRole = null

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
		this.getSession = function () {
			return $http.get('/session')
				.success(function (data, status, headers, config) {
					// console.log(data.nickname)
					if (!!data) {
						Auth.isAuthenticated = true
						Auth.userNickname = data.nickname
						Auth.userRole = data.role
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

	.service('Auth', function ($http, Request) {
		var auth = this

		auth.isAuthenticated = false
		auth.userNickname = null
		auth.userRole = 'guest'
	})

	.service('Request', function ($http) {
		this.send = function (method, url, dataToSend) {
			if (method === 'post') {
				return $http.post(url, dataToSend)
				.success(function (data, status, headers, config) {
					return data
				})
			}
			else if (method === 'get') {
				return $http.get(url)
				.success(function (data, status, headers, config) {
					return data
				})
			}
		}
	})

	.service('Position', function ($window) {
		var posService = this

		posService.positions = []
		angular.element($window).bind('resize', function () {
			posService.positions = []
		})
	})
