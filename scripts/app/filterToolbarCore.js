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