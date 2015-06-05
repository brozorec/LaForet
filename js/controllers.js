angular.module('foretControllers', ['foretServices'])
	// .controller('AppCtrl', function (USER_ROLES, Authorization) {

	// })

	.controller('ContentCtrl', function () {
		var content = this

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

	.controller("HeaderCtrl", function HeaderCtrl ($http, $state, Session, Position) {
		var header = this

		header.positions = Position.positions
		// if (Session.id)
		// 	$state.go('app.signed')
		// else
		// 	$state.go('app')
	})

	.controller('SigninCtrl', function ($http, $state, $modal, Session, Authentication) {
		var modalInst = $modal.open({
			templateUrl: 'templates/signin.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {};
				$scope.wrongCredentials = false

				$scope.logUser = function (userData) {
					Authentication.getUser(userData).then(function () {
						if (Authentication.isAuthenticated) {
							$state.go('app.signed');
							$modalInstance.close()
						}
						else {
							$scope.wrongCredentials = true
							$scope.message = 'Invalid nickname or password!'
						}
					})
				}
				$scope.cancel = function () {
					$state.go('app')
					$modalInstance.dismiss('cancel')
				}
			}
		})
	})

	.controller("JoinCtrl", function JoinCtrl ($http, $state, $modal) {

		var modalInst = $modal.open({
			templateUrl: 'templates/join.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {};
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

	.controller("SignedCtrl", function ($stateParams, $state, $http, $scope, $modal, Session) {
		var signed = this;

		// $scope.user = $stateParams.user;
		$scope.user = Session.userNickname
		$scope.logout = function () {
			$http.get('/logout')
				.then(function (res) {
					$state.go('app')
				})
		}

		$scope.profile = function () {
			$modal.open({
				templateUrl: 'templates/profile.html',
				controller: 'ProfileCtrl'
			})
		}
	})

	.controller('ProfileCtrl', function ($scope, $modalInstance, $state, $http) {
		$scope.userData = {}

		$scope.changePassword = function (userData, newPwdRep) {
			if (newPwdRep !== userData.newPwd) {
				$scope.wrongCredentials = true
				$scope.message = 'Your password does not match!'
				return
			}
			$http.post('/changepassword', userData)
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
			$state.go('app')
			$modalInstance.dismiss('cancel')
		}
	})

	.controller('ContactCtrl', function () {

	})
