'use strict';

var filterToolbarControllers = angular.module('md-filter-toolbar-controllers', [
	'md-filter-toolbar-core',
	'md-filter-toolbar-templates']);

filterToolbarControllers.controller('FilterToolbarCtrl', ['$scope', '$mdDialog',
	function($scope, $mdDialog) {

		$scope.clearFilter = function() {
			$scope.filter = {};					
			$scope.moreFilters = [];
		};

		$scope.filterRemoved = function(chip) {
			delete $scope.filter[chip.index];
		};

		$scope.showMoreOptions = function(event) {

			function setMoreFilters(filter) {
				var newFilters = [];

				angular.forEach(filter, function (item) {
				    if (item instanceof FilterStrategy && item.isActive()) newFilters.push(item);
				});

				$scope.moreFilters = newFilters;
			};

			$mdDialog.show({
				templateUrl: 'templates/morefilters.html',
				parent: angular.element(document.body),
				clickOutsiteToClose: true,
				fullscreen: false,
				locals: { options: $scope.options },
				controller: 'MoreFiltersCtrl',
				targetEvent: event
			}).then(function(filter) {
				setMoreFilters(filter);						
				$scope.filter = angular.merge(filter, { 
				    query: $scope.filter.query 
				});
			});						
		};

		$scope.clearFilter();

	}]);

filterToolbarControllers.controller('MoreFiltersCtrl', ['$scope', '$mdDialog', 'options',
	function($scope, $mdDialog, options) {

	    $scope.filter = {};
	    $scope.options = options;
		$scope.cancel = $mdDialog.cancel;		

		$scope.apply = function() {
			$scope.form.$setSubmitted();

			if ($scope.form.$valid) {
				$mdDialog.hide($scope.filter);				
			}
		};
	}]);

filterToolbarControllers.controller('FilterToolbarOptionsCtrl', ['$scope', 
	function($scope) {

		$scope.optionFilter = new OptionsFilterStrategy($scope.option.index);

		$scope.filter[$scope.option.index] = $scope.optionFilter;

	}]);

filterToolbarControllers.controller('FilterToolbarNumberCtrl', ['$scope', 
	function($scope) {

		$scope.numberFilter = new NumberFilterStrategy($scope.option.index);
	
		$scope.filter[$scope.option.index] = $scope.numberFilter;

		$scope.selectionChanged = function () {
		    switch ($scope.numberFilter.filter.type) {
                case 0:
                    $scope.numberFilter.filter.selectedValue = '';
                    $scope.numberFilter.filter.from = '';
                    $scope.numberFilter.filter.to= '';
		            break;

		        case 4:
		            $scope.numberFilter.filter.selectedValue = '';
		            break;

		        default:
		            $scope.numberFilter.filter.from = '';
		            $scope.numberFilter.filter.to = '';
		            break;
		    };
		};

		if ('min' in $scope.option.settings && 'max' in $scope.option.settings) {
		    $scope.hints = 'Value must be between ' + $scope.option.settings.min + ' and ' + $scope.option.settings.max;
		} else if ('min' in $scope.option.settings) {
		    $scope.hints = 'Value must be greater than ' + $scope.option.settings.min;
		} else if ('max' in $scope.option.settings) {
		    $scope.hints = 'Value must be less than ' + $scope.option.settings.max;
		}		
	}]);