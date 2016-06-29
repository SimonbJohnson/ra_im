(function(){
	var app = angular.module('ra_im',[]);

	app.controller('pageController',['$scope',function($scope){
		var parent = this;
		this.view='global';

		this.currentView = function(view){
			if(parent.view==view) {
				return true;
			} else {
				return false;
			}
		}

		this.setView = function(view){
			parent.view = view;
		}

		this.setCountry = function(iso3){
			this.setView('country');
			$scope.inFocusCountry = iso3;
			$scope.$broadcast('startloading');
			$scope.$broadcast('loadCountry');
		}

		$scope.$on('startloading', function(event, args) {
			$('#loading').modal('show');
		});

		$scope.$on('endloading', function(event, args) {
			$('#loading').modal('hide');
		});
		$scope.$broadcast('startloading');
	}]);

	app.factory('appealsService', function($http) {
		var getData = function() {
			appealsUrl = 'https://proxy.hxlstandard.org/data.json?filter01=replace-map&merge-url02=https%3A//docs.google.com/spreadsheets/d/1kyxNHb1w_X1CapmuLWxX5g-65_2KaQmk5rxgSkCAtsw/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&replace-map-url01=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D493036357%26single%3Dtrue%26output%3Dcsv&merge-tags02=country%2Bcode&strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%3Fusp%3Dsharing&merge-keys02=country%2Bname&filter02=merge';
	        return $http({method:"GET", url:appealsUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    return {getData:getData};
	});

	app.factory('branchesService', function($http) {
		var getData = function() {
			branchesUrl = 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1UMiFwFMijHlsRP_OM5zKNl6FFH5BXQ91qzcD8YnU4Ao/pub%3Fgid%3D396841826%26single%3Dtrue%26output%3Dcsv&filter01=cut&cut-include-tags01=country%2Cloc%2Bbranch%2Btype%2Cloc%2Bbranch%2Btype%2Bcode%2Corg-telephone-fax-email-website%2Cloc%2Bcity%2Cgeo%2Blat%2Cgeo%2Blon%2C%23loc%2Bbranch%2Baddress%2C%23org%2Btelephone&strip-headers=on';
	        return $http({method:"GET", url:branchesUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    return {getData:getData};
	});

	app.factory('countryService', function($http) {
		var getCountryData = function(iso3) {
			countryUrl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&filter01=select&select-query01-01=country%2Bcode%3D'+iso3+'&url=https%3A//docs.google.com/spreadsheets/d/1kyxNHb1w_X1CapmuLWxX5g-65_2KaQmk5rxgSkCAtsw/edit%23gid%3D0';
	        return $http({method:"GET", url:countryUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    var getNSData = function(iso3) {
			countryUrl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&filter01=select&select-query01-01=country%2Bcode%3D'+iso3+'&url=https%3A//docs.google.com/spreadsheets/d/1tke3ftPg2QP7HmM36OmJetW8g4Wt0iDH_HcUIvepFZA/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv';
	        return $http({method:"GET", url:countryUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	   	var getBranchData = function(iso3) {
			countryUrl = 'https://proxy.hxlstandard.org/data.json?filter01=cut&select-query02-01=country%2Bcode%3D'+iso3+'&strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1UMiFwFMijHlsRP_OM5zKNl6FFH5BXQ91qzcD8YnU4Ao/pub%3Fgid%3D396841826%26single%3Dtrue%26output%3Dcsv&filter02=select&cut-include-tags01=country%2Cloc%2Bbranch%2Btype%2Cloc%2Bbranch%2Btype%2Bcode%2Corg-telephone-fax-email-website%2Cloc%2Bcity%2Cgeo%2Blat%2Cgeo%2Blon%2C%23loc%2Bbranch%2Baddress%2C%23org%2Btelephone';
	        return $http({method:"GET", url:countryUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    var getAppealsData = function(iso3) {
			countryUrl = 'https://proxy.hxlstandard.org/data.json?select-query03-01=country%2Bcode%3D'+iso3+'&strip-headers=on&filter01=replace-map&merge-url02=https%3A//docs.google.com/spreadsheets/d/1kyxNHb1w_X1CapmuLWxX5g-65_2KaQmk5rxgSkCAtsw/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&replace-map-url01=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D493036357%26single%3Dtrue%26output%3Dcsv&filter03=select&url=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%3Fusp%3Dsharing&merge-tags02=country%2Bcode&merge-keys02=country%2Bname&filter02=merge';
	        return $http({method:"GET", url:countryUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    };
	    var getInformData = function(iso3){
			countryUrl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1Wac8ml3B-ybPZLvtpqhxF9tLN7WBVaQGCP5njgKgVPc/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&filter01=select&select-query01-01=country%2Bcode%3D'+iso3;
	    	return $http({method:"GET", url:countryUrl}).then(function(result){
	            return hxlProxyToJSON(result.data);
	        });
	    }
	    return {getCountryData:getCountryData,getNSData:getNSData,getBranchData:getBranchData,getAppealsData:getAppealsData,getInformData:getInformData};
	});		

	app.factory('wwwService', function($http) {
		var getData = function() {
			wwwUrl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1Yq9uFEM0FKFDfhi7rlkhU2L6TmNOSky91MZSFn24F7Y/edit%23gid%3D0&force=1';
	        return $http({method:"GET", url:wwwUrl}).then(function(result){
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
	  	if(input>99.99){
		  	var num = d3.format(".3s")(input)
		  	if(num.substr(num.length - 1)=='G'){
		  		num = num.substr(0,num.length - 1)+' bil';
		  	}
		} else {
			var num = d3.format(".2n")(input);	
		}
	    return num;
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