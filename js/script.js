console.log('this is working');

// accessing apiKey from config.json
// apiKey = '[{"key" : "yourKeyGoesHere"}]';
var myKey = JSON.parse(apiKey); // Convert JSON data into js object

// Dynamically creating the script element
var script = document.createElement('script');
// Giving the src attribute to the google plug in from external json file
script.src = 'https://maps.googleapis.com/maps/api/js?key=' + myKey[0].key + '&callback=initMap';
// Appending to the body of index.html
document.getElementsByTagName('body')[0].appendChild(script);

// Vehicle array
let vehicles = [
	{
		id : 101,
		make : 'Suzuki',
		model : 'GSX150',
		type : 'Motor Bike',
		costPerDay : 109,
		minCapacity : 1,
		maxCapacity: 1,
		fuelConsumption : 3.7,
		minRental : 1,
		maxRental : 5,
		img1 : 'suzukiGsx1',
		img2 : 'suzukiGsx2',
		img3 : 'suzukiGsx3'
	},
	{
		id : 102,
		make : 'Suzuki',
		model : 'Swift',
		type : 'Small Car',
		costPerDay : 129,
		minCapacity : 1,
		maxCapacity: 2,
		fuelConsumption : 8.5,
		minRental : 1,
		maxRental : 10,
		img1 : 'suzukiSwift1',
		img2 : 'suzukiSwift2',
		img3 : 'suzukiSwift3'
	},
	{
		id : 103,
		make : 'Mazda',
		model : '6',
		type : 'Big Car',
		costPerDay : 144,
		minCapacity : 1,
		maxCapacity: 5,
		fuelConsumption : 9.7,
		minRental : 3,
		maxRental : 10,
		img1 : 'mazdaSix1',
		img2 : 'mazdaSix2',
		img3 : 'mazdaSix3'
	},
	{
		id : 104,
		make : 'Fiat',
		model : 'Ducato',
		type : 'Mobile Home',
		costPerDay : 200,
		minCapacity : 2,
		maxCapacity: 6,
		fuelConsumption : 17,
		minRental : 2,
		maxRental : 15,
		img1 : 'fiatDucato1',
		img2 : 'fiatDucato2',
		img3 : 'fiatDucato3'
	}
];

// -------------- Hides all sections till preseeding button is pressed --------------
$('#groupDetailsScreen').hide();
$('#vehicleSelectScreen').hide();
$('#plotCourseScreen').hide();
$('#bookTripScreen').hide();
$('#bookTripBtn').hide();

/* 
	* User's inputs are recorded in this object 
	* Variables being used:
		* noOfDays - taken from rentalLength function
		* groupSize - taken from groupSizeCalculator function
		* selectedVehicle - taken from selctVehicle function
		* tDistance - taken from the calculateTotalDistanceTime function
		* tTime - taken from the calculateTotalDistanceTime function
*/
let userDetails = {
	make: '',
	tDistance: 0
};

var petrolCostPerL = 2.20;

$('#startRentalProcess').on('click', function(){
	$('#groupDetailsScreen').show();
});

/* 
	* Date pickers
	* Starting date picker
	* Ending date picker 
*/
$('#startDate').datepicker({
	// Must be written in this order for function to work
	dateFormat : 'yy-mm-dd',
	changeMonth : true,
	minDate : new Date(),
	maxDate : '+1y',
	onSelect : function(date){
		var selectDate = new Date(date);
		var mSecsInADay = 86400000;
		// Checks what day it is that the user is using datepicker
		var stDate = new Date(selectDate.getTime() + mSecsInADay);

		$('#endDate').datepicker('option', 'minDate', stDate);
		// Checks max rental from starting rental date
		var enDate = new Date(selectDate.getTime() + 15 * mSecsInADay);

		$('#endDate').datepicker('option', 'maxDate', enDate);
	}
});

$('#endDate').datepicker({
	dateFormat : 'yy-mm-dd',
	changeMonth : true
});

/* 
	* Function that works out how long the user is renting the vehicle for
	* The number of days is stored as a variable
	* Button function that records users input
*/
function rentalLength(){
	var rentalStarts = $('#startDate').datepicker('getDate');
	var rentalEnds = $('#endDate').datepicker('getDate');
	var days = (rentalEnds - rentalStarts)/1000/60/60/24;
	
	// console.log(days);
	userDetails.noOfDays = days;
	return;
}

// Clears vehicles cards to stop program from duplicating cards
function clearCards(){
	document.getElementById('vehicleCard').innerHTML = '';
}

$('#submitPartyDetailsBtn').click(function(){
	rentalLength();
	// Checks to make sure that the user has properly filled out the date 
	if(userDetails.noOfDays > 0){
		clearCards();
		groupSizeCalculator();
		filterCars();
		$('#vehicleSelectScreen').show();
		document.getElementById('groupDetailAlert').innerHTML = '';
	}
	else{
		// Alert created if the user does not fill out the required fields
		document.getElementById('groupDetailAlert').innerHTML = 
		'<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">' + 
			'Please enter ensure Pick up date, Drop off date and group size are correctly entered.' + 
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
				'<span aria-hidden="true">&times;</span>' +
			'</button>' +
		'</div>'; 
	}
});

// Group Size function
function groupSizeCalculator(){
	var amountOfPassangers = parseInt(document.getElementById('groupSize').value);
	userDetails.groupSize = amountOfPassangers;
	return;
}

/*
	* vehicle cards and modals
	* Takes the user's details from object to find suitable vehicle(s) based on rental length and number of passangers
	* Dynamically displays appropriate cards
	* Allows user to click image to display more information from modal about the vehicle
*/
// Creates vehicle cards
function displayCard(i){
	document.getElementById('vehicleCard').innerHTML += 
		'<div class="card vehicle-card" id="' + vehicles[i].id + '">' +
			// Div uses id to show an image as a div background 
			'<div id="' + vehicles[i].img1 + '" class="car-card-thumbnail vehicle-popup" data-toggle="modal" data-target="#vehicleModal">' +
				// Button to open information modal
				'<button id="' + vehicles[i].id + '" class="btn btn-sm btn-primary btn-cards">Details</button>' +
			'</div>' +
			'<div class="card-body">' +
				'<h5 class="card-title">' + vehicles[i].make + '</h5>' + 
				'<h6 class="card-title">' + vehicles[i].model + '</h6>' +
				'<button class="btn btn-sm btn-block btn-secondary select-car-btn" id="' + vehicles[i].id + '">Select</button>' +
			'</div>' +
		'</div>';
}

// Function that filters vehilces depnding on whether they fit the group criteria
function filterCars(){
	for(var j=0; j<vehicles.length; j++){
		// Finds appropriate car cards to display based on time rented and number of group members
		if((userDetails.noOfDays <= vehicles[j].maxRental) && (userDetails.noOfDays >= vehicles[j].minRental) && (userDetails.groupSize >= vehicles[j].minCapacity) && (userDetails.groupSize <= vehicles[j].maxCapacity)){
			// Function called to display the car cards
			displayCard(j);
		}
		else if((userDetails.noOfDays > 10) && (userDetails.groupSize < 2)){
			document.getElementById('vehicleCard').innerHTML += '<h2 class="display-2">No Vehilces Are avalible for your specification</h2>';
			break;
		}
	}
	// Allows the user to be able to view the vehicle inofrmation modal
	openVehicleInfo();
	selctVehicle();
}

// Making a selction of vehicle. Gives the user feedback to show them that the car has been selected
function selctVehicle(){
	$('.select-car-btn').on('click', function(){
		// Removes highlight off curent selected car
		$('.select-car-btn').removeClass('selected-vehicle');
		// Loops through all of the the cars in the array
		for(var i=0; i<vehicles.length; i++){
			// Matches the car selected id to the id in the array
			if(this.id == vehicles[i].id){
				// Adds a class to the selected car to show the user that they have selected a particular car
				$(this).addClass('selected-vehicle');
				// Stores vehicle picked from array as it's own object
				let merge = Object.assign(userDetails, vehicles[i]);
			}
		}
	});
}

$('#vehicleSubmitBtn').on('click', function(){
	if(userDetails.make === ''){
		document.getElementById('pickVehicleAlert').innerHTML = 
		'<div class="alert alert-danger alert-dismissible fade show col-12" role="alert">' + 
			'Please select a vehicle before proceeding.' + 
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
				'<span aria-hidden="true">&times;</span>' +
			'</button>' +
		'</div>'; 

	} else{
		document.getElementById('pickVehicleAlert').innerHTML = '';
		$('#plotCourseScreen').show();
	}
});

// Modal information
function displayVehicleModal(i){
	document.getElementById('vehicleInfoModal').innerHTML = 
	'<div class="modal-body">' + 
	// Contains the carousel of photos of the vehicle that the user is viewing
		'<div class="modal-carousel-conatiner">' + 
			'<div id="modalCarousel" class="carousel slide" data-ride="carousel">' +
				// Indicators at the bottom of the carousel
				'<ol class="carousel-indicators">' + 
					'<li data-target="modalCarousel" data-slide-to="0" class="active"></li>' + 
					'<li data-target="modalCarousel" data-slide-to="1"></li>' + 
					'<li data-target="modalCarousel" data-slide-to="2"></li>' + 
				'</ol>' + 
				'<div class="carousel-inner">' +
					// Carousel item 1
					'<div class="carousel-item active">' +
						'<div class="car-modal-thumbnail" id="' + vehicles[i].img1 + '"></div>' +
					'</div>' +
					// Carousel Item 2
					'<div class="carousel-item">' +
						'<div class="car-modal-thumbnail" id="' + vehicles[i].img2 + '"></div>' +
					'</div>' +
					// Carousel Item 3
					'<div class="carousel-item">' +
						'<div class="car-modal-thumbnail" id="' + vehicles[i].img3 + '"></div>' +
					'</div>' +
				'</div>' +
			'</div>' + 
			'<a class="carousel-control-prev" href="#modalCarousel" role="button" data-slide="prev">' +
				'<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
				'<span class="sr-only">Previous</span>' +
			'</a>' +
			'<a class="carousel-control-next" href="#modalCarousel" role="button" data-slide="next">' +
				'<span class="carousel-control-next-icon" aria-hidden="true"></span>' + 
				'<span class="sr-only">Next</span>' +
			'</a>' +
		'</div>' + 
		// Information about the vehicle is displayed here
		'<div class="row modal-info">' + 
		// Make and model displayed here
			'<div class="col-4">' + 
				'<h4>' + vehicles[i].make + '</h4>' + 
				'<h5>' + vehicles[i].model + '<br>' +
				vehicles[i].type + '</h5>' +
			'</div>' +
			// Shows the details of the particular vehicle that the user is viewing
			'<div class="col-8 modal-info_right">' + 
				'<h5>' + vehicles[i].minCapacity + ' Person(s) to ' + vehicles[i].maxCapacity + '<br>' +
				'$' + vehicles[i].costPerDay + ' Per Day' + '<br>' +
				'Petrol Consumption: ' + vehicles[i].fuelConsumption + 'L/100km' + '</h5>' +
			'</div>' +
		'</div>' +
	'</div>';
}

// Function to open the vehicle modal
function openVehicleInfo(){
	$('.btn-cards').on('click', function(){
		// Reveals the modal that the information is going to be shown in 
		$('.vehicle-modal').show();
		// Makes the background of the modal freeze in place
		$('body').addClass('no-scroll');
		for(var j=0; j<vehicles.length; j++) {
			// This looks at the id defined and checksfor equivalence with the vehicle's id that was clicked. It will dispaly the information
			if(this.id == vehicles[j].id) {
				// Prints the vehicles that was clicked into the modal with the correlating information
				displayVehicleModal(j);
			}
		}
	});

	// This allows the user to be able to close the modal by hitting the 'x' in the top right of the modal
	$('.close-bar').on('click', function() {
		// After the user closes the modal, the background becomes unfrozen
		$('body').removeClass('no-scroll');
		// Hides the modal on clicking the button
		$('.vehicle-modal').hide();
		// When the modal is hidden, we want to remain at the top of the scroll position
		document.body.style.position = '';
	});
	// Close the modal clicking the close button
	$('#closeVehicleInfo').on('click', function() {
		// After the user closes the modal, the background becomes unfrozen
		$('body').removeClass('no-scroll');
		$('.vehicle-modal').hide();
	});
}

// Trip details read out
function bookTripSection(){
	document.getElementById('tripDetailsReadOut').innerHTML = 
	// Number of days that the vehicle is being rented
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Number of Days rented</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.noOfDays + '</h4>' +
		'</div>' +
		'<hr>' +
	'</div>' +
	// Total rental cost
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Total Rental Cost</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>$' + userDetails.totalRentalCost + ' for ' + userDetails.noOfDays + ' day(s)</h4>' +
		'</div>' +
		'<hr>' +
	'</div>'+
	// Number of people in the group
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Group Size</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.groupSize + ' person(s)</h4>' +
		'</div>' +
		'<hr>' + 
	'</div>' +
	// Car selected
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Vehicle Selected</b>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.make + ' ' + userDetails.model + '</h4>' +
		'</div>' +
		'<hr>' +
	'</div>' +
	// Total distance Traveling
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Total Distance</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.tDistance + 'km</h4>' +
		'</div>' +
		'<hr>' +
	'</div>'+
	// Total time traveling
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Total Time</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.convertedTime + ' hours spent driving approximately</h4>' +
		'</div>' +
		'<hr>' +
	'</div>'+
	// Aproximate petrol used
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Aproximate Petrol Used</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>' + userDetails.aproxPetrolConsumption + '/L</h4>' +
		'</div>' +
		'<hr>' +
	'</div>' +
	// Aproximate petrol cost
	'<div class="row">' +
		'<div class="col-md-6">' +
			'<h4><b>Aproximate Petrol Cost</b></h4>' +
		'</div>' +
		'<div class="col-md-6">' +
			'<h4>$' + ((userDetails.aproxPetrolConsumption * petrolCostPerL).toFixed(2)) + ' total</h4>' +
		'</div>' +
		'<hr>' +
	'</div>';
}

// Book trip and hide all other sections
$('#bookTripBtn').on('click', function(){
	if(userDetails.tDistance == 0){
		alert('Please Plot Course');
	}
	else{
		console.log(userDetails);
		// Calculates the aproximate costs for renting the vehicle
		calculateCosts();
		bookTripSection();
		$('#bookTripScreen').fadeIn();
		$('#titleScreen').hide();
		$('#groupDetailsScreen').hide();
		$('#vehicleSelectScreen').hide();
		$('#plotCourseScreen').fadeOut();
	}
});

var map;
function initMap() {
	// Needed to make routues between places. It will open a new object called 'dircetionsService' 
	var directionsService = new google.maps.DirectionsService;
	var directionsRenderer = new google.maps.DirectionsRenderer({
		polylineOptions: {
		// Changes the colour of the directions line
			strokeColor: '#d7a130'
		}
	});
	var styledMapType = new google.maps.StyledMapType([
		{
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#1d2c4d"
		    }
		  ]
		},
		{
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#ebf5fe"
		    }
		  ]
		},
		{
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#000000"
		    },
		    {
		      "weight": 1
		    }
		  ]
		},
		{
		  "featureType": "administrative.country",
		  "elementType": "geometry.stroke",
		  "stylers": [
		    {
		      "color": "#4b6878"
		    }
		  ]
		},
		{
		  "featureType": "administrative.land_parcel",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#515151"
		    }
		  ]
		},
		{
		  "featureType": "administrative.province",
		  "elementType": "geometry.stroke",
		  "stylers": [
		    {
		      "color": "#4b6878"
		    }
		  ]
		},
		{
		  "featureType": "landscape.man_made",
		  "elementType": "geometry.stroke",
		  "stylers": [
		    {
		      "color": "#334e87"
		    }
		  ]
		},
		{
		  "featureType": "landscape.natural",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#000080"
		    }
		  ]
		},
		{
		  "featureType": "landscape.natural",
		  "elementType": "geometry.fill",
		  "stylers": [
		    {
		      "color": "#122d49"
		    }
		  ]
		},
		{
		  "featureType": "landscape.natural",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#d9f0dc"
		    }
		  ]
		},
		{
		  "featureType": "landscape.natural",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#000000"
		    },
		    {
		      "weight": 1
		    }
		  ]
		},
		{
		  "featureType": "landscape.natural.landcover",
		  "elementType": "geometry.fill",
		  "stylers": [
		    {
		      "color": "#131a2f"
		    }
		  ]
		},
		{
		  "featureType": "poi",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#283d6a"
		    }
		  ]
		},
		{
		  "featureType": "poi",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#6f9ba5"
		    }
		  ]
		},
		{
		  "featureType": "poi",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#1d2c4d"
		    }
		  ]
		},
		{
		  "featureType": "poi.park",
		  "elementType": "geometry.fill",
		  "stylers": [
		    {
		      "color": "#005e36"
		    }
		  ]
		},
		{
		  "featureType": "poi.park",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#ddf0e2"
		    }
		  ]
		},
		{
		  "featureType": "poi.park",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#000000"
		    },
		    {
		      "weight": 1
		    }
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#304a7d"
		    }
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#98a5be"
		    }
		  ]
		},
		{
		  "featureType": "road",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#1d2c4d"
		    }
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#2c6675"
		    }
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "geometry.stroke",
		  "stylers": [
		    {
		      "color": "#255763"
		    }
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#b0d5ce"
		    }
		  ]
		},
		{
		  "featureType": "road.highway",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#023e58"
		    }
		  ]
		},
		{
		  "featureType": "transit",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#98a5be"
		    }
		  ]
		},
		{
		  "featureType": "transit",
		  "elementType": "labels.text.stroke",
		  "stylers": [
		    {
		      "color": "#1d2c4d"
		    }
		  ]
		},
		{
		  "featureType": "transit.line",
		  "elementType": "geometry.fill",
		  "stylers": [
		    {
		      "color": "#298a09"
		    },
		    {
		      "weight": 1.5
		    }
		  ]
		},
		{
		  "featureType": "transit.station",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#3a4762"
		    }
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "geometry",
		  "stylers": [
		    {
		      "color": "#0e1626"
		    }
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "geometry.fill",
		  "stylers": [
		    {
		      "color": "#3084e0"
		    }
		  ]
		},
		{
		  "featureType": "water",
		  "elementType": "labels.text.fill",
		  "stylers": [
		    {
		      "color": "#4e6d70"
		    }
		  ]
		}
	],
	{name: 'Styled Map'});
	// Creating the new map object
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: -41.010786, lng: 175.325764}  
	});

	//Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

	directionsRenderer.setMap(map);
	// When the submit button is clicked, the function to calculate the distance between the start and stop markers are calculated
	document.getElementById('plotCourseBtn').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
		$('.directions-panel').show();
		$('#bookTripBtn').show();
	});
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
	var waypts = [];
	// Gets the user's selected stops from checkbox input for stops along the way
	var checkboxArray = document.querySelectorAll('input[type=checkbox]:checked');
	// Loop is to find if more than one waypoint has been selected
	for (var i = 0; i < checkboxArray.length; i++) {
		// If more than one point is selected, the waypoints are added to an array
		waypts.push({
			location: checkboxArray[i].value,
			stopover: true
		});
	}

	directionsService.route({
		origin: document.getElementById('startingInput').value,
		destination: document.getElementById('endingInput').value,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}, 
	function(response, status) {
		if (status === 'OK') {
			directionsRenderer.setDirections(response);
			var route = response.routes[0];
			var summaryPanel = document.getElementById('directionsPanel');
			summaryPanel.innerHTML = '';
			// For each route, display summary information.
			for (var i = 0; i < route.legs.length; i++) {
				var routeSegment = i + 1;
				summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +'</b><br>';
				summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
				summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
				summaryPanel.innerHTML += route.legs[i].distance.text + '<br>'; 
				summaryPanel.innerHTML += route.legs[i].duration.text + '<br>';
				var distance = route.legs[i].distance.text;

				// summaryPanel.innerHTML = '<b>Total Distance for trip is:' +  + '</b>';
			}
			calculateTotalDistanceTime(response);

		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function calculateTotalDistanceTime(result){
	var totalDist = 0;
	var totalTime = 0;

	var userRoute = result.routes[0];
	for(var i=0; i<userRoute.legs.length; i++){
		totalDist += userRoute.legs[i].distance.value;
		totalTime += userRoute.legs[i].duration.value;
	}
	// Converts distance from meters to kilometers
	totalDist = parseInt(totalDist / 1000);
	// Converts time from seconds to minutes
	totalTime = parseFloat((totalTime / 60 / 60).toFixed(2));
	// Adds total distance traveled to userDetails object
	userDetails.tDistance = totalDist;
	// Adds total time spent travalling to userDetails object
	userDetails.tTime = totalTime;
	document.getElementById('total').innerHTML = '';
	convertTime();
	document.getElementById('total').innerHTML += '<p><b>Total distance is: ' + userDetails.tDistance + 'km <br> Total approximate driving time ' + userDetails.convertedTime + ' </b></p>';
}
// Works out the aproximate cost for petrol
function calculateCosts(){
	// Calclulate aproximate petrol cost
	userDetails.aproxPetrolConsumption = (userDetails.fuelConsumption * (userDetails.tDistance / 100)).toFixed(2);
	// Calculates total rental cost
	userDetails.totalRentalCost = userDetails.costPerDay * userDetails.noOfDays;
}

// Calculates time
function convertTime(){
	var hours = 0;
	var minutes = 0;
	var convertedTime = '';

	hours = parseInt(userDetails.tTime);
	minutes = parseInt((userDetails.tTime % 1) * 60);

	convertedTime = hours + ' hours ' + minutes + ' minutes ';
	userDetails.convertedTime = convertedTime;

	console.log(convertedTime + userDetails.tTime + ' unconverted time');
}