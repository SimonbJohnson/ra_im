angular.module('ra_im').directive('globalView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/global/global.html',
		};
	})
	.controller('globeController',['$http','$q','$scope','appealsService','geoService',function($http,$q,$scope,appealsService,geoService){

		var self = this;
		this.map = {};

		this.dash = {}
		this.dash.title = 'Active Country Appeals';
		this.dash.id = 'appeals';	

		this.setGlobalDash = function(dash){
			if(dash == 'appeals'){
				this.dash.title = 'Active Appeals overview';
				this.dash.id = 'appeals';
				$scope.map.removeLayer($scope.dcGeoLayer);
				$scope.map.addLayer($scope.appealsOverlay);
			}
			if(dash == 'www'){
				this.dash.title = 'Who, what, where (3W)';
				this.dash.id = 'www';
				$scope.map.removeLayer($scope.appealsOverlay);
				$scope.$broadcast('wwwStart');
			}
		}	

		this.isActive= function(dash){
			return dash==this.dash.id;
		}

		this.init = function(){

			var baselayer = new L.StamenTileLayer('toner-lite',{noWrap:true});

			$scope.map = L.map('globalmap',{
				center: [0,0],
		        zoom: 1,
		        layers: [baselayer]
			});

			    var info = L.control();

		    info.onAdd = function (map) {
		        div = L.DomUtil.create('div', 'hdx-3w-info');
		            return div;
		        };

			info.addTo($scope.map);
		};

		this.init()

	}]);