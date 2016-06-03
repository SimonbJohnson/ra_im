angular.module('ra_im').directive('wwwView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/www/www.html',
		};
	})
	.controller('wwwController',['$http','$q','$scope','geoService','wwwService',function($http,$q,$scope,geoService,wwwService){

		var self = this;

		this.wwwPromise = wwwService.getData();
		this.worldGeoPromise = geoService.getWorld();

		$q.all([this.wwwPromise,this.worldGeoPromise]).then(function(results){
			self.data = results[0];
			self.geo = results[1];
		});

		$scope.$on('wwwStart', function(event, args) {
			self.createDashboard(self.data,self.geo);
		});
  
		this.createDashboard = function(data,geo){
			dc.chartRegistry.clear();
			$('.hdx-3w-info').remove();

			var cf = crossfilter(data);
			console.log(data);
			cf.whereDim = cf.dimension(function(d){return d['#country+code']});
			cf.whoDim = cf.dimension(function(d){return d['#org']});
			cf.whatDim = cf.dimension(function(d){return d['#sector']});

			cf.whereGroup = cf.whereDim.group();
			cf.whoGroup = cf.whoDim.group();
			cf.whatGroup = cf.whatDim.group();

			cf.whoChart = dc.rowChart('#whochart');
			cf.whatChart = dc.rowChart('#whatchart');
			cf.whereChart = dc.leafletChoroplethChart('#test');

			cf.whoChart.width($('#globalmap').width()/2).height(550)
	            .dimension(cf.whoDim)
	            .group(cf.whoGroup)
	            .elasticX(true)
	            .colors(['#CCCCCC', '#EF9A9A'])
	            .colorDomain([0,1])
	            .colorAccessor(function(d, i){return 1;})
	            .ordering(function(d){ return -d.value })
	            .xAxis().ticks(5);

			cf.whatChart.width($('#globalmap').width()/2).height(550)
	            .dimension(cf.whatDim)
	            .group(cf.whatGroup)
	            .elasticX(true)
	            .colors(['#CCCCCC', '#EF9A9A'])
	            .colorDomain([0,1])
	            .colorAccessor(function(d, i){return 1;})
	            .ordering(function(d){ return -d.value })
	            .xAxis().ticks(5);

    		cf.whereChart.width($('#globalmap').width()/2).height(300)
	            .dimension(cf.whereDim)
	            .group(cf.whereGroup)
	            .center([0,0])
	            .zoom(0)    
	            .geojson(geo)
	            .colors(['#999999', '#B71C1C'])
	            .colorDomain([0, 1])
	            .colorAccessor(function (d) {
	                var c=0;
					if (d>0) {
	                    c=1;
	                }
	                return c;
	            })          
	            .featureKeyAccessor(function(feature){
	                return feature.properties['ISO_A3'];
	            })
	            .popup(function(feature){
                	return feature.properties['NAME'];
            	})
	            .renderPopup(true)
	            .featureOptions({
	                'fillColor': '#cccccc',
	                'color': '#cccccc',
	                'opacity':1,
	                'fillOpacity': 0,
	                'weight': 1
	            })
	            .createLeaflet(function(){
	                return $scope.$parent.map;
	            });             

	    	dc.renderAll();

	    	$scope.$parent.dcGeoLayer = cf.whereChart.geojsonLayer();  	             
		}			

	}]);