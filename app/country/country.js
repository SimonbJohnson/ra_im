angular.module('ra_im').directive('countryView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/country/country.html'
		};
	})
	.controller('countryController',['$http','$q','$scope','$rootScope','countryService',function($http,$q,$scope,$rootScope,countryService){

		var self = this;
		this.ISO3 = '';
		this.countryName = '';
		this.NS = '';
		this.expenditure = '';
		this.income = '';
		this.staff = '';
		this.vols = '';
		this.incomeGroup = '';
		this.population = '';
		this.gdp = '';
		this.hdi = '';
		this.lifeexpectancy = '';
		this.infantMortality = '';
		this.map = '';
		this.branchesOverlay = '';
		this.appeals = [];
		this.inform = {};
		this.inform.risk = '';
		this.inform.rank = '';
		this.inform.coping = '';
		this.inform.hazard = '';
		this.inform.vulnerability = ''; 

		$scope.$on('loadCountry', function(event, args) {
			self.ISO3 = $scope.inFocusCountry;
		
			this.countryPromise = countryService.getCountryData(self.ISO3);
			this.NSPromise = countryService.getNSData(self.ISO3);
			this.branchPromise = countryService.getBranchData(self.ISO3);
			this.appealsPromise = countryService.getAppealsData(self.ISO3);
			this.informPromise = countryService.getInformData(self.ISO3);
			
			$q.all([this.countryPromise,this.NSPromise,this.branchPromise,this.appealsPromise,this.informPromise]).then(function(results){				
				if(results[0].length>0){
					self.countryName = results[0][0]['#country+name'];
					self.incomeGroup = results[0][0]['#indicator+income'];
					self.population = results[0][0]['#population'];
					self.gdp = results[0][0]['#indicator+gdp'];
					self.hdi = results[0][0]['#indicator+hdi'];
					self.lifeexpectancy = results[0][0]['#indicator+lifeexpectancy'];
					self.infantMortality = results[0][0]['#indicator+infantmortality'];
				}
				if(results[1].length>0){
					self.NS = results[1][0]['#org'];
					self.expenditure = results[1][0]['#indicator+expenditure'];
					self.income = results[1][0]['#indicator+income'];
					self.staff = results[1][0]['#indicator+staff'];
					self.vols = results[1][0]['#indicator+volunteers'];
				}
				if(results[4].length>0){
					self.inform.risk = results[4][0]['#indicator+risk'];
					self.inform.rank = results[4][0]['#indicator+rank'];
					self.inform.coping = results[4][0]['#indicator+coping'];
					self.inform.hazard = results[4][0]['#indicator+hazard'];
					self.inform.vulnerability = results[4][0]['#indicator+vulnerability'];
				} 
				if(results[2]>0){
					self.createBranchLayer(results[2]);
				}
				if(results[3]>0){
					self.appeals = results[3];
					self.appeals.forEach(function(d){
						d['#meta+budget'] = +d['#meta+budget'];
						d['#meta+budget+formatted'] = d3.format(".3s")(d['#meta+budget']);
						d['#date+start+js'] = d3.time.format('%d/%m/%Y').parse(d['#date+start']);
					});
				}
				$rootScope.$broadcast('endloading');
			});
		});

		this.createBranchLayer = function(data){

			var markers = [];

		    data.forEach(function(d){
		    	if(!isNaN(d['#geo+lat']) && d['#geo+lat']!='' && !isNaN(d['#geo+lon']) && d['#geo+lon']!=''){
		    		if(d['#loc+branch+code+type'] == '1'){
		    			radius = 5;
		    			opacity = 0.8;
		    		} else {
		    			radius = 3
		    			opacity = 0.6;
		    		}

			        var marker = L.circleMarker([d['#geo+lat'], d['#geo+lon']],{
			            radius: radius,
			            fillColor: "#B71C1C",
			            color: "#B71C1C",
			            weight:0,
			            opacity: opacity,
			            fillOpacity: opacity,
			        });

			        /*marker.on('click',function(){
			        	self.branchData = {
			        		'ns':d['#org'],
			        		'city':d['#loc+city'],
			        		'country':d['#country+name'],
			        		'branchtype':d['#loc+branch+type'],
			        		'address':d['#loc+address+branch'],
			        		'telephone':d['org+telephone']
			        	};
			        	self.branchFocus = true;
			        	$scope.$digest();
			        });*/

			        markers.push(marker);
			    }

		    });

		    this.branchesOverlay = new L.featureGroup(markers).addTo(this.map);

		    this.map.fitBounds(this.branchesOverlay.getBounds());
		}

		this.init = function(){

			var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			});

			this.map = L.map('countrymap',{
				center: [0,0],
		        zoom: 1,
		        layers: [osm]
			});

		};

		this.init()

	}]);

