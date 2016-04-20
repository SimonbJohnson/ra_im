angular.module('ra_im').directive('countryView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/country/country.html'
		};
	})
	.controller('countryController',['$http','$q','$scope'],function($http,$q,$scope){

	});

