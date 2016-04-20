angular.module('ra_im').directive('appealsView', function(){
		return {
			restrict:'E',
			templateUrl: 'app/appeals/appeals.html',
		};
	})
	.controller('appealsController',['$http','$q','$scope','appealsService','geoService',function($http,$q,$scope,appealsService,geoService){

		var self = this;

		this.sub = 'overview';

		this.appeals = [];
		this.focusAppeals = [];

		this.largest = [];
		this.latest = [];

		this.numberOfAppeals = 'Loading'

		this.appealsPromise = appealsService.getData();
		this.worldGeoPromise = geoService.getWorld();

		this.appealsPromise.then(function(data){
			self.appeals = data;
			self.numberOfAppeals = data.length;
			data.forEach(function(d){
				d['#meta+budget'] = +d['#meta+budget'];
				d['#meta+budget+formatted'] = d3.format(".3s")(d['#meta+budget']);
				d['#date+start+js'] = d3.time.format('%d/%m/%Y').parse(d['#date+start']);
			});

			data.sort(function(a,b) {return (a['#meta+budget'] > b['#meta+budget']) ? -1 : ((b['#meta+budget'] > a['#meta+budget']) ? 1 : 0);} );
			self.largest = data.slice(0,3);
			data.sort(function(a,b) {return (a['#date+start+js'] > b['#date+start+js']) ? -1 : ((b['#date+start+js'] > a['#date+start+js']) ? 1 : 0);} );
			self.latest = data.slice(0,3);
		});

		$q.all([this.appealsPromise,this.worldGeoPromise]).then(function(results){
			self.createAppealsMap(results[0],results[1]);
			self.createAppealsGraph(results[0]);
		});			

		/*this.setGlobalDash = function(dash){
			if(dash == 'appeals'){
				this.dash.title = 'Active Appeals overview';
				this.dash.id = 'appeals';
				$scope.map.addLayer(this.appealsOverlay);
			}
			if(dash == '3w'){
				this.dash.title = 'Who, what, where (3W)';
				this.dash.id = '3w';
				$scope.map.removeLayer(this.appealsOverlay);
			}
		}*/

		this.setFocusAppeals = function(iso3){
			this.focusAppeals = [];
			this.appeals.forEach(function(d){
				if(d['#country+code']==iso3){
					self.focusAppeals.push(d);
				}
			});
			if(this.focusAppeals.length>0){this.createAppealPie(this.focusAppeals[0])}
			$scope.$digest();
		}

		this.setFocusAppealByName = function(name){
			this.focusAppeals = [];
			this.appeals.forEach(function(d){
				if(d['#meta+title']==name){
					self.focusAppeals.push(d);
				}
			});
			if(this.focusAppeals.length>0){this.createAppealPie(this.focusAppeals[0])}
			$scope.$digest();
		}

		this.clearFocusAppeal = function(name){
			this.focusAppeals = [];
		}		

		this.showFocusAppeal = function(){
			if(this.focusAppeals.length==0){
				return false;
			}
			return true;
		}

		this.createAppealPie = function(appeal){

			var width = 200;
			$("#appealPie").html("");

			var svg = d3.select("#appealPie").append("svg")
				.attr("width", width)
			    .attr("height", width);

			var radius = width/2;

			var fundingArc = d3.svg.arc()
		    	.innerRadius(radius-20)
		    	.outerRadius(radius)
		    	.startAngle(0)
		    	.endAngle(Math.PI*2*appeal['#meta+funding']/appeal['#meta+budget']);

		    var budgetArc = d3.svg.arc()
		    	.innerRadius(radius-20)
		    	.outerRadius(radius)
		    	.startAngle(0)
		    	.endAngle(Math.PI*2);

		    svg.append("path")
			    .style("fill", "#dfdfdf")
			    .attr("d", budgetArc)
			    .attr("transform", "translate("+(width/2)+","+(width/2)+")");

		    svg.append("path")
			    .style("fill", "b71c1c")
			    .attr("d", fundingArc)
			    .attr("transform", "translate("+(width/2)+","+(width/2)+")");

			svg.append("text")
				.attr("x",width/2)
				.attr("y",width/2+20)
				.text(d3.format(".0%")(appeal["#meta+funding"]/appeal["#meta+budget"]))
				.style("text-anchor", "middle")
				.attr("class","keyfigure");			    		
		}	

		this.createAppealsMap = function(data,geo){

			var style = function(feature) {
				var color = '#dddddd';
				var fillOpacity = 0;

				if(data.map(function(e) { return e['#country+code']; }).indexOf(feature.properties['ISO_A3'])>-1){
					color = '#B71C1C';
					fillOpacity = 0.7;
				};

            	return {
                        'color': color,
                        'fillcolor': color,
                        'weight': 1,
                        'opacity': 0.7,
                        'fillOpacity':fillOpacity
                    };
    		}    

			$scope.$parent.appealsOverlay = L.geoJson(geo,{
				style:style,
    			onEachFeature: onEachFeature
    		})
    		.addTo($scope.map);

			function onEachFeature(feature, layer) {
			    layer.on('mouseover',function(f,l){
			    	self.setFocusAppeals(f.target.feature.properties['ISO_A3']);
			    });
			    layer.on('mouseout',function(f,l){
			    	self.focusAppeals = []
			    	$scope.$digest();
			    });
			}
		}

		this.createAppealsGraph = function(data){

			var regions = [];

			data.forEach(function(d){
				if(regions.map(function(e) { return e['key']; }).indexOf(d['#region'])==-1){
					regions.push({key:d['#region'],funding:0,budget:0})
				}
				regions[regions.map(function(e) { return e['key']; }).indexOf(d['#region'])].funding += +d['#meta+funding'];
				regions[regions.map(function(e) { return e['key']; }).indexOf(d['#region'])].budget += +d['#meta+budget'];
			});
			
			var margin = {top: 40, right: 30, bottom: 90, left: 30},
		        width = $("#appealsinfo").width() - margin.left - margin.right,
		        height =  230 - margin.top - margin.bottom;
		
 			var x = d3.scale.ordinal()
        		.rangeRoundBands([0, width]);

    		var y = d3.scale.linear()
        		.range([height,0]); 

    		var xAxis = d3.svg.axis()
        		.scale(x)
        		.orient("bottom");
      
		    x.domain(regions.map(function(d) {return d.key; }));

		    var maxy = d3.max(regions,function(d){
		    	return d.budget;
		    });

		    y.domain([0,maxy]);

			var svg = d3.select("#appealsgraph").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			    .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    		svg.append("g")
		        .attr("class", "x axis baraxis")
		        .attr("transform", "translate(0," + height + ")")
		        .call(xAxis)
		        .selectAll("text")  
		        .style("text-anchor", "end")
		         .attr("transform", function(d) {
		            return "rotate(-35)" 
		        });			    		    

			svg.append("g").selectAll("rect")
	            .data(regions)
	            .enter()
	            .append("rect") 
	            .attr("x", function(d,i) { return x(d.key)+3; })
	            .attr("width", x.rangeBand()-6)
	            .attr("y", function(d){return y(d.budget);})
	            .attr("height", function(d) {return height-y(d.budget);})
	            .attr("class","d3standardlight");

			svg.append("g").selectAll("rect")
	            .data(regions)
	            .enter()
	            .append("rect") 
	            .attr("x", function(d,i) { return x(d.key)+3; })
	            .attr("width", x.rangeBand()-6)
	            .attr("y", function(d){return y(d.funding);})
	            .attr("height", function(d) {return height-y(d.funding);})
	            .attr("class","d3standarddark");

			svg.append("g").selectAll("text")
	            .data(regions)
	            .enter()
	            .append("text") 
	            .attr("x", function(d){return x(d.key)+x.rangeBand()/2})
	            .attr("y", function(d) {return y(d.budget)-25;})
	            .text(function(d){
	            	return d3.format(".3s")(d.budget);
	            })
	            .style("text-anchor", "middle");

			svg.append("g").selectAll("text")
	            .data(regions)
	            .enter()
	            .append("text") 
	            .attr("x", function(d){return x(d.key)+x.rangeBand()/2})
	            .attr("y", function(d) {return y(d.budget)-10;})
	            .text(function(d){
	            	return "("+d3.format(".0%")(d.funding/d.budget)+")";
	            })
	            .style("text-anchor", "middle");	                       	            
		}

	}]);