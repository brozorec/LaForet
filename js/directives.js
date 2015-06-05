angular.module('foretDirectives', ['foretServices'])
	.directive('box', function ($window, Position) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var position = element[0].getBoundingClientRect().top + 100
				Position.positions.push(position)

				angular.element($window).bind('resize', function () {
					position = element[0].getBoundingClientRect().top + 100
					Position.positions.push(position)
				})

				angular.element($window).bind('scroll', function () {
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
					element.css('visibility', 'hidden')
				else
					element.css('visibility', 'visible')
				})
			}
		};
	})
