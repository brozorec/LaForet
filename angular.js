(function(){
	angular.module("foret", ["ui.router", "ui.bootstrap"])
		.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider
				.state('app', {
					url: '/',
					views: {
						'header': {
							templateUrl: 'templates/header.html',
							controller: 'HeaderCtrl as header'
						},
						'content': {
							templateUrl: 'templates/content.html',
							controller: 'ContentCtrl as content'
						},
						'game@app': {
							templateUrl: 'templates/game.html',
							controller: 'GameCtrl as game'
						},
						'contact@app': {
							templateUrl: 'templates/contact.html',
							controller: 'ContactCtrl as contact'
						}
					}
				})
				.state('app.signin', {
					views: {
						'form@app': {
							controller: 'SigninCtrl as signin'
						}
					}
				})
				.state('app.join', {
					views: {
						'form@app': {
							controller: "JoinCtrl as join"
						}
					}
				})
				.state('app.signed', {
					views: {
						'user@app': {
							templateUrl: 'templates/signed.html',
							controller: 'SignedCtrl as signed'
						},
						'forum@app': {
							templateUrl: 'templates/forum.html'
						},
						'user-toggled@app': {
							template: '<li><a href="" ng-click="signed.logout()">Log Out</a></li>' +
										'<li class="divider"></li><li><a href="">Profile</a></li>',
							controller: 'SignedCtrl as signed'
						}
					},
					// url: '',
					params: {user: null}
				})
			$locationProvider.html5Mode(true);
		})

		.service('AuthService', function ($http, $state) {
			var auth = this

			auth.getUser = function  () {
				return $http.get('/auth')
						.then(function (res) {
							return res.data
						})
			}
		})

		.service('PositionService', function ($window) {
			var posService = this

			posService.positions = []
			angular.element($window).bind('resize', function () {
				posService.positions = []
			})
		})

		.directive('box', function ($window, PositionService) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					var position = element[0].getBoundingClientRect().top + 100
					PositionService.positions.push(position)

					angular.element($window).bind('resize', function () {
						position = element[0].getBoundingClientRect().top + 100
						PositionService.positions.push(position)
					})

					angular.element($window).bind('scroll', function () {
						console.log(degree)
						position = element[0].getBoundingClientRect().top
					})
				}
			}
		})

		.directive('showOnTop', function ($window) {
			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					angular.element($window).bind('scroll', function () {
					if (attrs.pos > this.pageYOffset)
					{
						element.css('visibility', 'hidden')
					}
					else
						element.css('visibility', 'visible')
					})
				}
			};
		})

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

		.controller("HeaderCtrl", function HeaderCtrl ($http, $state, AuthService, PositionService) {
			var header = this

			header.positions = PositionService.positions
			AuthService.getUser().then( function (res) {
				// console.log(res)
				if (res == 'ko')
					$state.go('app');
				else
					$state.go('app.signed', {user: res});
			})
		})

		.controller('SigninCtrl', function ($http, $state, $modal) {
			var modalInst = $modal.open({
				templateUrl: 'templates/signin.html',
				controller: function ($scope, $modalInstance) {
					$scope.userData = {};
					$scope.wrongCredentials = false

					$scope.logUser = function (userData) {
						$http.post('/signin', userData)
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
				},
				size: 'lg'
			})
		})

		.controller("JoinCtrl", function JoinCtrl ($http, $state, $modal) {

			var modalInst = $modal.open({
				templateUrl: 'templates/join.html',
				controller: function ($scope, $modalInstance) {
					$scope.userData = {};
					$scope.wrongCredentials = false

					$scope.newUser = function (userData) {
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
				},
				size: 'lg'
			})
		})

		.controller("SignedCtrl", function ($stateParams, $state, $http, $window, $scope, PositionService) {
			var signed = this;

			signed.user = $stateParams.user;
			signed.logout = function () {
				$http.get('/logout')
					.then(function (res) {
						$state.go('app')
					})
			}
		})
})();

