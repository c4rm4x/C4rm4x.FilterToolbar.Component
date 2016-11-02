'use strict';

var filterToolBarDirectives = angular.module('md-filter-toolbar-directives',  [
	'md-filter-toolbar-controllers',
	'md-filter-toolbar-templates',
	'ngMaterial',
    'ngMessages']);

filterToolBarDirectives.directive('mdFilterToolbar', [
	function() {
		return  {
			restrict: 'E',
			scope: {
				filter: '=',
				title: '@',
				options: '='
			},
			templateUrl: 'templates/mdfiltertoolbar.html',
			transclude: true,
			controller: 'FilterToolbarCtrl'
		}
	}]);

filterToolBarDirectives.directive('mdFilterToolbarOptions', [
	function() {
		return {
			restrict: 'E',
			scope: {
				filter: '=',
				option: '='
			},
			templateUrl: 'templates/mdfilteroptions.html',
			controller: 'FilterToolbarOptionsCtrl'
		}
	}]);

filterToolBarDirectives.directive('mdFilterToolbarNumber', [
	function() {
		return {
			restrict: 'E',
			scope: {
				filter: '=',
				option: '='
			},
			templateUrl: 'templates/mdfilternumber.html',
			controller: 'FilterToolbarNumberCtrl'
		}
	}]);
