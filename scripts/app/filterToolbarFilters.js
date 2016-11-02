'use strict';

var filterToolbarFilters = angular.module('md-filter-toolbar-filters', [
	'md-filter-toolbar-core']);

filterToolbarFilters.filter('strategy', [
	function() {

		return function(items, strategy) {
			if (!strategy) return items;

			return items.filter(function (item) {
			    return strategy.isFulfilled(item);
			});
		};

	}]);

filterToolbarFilters.filter('multiStrategy', ['$filter',
	function($filter) {

		return function(items, multiStrategy) {
			var result = items;

			angular.forEach(multiStrategy, function(filter) {
			    if (filter instanceof FilterStrategy && filter.isActive())
					result = $filter('strategy')(result, filter);
			});

			return result;
		};

	}]);