(function(){
	var app = angular.module('ra_im',[]);

	app.controller('pageController',function(){
		var parent = this;
		this.view='global';
		this.currentView = function(view){
			if(parent.view==view) {
				return true;
			} else {
				return false;
			}
		}
	});

	app.factory('appealsService', function($http) {
		var getData = function() {
			appealsUrl = 'https://proxy.hxlstandard.org/data.json?merge-url01=https%3A//docs.google.com/spreadsheets/d/1kyxNHb1w_X1CapmuLWxX5g-65_2KaQmk5rxgSkCAtsw/edit%3Fusp%3Dsharing&filter01=merge&merge-keys01=%23country-code&merge-tags01=%23country%2Bcode&strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%23gid%3D0';
	        return $http({method:"GET", url:appealsUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    return {getData:getData};
	});

	app.factory('geoService', function($http) {
		var getWorld = function() {
			worldUrl = 'assets/geo/worldmap_temp.json';
	        return $http({method:"GET", url:worldUrl}).then(function(result){
	            return topojson.feature(result.data,result.data.objects.geom);
	        });
	    };
	    return {getWorld:getWorld};
	});

	app.filter('nicenumber', function() {
	  return function(input) {
	    return d3.format(".3s")(input);
	  };
	});	

})();


function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}