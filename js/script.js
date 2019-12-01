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

// Car array
var vehicles = [
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

/* 
	* User's inputs are recorded in this object 
	* Variables being used:
		* noOfDays - taken from rentalLength function
		* groupSize - taken from groupSizeCalculator function
*/
var userDetails = {};

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
	clearCards();
	rentalLength();
	groupSizeCalculator();
	console.log(userDetails);
	filterCars();
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
	}
	// Allows the user to be able to view the vehicle inofrmation modal
	openVehicleInfo();
	selctVehicle();
}

// Making a selction of vehicle
function selctVehicle(){
	$('.select-car-btn').on('click', function(){
		console.log(this.id);
		// Gives the user feedback to show them that the car has been selected
		for(var i=0; i<vehicles.length; i++){
			if(this.id == vehicles[i].id){
				$(this.id).addClass('selected-vehicle');
			}
		}
		userDetails.selectedVehicle = this.id;
		console.log(userDetails);
	});
}

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
				'Petrol Consumption: ' + vehicles[i].fuelConsumption + 'L/100km' +
			'</div>' +
		'</div>' +
	'</div>';
}

// Function to open the vehicle modal
function openVehicleInfo(){
	$('.btn-cards').on('click', function(){
		// Shows the id of the vehicle that was clicked in the console, used for trouble shooting 
		console.log(this.id);
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
		// Used for trouble shooting to make sure that the button press was being recorded
		console.log('Close Modal');
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


var map;
function initMap() {
	// Needed to make routues between places. It will open a new object called 'dircetionsService' 
	var directionsService = new google.maps.DirectionsService;
	var directionsRenderer = new google.maps.DirectionsRenderer;
	// Creating the new map object
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: -41.010786, lng: 175.325764}  
	});
}

