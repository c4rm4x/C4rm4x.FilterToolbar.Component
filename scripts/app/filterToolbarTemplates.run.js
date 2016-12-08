angular.module('md-filter-toolbar-templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/mdfilternumber.html',
    "<md-select ng-model=\"numberFilter.filter.type\" ng-init=\"numberFilter.filter.type = 0\" ng-change=\"selectionChanged()\"><md-option ng-value=\"{{ 0 }}\">All</md-option><md-option ng-value=\"{{ 1 }}\">Equals</md-option><md-option ng-value=\"{{ 2 }}\">Less than</md-option><md-option ng-value=\"{{ 3 }}\">Greater than</md-option><md-option ng-value=\"{{ 4 }}\">Between</md-option></md-select><md-input-container ng-hide=\"numberFilter.filter.type === 0 || numberFilter.filter.type === 4\" flex><input type=\"number\" ng-model=\"numberFilter.filter.selectedValue\" ng-min=\"option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type > 0 && numberFilter.filter.type < 4\"><div class=\"hints\" ng-if=\"hints\">{{ hints }}</div></md-input-container><div layout=\"row\" flex ng-show=\"numberFilter.filter.type === 4\"><md-input-container flex><input type=\"number\" ng-model=\"numberFilter.filter.from\" ng-min=\"option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type === 4\"></md-input-container><md-input-container flex><input type=\"number\" ng-model=\"numberFilter.filter.to\" ng-min=\"numberFilter.filter.from + 1 || option.settings.min\" ng-max=\"option.settings.max\" ng-required=\"numberFilter.filter.type === 4\"></md-input-container></div>"
  );


  $templateCache.put('templates/mdfilteroptions.html',
    "<div layout=\"row\" class=\"input-row\"><md-input-container flex><md-select ng-model=\"optionFilter.optionSelected\" ng-init=\"optionFilter.optionSelected = null\"><md-option ng-value=\"null\">All</md-option><md-option ng-value=\"opt[option.settings.value] || opt\" ng-repeat=\"opt in option.settings.options\">{{ opt[option.settings.description] || opt }}</md-option></md-select></md-input-container></div>"
  );


  $templateCache.put('templates/mdfiltertoolbar.html',
    "<div ng-cloak><md-toolbar ng-hide=\"isFilterEnabled\"><div class=\"md-toolbar-tools\"><h2><span>{{ title }}</span></h2><span flex></span><md-button class=\"md-icon-button\" aria-label=\"Filter\" ng-click=\"isFilterEnabled = true\"><md-icon><i class=\"material-icons\">filter_list</i><md-tooltip>Filter</md-tooltip></md-icon></md-button><ng-transclude></ng-transclude></div></md-toolbar><md-toolbar ng-show=\"isFilterEnabled\"><div class=\"md-toolbar-tools\"><md-button class=\"md-icon-button\" aria-label=\"Back\" ng-click=\"isFilterEnabled = false; clearFilter()\"><md-icon><i class=\"material-icons\">keyboard_backspace</i><md-tooltip>Back</md-tooltip></md-icon></md-button><form flex><input type=\"text\" ng-model=\"filter.query\" placeholder=\"search...\" style=\"width:100%; max-width:100%; color:black; padding-left:5px; border-radius:5px\" ng-disabled=\"queryDisabled\"></form><md-button class=\"md-accent\" ng-show=\"options.length > 0\" ng-click=\"showMoreOptions($event)\">More</md-button></div><div ng-show=\"moreFilters.length > 0\" style=\"margin-left:15px; margin-bottom:5px; margin-right:15px\"><md-chips ng-model=\"moreFilters\" md-on-remove=\"filterRemoved($chip)\" md-removable=\"true\" readonly><md-chip-template><strong>{{ $chip.index }}</strong>: {{ $chip.description() }}</md-chip-template></md-chips></div></md-toolbar></div>"
  );


  $templateCache.put('templates/morefilters.html',
    "<md-dialog add-item-dialog><md-dialog-content class=\"md-dialog-content\"><h2 class=\"md-title\">More filters</h2><form name=\"form\" ng-submit=\"apply()\"><div layout=\"row\" class=\"input-row\" ng-repeat=\"option in options\"><md-container flex><h3 class=\"md-subhead\">{{ option.description }}</h3><md-filter-toolbar-options ng-if='option.type === \"options\"' option=\"option\" filter=\"filter\"></md-filter-toolbar-options><md-filter-toolbar-number ng-if='option.type === \"number\"' option=\"option\" filter=\"filter\"></md-filter-toolbar-number></md-container></div></form></md-dialog-content><div class=\"md-actions\"><md-button class=\"md-primary\" ng-click=\"apply()\" ng-disabled=\"form.$invalid\">Apply</md-button><md-button class=\"md-primary\" ng-click=\"cancel()\">Cancel</md-button></div></md-dialog>"
  );

}]);
