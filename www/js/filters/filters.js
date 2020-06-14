'use strict';
angular.module('AppModule')

.filter("format", function () {
			return function (input) {
				var args = arguments;
				return input.replace(/\{(\d+)\}/g, function (match, capture) {
					return args[1*capture + 1];
				});
			};
		})

.filter('rawHtml', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}])

.filter('timeSinceNow', ['$translate','$filter', function ($translate,$filter) {
    return function (val) {

    	var YEAR = (1000 * 3600 * 24 *365);
    	var MONTH = (1000 * 3600 * 24 * 30);
    	var DAY = (1000 * 3600 * 24);
    	var HOUR = (1000 * 3600);
    	var MINUTE = (1000 * 60);


    	var date1 = new Date(val);
    	var date2 = new Date();
    	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    	var years = Math.floor(timeDiff / YEAR);
    	var result;
    	if (years > 0) {
    		if(years == 1){
    			result = $translate.instant("year_ago_txt");
    		}
    		else{
    			result = $translate.instant("years_ago_txt");
    		}
    		return  $filter('format')(result, years);
    	}
    	var months = Math.floor(timeDiff / MONTH);
    	if (months > 0) {
    		if(months == 1){
    			result = $translate.instant("month_ago_txt");
    		}
    		else{
    			result = $translate.instant("months_ago_txt");
    		}
    		return $filter('format')(result, months);
    	}
    	var days = Math.floor(timeDiff / DAY);
    	if (days > 0) {
    		if(days == 1){
    			result = $translate.instant("day_ago_txt");
    		}
    		else{
    			result = $translate.instant("days_ago_txt");
    		}
    		return  $filter('format')(result, days);
    	}

      var hours = Math.floor(timeDiff / HOUR);
    	if (hours > 0) {
    		if(hours == 1){
    			result = $translate.instant("hour_ago_txt");
    		}
    		else{
    			result = $translate.instant("hours_ago_txt");
    		}
    		return  $filter('format')(result, hours);
    	}

     var minutes = Math.floor(timeDiff / MINUTE);
    	if (minutes > 0) {
    		if(minutes == 1){
    			result = $translate.instant("minute_ago_txt");
    		}
    		else{
    			result = $translate.instant("minutes_ago_txt");
    		}
    		return  $filter('format')(result, minutes);
    	}
      return $translate.instant("now_txt");
    };
}])

.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }])
;
