// MODULE
const angularApp = angular.module('angularApp', []);

// CONTROLLERS
angularApp.controller('mainController', ['$scope', '$filter', function ($scope, $filter) {
	$scope.handle = '';

	$scope.lchandle = () => {
		return $filter('lowercase')($scope.handle);
	};

	$scope.characters = 5;

	$scope.className = 'reddy';

	$scope.rules = ['lion', 'tiger', 'Maestro', 'fish'];
}]);
