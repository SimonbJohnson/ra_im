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
				$scope.map.addLayer($scope.appealsOverlay);
			}
			if(dash == '3w'){
				this.dash.title = 'Who, what, where (3W)';
				this.dash.id = '3w';
				$scope.map.removeLayer($scope.appealsOverlay);
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
		};

		this.init()

	}]);