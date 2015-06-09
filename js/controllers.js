angular.module('foretControllers', ['foretServices'])
	.controller('ContentCtrl', function (Alert) {
		var content = this

		content.alertType = function () {
			return Alert.alert.type
		}
		content.alertMsg = function () {
			return Alert.alert.msg
		}
		content.alertStatus = function () {
			return Alert.alert.status
		}
		content.alertClose = function () {
			Alert.closeAlert()
		}
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

	.controller("JoinCtrl", function JoinCtrl ($http, $state, $modal, Auth, Alert) {

		var modalInst = $modal.open({
			templateUrl: 'templates/public/join.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {}

				$scope.newUser = function (userData) {
					if ($scope.passwordrep !== $scope.userData.password) {
						Alert.addAlert('danger', 'Your passwords do not match!')
						return
					}
					$http.post('/signup', userData)
					.success(function (data, status, headers, config) {
						Auth.isAuthenticated = true
						Auth.userNickname = data.user.nickname
						Auth.userRole = data.user.role
						$modalInstance.close()
						$state.go('app.signed')
						Alert.addAlert('success', 'Welcome to our team!')
					})
					.error(function (data, status, headers, config) {
						Alert.addAlert('danger', data)
					});
				}
				$scope.cancel = function () {
					$state.go('app')
					$modalInstance.dismiss('cancel')
				}
			},
			windowClass: 'center-modal'
		})
	})

	.controller('SigninCtrl', function ($http, $state, $modal, Session, Auth, Alert) {
		$modal.open({
			templateUrl: 'templates/public/signin.html',
			controller: function ($scope, $modalInstance) {
				$scope.userData = {};

				$scope.logUser = function (userData) {
					$http.post('/signin', userData)
					.success(function (data, status, headers, config) {
						Auth.isAuthenticated = true
						Auth.userNickname = data.user.nickname
						Auth.userRole = data.user.role
						$modalInstance.close()
						$state.go('app.signed')
					})
					.error(function (data, status, headers, config) {
						Alert.addAlert('danger', data)
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
						controller: 'Forgottenpwd',
						windowClass: 'center-modal'
					})
				}
			},
			windowClass: 'center-modal'
		})
	})

	.controller('Forgottenpwd', function ($scope, $http, $state, $modalInstance, Alert) {
		$scope.userData = {}

		$scope.retrievePwd = function (userData) {
			$http.post('/forgottenpwd', userData)
			.success(function (data, status, headers, config) {
				$modalInstance.close()
				Alert.addAlert('success', data)
				$state.go('app')
			})
			.error(function (data, status, headers, config) {
				Alert.addAlert('danger', data)
			});
		}
		$scope.cancel = function () {
			$state.go('app')
			$modalInstance.dismiss('cancel')
		}
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
				controller: 'ProfileCtrl',
				windowClass: 'center-modal'
			})
		}
	})

	.controller('ProfileCtrl', function ($scope, $modalInstance, $state, $http, Auth, Alert) {
		var userData = {
			'nickname': Auth.userNickname,
			'password': '',
			'newPwd': ''
		}

		$scope.changePassword = function (oldPwd, newPwd, newPwdRep) {
			if (newPwdRep !== newPwd) {
				Alert.addAlert('danger', 'Your passwords do not match!')
				return
			}
			userData.password = oldPwd
			userData.newPwd = newPwd
			$http.post('/changepwd', userData)
			.success(function (data, status, headers, config) {
				$modalInstance.close()
				Alert.addAlert('success', data)
				$state.go('app.signed')
			})
			.error(function (data, status, headers, config) {
				Alert.addAlert('danger', data)
			});
		}
		$scope.cancel = function () {
			$state.go('app.signed')
			$modalInstance.dismiss('cancel')
		}
	})

	.controller('ContactCtrl', function () {

	})
