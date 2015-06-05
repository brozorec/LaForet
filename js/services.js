angular.module('foretServices', [])
	.service('Session', function () {
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
	})

	.service('Authorization', function (Session) {
		this.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles]
			}
			return (!!Session.id && authorizedRoles.indexOf(Session.userRole) !== -1)
		}
	})

	.service('Authentication', function ($http, Session) {
		var auth = this

		auth.isAuthenticated = false
		auth.getUser = function  (credentials) {
			return $http.post('/login', credentials)
				.success(function (data, status, headers, config) {
					if (!!data) {
						auth.isAuthenticated = true
						Session.create(data._id, data.user.nickname, data.user.role)
					}
					return data.user
				})
		}
	})

	.service('Position', function ($window) {
		var posService = this

		posService.positions = []
		angular.element($window).bind('resize', function () {
			posService.positions = []
		})
	})
