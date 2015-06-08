angular.module('foretControllers', ['foretServices'])
	// .controller('AppCtrl', function (USER_ROLES, Authorization) {

	// })

	.controller('ContentCtrl', function () {
		var content = this

		content.style = 'col-xs-offset-4 col-xs-2 col-md-offset-4 col-md-2 col-lg-offset-4 col-lg-2'
	})

	.controller('GameCtrl', function () {
		var game = this

		game.slides = [
			'img/cover.jpeg',
			'img/map.jpeg',
			'img/victory.jpeg',
			'img/ranking.jpeg',
			'img/wall.jpeg'
		]
	})

	.controller("HeaderCtrl", function HeaderCtrl ($http, $state, Session, Auth, Position) {
		var header = this

		header.positions = Position.positions
		Session.getSession().then(function () {
			if (Auth.isAuthenticated)
				$state.go('app.signed')
			else
				$state.go('app')
		})
	})

	.controller('SigninCtrl', function ($http, $state, $modal, Session, Auth) {
		$modal.open({
			templateUrl: 'templates/public/signin.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {};
				$scope.wrongCredentials = false

				$scope.logUser = function (userData) {
					$http.post('/signin', userData)
					.success(function (data, status, headers, config) {
						if (!!data) {
							Auth.isAuthenticated = true
							Auth.userNickname = data.user.nickname
							Auth.userRole = data.user.role
							$modalInstance.close()
							$state.go('app.signed')
						}
						else {
							$scope.wrongCredentials = true
							$scope.message = 'Wrong nickname or password!'
						}
					})
					.error(function (data, status, headers, config) {
						$scope.wrongCredentials = true
						$scope.message = data
					});
				}
				$scope.cancel = function () {
					$state.go('app')
					$modalInstance.dismiss('cancel')
				}
				$scope.forgottenPwd = function () {
					$scope.cancel()
					$modal.open({
						templateUrl: 'templates/public/forgottenpwd.html',
						controller: 'Forgottenpwd'
					})
				}
			}
		})
	})

	.controller('Forgottenpwd', function ($scope, $http, $state, $modalInstance) {
		// var userData = {
		// 	'nickname': Auth.userNickname,
		// 	'password': '',
		// 	'newPwd': ''
		// }
		$scope.userData = {}

		$scope.retrievePwd = function (userData) {
			$http.post('/forgottenpwd', userData)
			.success(function (data, status, headers, config) {
				$modalInstance.close()
				$state.go('app')
			})
			.error(function (data, status, headers, config) {
				$scope.wrongCredentials = true
				$scope.message = 'No user with this email or nickname!'
			});
		}
		$scope.cancel = function () {
			$state.go('app')
			$modalInstance.dismiss('cancel')
		}
	})

	.controller("JoinCtrl", function JoinCtrl ($http, $state, $modal) {

		var modalInst = $modal.open({
			templateUrl: 'templates/public/join.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {}
				$scope.wrongCredentials = false

				$scope.newUser = function (userData) {
					if ($scope.passwordrep !== $scope.userData.password) {
						$scope.wrongCredentials = true
						$scope.message = 'Your password does not match!'
						return
					}
					$http.post('/signup', userData)
					.success(function (data, status, headers, config) {
						$state.go('app.signed', {user: data.nickname});
						$modalInstance.close(userData)
					})
					.error(function (data, status, headers, config) {
						$scope.wrongCredentials = true
						$scope.message = data
					});
				}
				$scope.cancel = function () {
					$state.go('app')
					$modalInstance.dismiss('cancel')
				}
			}
		})
	})

	.controller("SignedCtrl", function ($stateParams, $state, $http, $scope, $modal, Auth) {
		var signed = this;

		$scope.user = Auth.userNickname
		$scope.logout = function () {
			$http.get('/logout')
				.then(function (res) {
					$state.go('app')
				})
		}

		$scope.profile = function () {
			$modal.open({
				templateUrl: 'templates/private/profile.html',
				controller: 'ProfileCtrl'
			})
		}
	})

	.controller('ProfileCtrl', function ($scope, $modalInstance, $state, $http, Auth) {
		var userData = {
			'nickname': Auth.userNickname,
			'password': '',
			'newPwd': ''
		}

		$scope.changePassword = function (oldPwd, newPwd, newPwdRep) {
			if (newPwdRep !== newPwd) {
				$scope.wrongCredentials = true
				$scope.message = 'Your passwords do not match!'
				return
			}
			userData.password = oldPwd
			userData.newPwd = newPwd
			$http.post('/changepwd', userData)
			.success(function (data, status, headers, config) {
				$modalInstance.close(userData)
				$state.go('app.signed')
			})
			.error(function (data, status, headers, config) {
				$scope.wrongCredentials = true
				$scope.message = data
			});
		}
		$scope.cancel = function () {
			$state.go('app.signed')
			$modalInstance.dismiss('cancel')
		}
	})

	.controller('ContactCtrl', function () {

	})
