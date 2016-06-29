angular.module('ra_im').directive('branchesView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/branches/branches.html',
		};
	})
	.controller('branchesController',['$http','$q','$scope','$rootScope','branchesService',function($http,$q,$scope,$rootScope,branchesService){

		var self = this;

		this.branchesData = '';
		this.branchFocus = false;
		this.branchData = {};
		$scope.$parent.branchesOverlay = 'empty';

		$scope.$on('branchesStart', function(event, args) {
			if(this.branchesData!=''){
				this.branchesPromise = branchesService.getData();
			}

			$q.all([this.branchesPromise]).then(function(results){
				if(self.branchesData==''){
					self.branchesData = results[0];
					self.createBranchesMap(results[0]);
					$rootScope.$broadcast('endloading');
				}
			});		
		});
  
		this.createBranchesMap = function(data){

			var markers = [];

		    data.forEach(function(d){
		    	if(!isNaN(d['#geo+lat']) && d['#geo+lat']!='' && !isNaN(d['#geo+lon']) && d['#geo+lon']!=''){
		    		if(d['#loc+branch+code+type'] == '1'){
		    			radius = 4;
		    			opacity = 0.8;
		    		} else {
		    			radius = 2
		    			opacity = 0.5;
		    		}

			        var marker = L.circleMarker([d['#geo+lat'], d['#geo+lon']],{
			            radius: radius,
			            fillColor: "#B71C1C",
			            color: "#B71C1C",
			            weight:0,
			            opacity: opacity,
			            fillOpacity: opacity,
			        });

			        marker.on('click',function(){
			        	self.branchData = {
			        		'ns':d['#org'],
			        		'city':d['#loc+city'],
			        		'country':d['#country+name'],
			        		'branchtype':d['#loc+branch+type'],
			        		'address':d['#loc+address+branch'],
			        		'telephone':d['#org+telephone'],
			        		'countrycode':d['#country+code']
			        	};
			        	self.branchFocus = true;
			        	$scope.$digest();
			        });

			        markers.push(marker);
			    }

		    });

		    $scope.$parent.branchesOverlay = new L.featureGroup(markers).addTo($scope.map);
		}

	}]);