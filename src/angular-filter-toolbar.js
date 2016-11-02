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
'use strict';

var filterToolbarCore = angular.module('md-filter-toolbar-core', []);

function FilterStrategy(index) {
	this.index = index;
};

FilterStrategy.prototype.isActive = function() {
	return false;
};

FilterStrategy.prototype.description = function() {
	return '';
};

FilterStrategy.prototype.isFulfilled = function(item) {
	return true;
};

function OptionsFilterStrategy(index)  {
	FilterStrategy.call(this, index);
	this.optionSelected = null;
};

OptionsFilterStrategy.prototype = Object.create(FilterStrategy.prototype);

OptionsFilterStrategy.prototype.isActive = function() {
	return this.optionSelected !== null;
};

OptionsFilterStrategy.prototype.description = function() {
	return 'is ' + this.optionSelected;
};

OptionsFilterStrategy.prototype.isFulfilled = function(item) {
	return item[this.index] === this.optionSelected;
};

function NumberFilterStrategy(index) {
	this.filterType = {
		NONE: 0,
		EQUAL: 1,
		LESSTHAN: 2,
		GREATERTHAN: 3,
		BETWEEN: 4
	};

	FilterStrategy.call(this, index);
	this.filter = {
		type: this.filterType.NONE,
	};
};

NumberFilterStrategy.prototype = Object.create(FilterStrategy.prototype);

NumberFilterStrategy.prototype.isActive = function() {
	return this.filter.type !== this.filterType.NONE;
};

NumberFilterStrategy.prototype.description = function() {
	switch(this.filter.type) {
		case this.filterType.EQUAL:
			return 'equal to ' + this.filter.selectedValue;
	    case this.filterType.LESSTHAN:
			return 'less than ' + this.filter.selectedValue;
	    case this.filterType.GREATERTHAN:
			return 'greater than ' + this.filter.selectedValue;
	    case this.filterType.BETWEEN:
			return 'between ' + this.filter.from + ' and ' + this.filter.to;
		default:
			return '';
	}
};

NumberFilterStrategy.prototype.isFulfilled = function(item) {
	var value = item[this.index];

	switch(this.filter.type) {
	    case this.filterType.EQUAL:
			return value === this.filter.selectedValue;
	    case this.filterType.LESSTHAN:
			return value < this.filter.selectedValue;
	    case this.filterType.GREATERTHAN:
			return value > this.filter.selectedValue;
	    case this.filterType.BETWEEN:
			return value >= this.filter.from && item <= this.filter.to;
		default:
			return true;
	}
};
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
'use strict';

angular.module('md-filter-toolbar-main', [
	'md-filter-toolbar-core',
	'md-filter-toolbar-templates',
	'md-filter-toolbar-controllers',
	'md-filter-toolbar-directives',
	'md-filter-toolbar-filters']);
'use strict';

angular.module('md-filter-toolbar-templates', []);
angular.module('md-filter-toolbar-templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/mdfilternumber.html',
    "<md-select ng-model=\"numberFilter.filter.type\" ng-init=\"numberFilter.filter.type = 0\" ng-change=\"selectionChanged()\"><md-option ng-value=\"{{ 0 }}\">All</md-option><md-option ng-value=\"{{ 1 }}\">Equals</md-option><md-option ng-value=\"{{ 2 }}\">Less than</md-option><md-option ng-value=\"{{ 3 }}\">Greater than</md-option><md-option ng-value=\"{{ 4 }}\">Between</md-option></md-select><md-input-container ng-hide=\"numberFilter.filter.type === 0 || numberFilter.filter.type === 4\" flex><input type=\"number\" ng-model=\"numberFilter.filter.selectedValue\" ng-min=\"option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type > 0 && numberFilter.filter.type < 4\"><div class=\"hints\" ng-if=\"hints\">{{ hints }}</div></md-input-container><div layout=\"row\" flex ng-show=\"numberFilter.filter.type === 4\"><md-input-container flex><input type=\"number\" ng-model=\"numberFilter.filter.from\" ng-min=\"option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type === 4\"></md-input-container><md-input-container flex><input type=\"number\" ng-model=\"numberFilter.filter.to\" ng-min=\"numberFilter.filter.from + 1 || option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type === 4\"></md-input-container></div>"
  );


  $templateCache.put('templates/mdfilteroptions.html',
    "<div layout=\"row\" class=\"input-row\"><md-input-container flex><md-select ng-model=\"optionFilter.optionSelected\" ng-init=\"optionFilter.optionSelected = null\"><md-option ng-value=\"null\">All</md-option><md-option ng-value=\"opt[option.settings.value] || opt\" ng-repeat=\"opt in option.settings.options\">{{ opt[option.settings.description] || opt }}</md-option></md-select></md-input-container></div>"
  );


  $templateCache.put('templates/mdfiltertoolbar.html',
    "<div ng-cloak><md-toolbar ng-hide=\"isFilterEnabled\"><div class=\"md-toolbar-tools\"><h2><span>{{ title }}</span></h2><span flex></span><md-button class=\"md-icon-button\" aria-label=\"Filter\" ng-click=\"isFilterEnabled = true\"><md-icon><i class=\"material-icons\">filter_list</i><md-tooltip>Filter</md-tooltip></md-icon></md-button><ng-transclude></ng-transclude></div></md-toolbar><md-toolbar ng-show=\"isFilterEnabled\"><div class=\"md-toolbar-tools\"><md-button class=\"md-icon-button\" aria-label=\"Back\" ng-click=\"isFilterEnabled = false; clearFilter()\"><md-icon><i class=\"material-icons\">keyboard_backspace</i><md-tooltip>Back</md-tooltip></md-icon></md-button><form flex><input type=\"text\" ng-model=\"filter.query\" placeholder=\"search...\" style=\"width:100%; max-width:100%; color:black; padding-left:5px; border-radius:5px\"></form><md-button class=\"md-accent\" ng-show=\"options.length > 0\" ng-click=\"showMoreOptions($event)\">More</md-button></div><div ng-show=\"moreFilters.length > 0\" style=\"margin-left:15px; margin-bottom:5px; margin-right:15px\"><md-chips ng-model=\"moreFilters\" md-on-remove=\"filterRemoved($chip)\" md-removable=\"true\" readonly><md-chip-template><strong>{{ $chip.index }}</strong>: {{ $chip.description() }}</md-chip-template></md-chips></div></md-toolbar></div>"
  );


  $templateCache.put('templates/morefilters.html',
    "<md-dialog add-item-dialog><md-dialog-content class=\"md-dialog-content\"><h2 class=\"md-title\">More filters</h2><form name=\"form\" ng-submit=\"apply()\"><div layout=\"row\" class=\"input-row\" ng-repeat=\"option in options\"><md-container flex><h3 class=\"md-subhead\">{{ option.description }}</h3><md-filter-toolbar-options ng-if='option.type === \"options\"' option=\"option\" filter=\"filter\"></md-filter-toolbar-options><md-filter-toolbar-number ng-if='option.type === \"number\"' option=\"option\" filter=\"filter\"></md-filter-toolbar-number></md-container></div></form></md-dialog-content><div class=\"md-actions\"><md-button class=\"md-primary\" ng-click=\"apply()\" ng-disabled=\"form.$invalid\">Apply</md-button><md-button class=\"md-primary\" ng-click=\"cancel()\">Cancel</md-button></div></md-dialog>"
  );

}]);
