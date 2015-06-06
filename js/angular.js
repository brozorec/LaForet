(function(){
	angular.module("foret", ['ui.router','ui.bootstrap', 'foretControllers','foretDirectives', 'foretServices'])
		.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
			$urlRouterProvider.otherwise("/");
			$stateProvider
				.state('app', {
					url: '/',
					views: {
						'header': {
							templateUrl: 'templates/public/header.html',
							controller: 'HeaderCtrl as header'
						},
						'content': {
							templateUrl: 'templates/public/content.html',
							controller: 'ContentCtrl as content'
						},
						'game@app': {
							templateUrl: 'templates/public/game.html',
							controller: 'GameCtrl as game'
						},
						'contact@app': {
							templateUrl: 'templates/public/contact.html',
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
							templateUrl: 'templates/private/signed.html',
							controller: 'SignedCtrl as signed'
						},
						'forum@app': {
							templateUrl: 'templates/private/forum.html'
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

		.constant('AUTH_EVENTS', {
			loginSuccess: 'auth-login-success',
			loginFailed: 'auth-login-failed',
			logoutSuccess: 'auth-logout-success',
			notAuthenticated:'auth-not-authenticated',
			notAuthorized: 'auth-not-authorized'
		})

		.constant('USER_ROLES', {
			all: '*',
			admin: 'admin',
			member: 'member',
			guest: 'guest'
		})
})();

