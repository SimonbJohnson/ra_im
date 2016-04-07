angular.module('ra_im').directive('globalView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/global/global.html',
		};
	})
	.controller('globeController',['$http',function($http){

		var parent = this;
		this.map = {};

		this.dash = {}
		this.dash.title = 'Active Appeals overview';
		this.dash.id = 'appeals';
		this.data = [];
		this.appealsUrl = 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1rVAE8b3uC_XIqU-eapUGLU7orIzYSUmvlPm9tI0bCbU/edit%3Fusp%3Dsharing';

		this.init = function(){

			var baselayer = new L.StamenTileLayer('toner-lite',{noWrap:true});

			this.map = L.map('globalmap',{
				center: [0,0],
		        zoom: 1,
		        layers: [baselayer]
			});

			$http.get(this.appealsUrl)
				.success(function(data, status, headers, config) {
				    console.log(hxlProxyToJSON(data));
				}).error(function(data, status, headers, config) {
				    console.log(data);
				});
		}

		this.setGlobalDash = function(dash){
			if(dash == 'appeals'){
				this.dash.title = 'Active Appeals overview';
				this.dash.id = 'appeals';
			}
			if(dash == '3w'){
				this.dash.title = 'Who, what, where (3W)';
				this.dash.id = '3w';
			}
		}

		this.isActive= function(dash){
			return dash==this.dash.id;
		}

		this.createAppealsMap = function(data){

		}

		this.init();

	}]);