var express    = require('express');
var bodyParser = require('body-parser');
var path    = require("path");
var app        = express();
var morgan     = require('morgan');
var cors = require('cors');
app.use(express.static('app'))
app.use('/static', express.static('app'))

app.use(cors());
app.options('*', cors());

var dataSet = [
	{
	'userID' : 0,
	'user' : 'user',
	'password': 'password',
	'trip': [{
		'tripID': 0,
		'tripNumber' : 'CX5810',
		'Class' : 'Economy',
		'from': 'Beijing',
		'fromShort': 'PEK',
		'to': 'Hong Kong',
		'toShort': 'HKG',
		'toPicture' : 'hongkong.jpeg',
		'fromDate': '02Jan19 15:45',
		'fromDateShort': '02 Jan',
		'toDate': '02Jan19 18:20',
		'PaggaeAllow': '32kg',
		'luggagePic': [
			{
			'picid': '0',
			'path': 'public/pic1.jpg'
			},
			{
			'picid': '0',
			'path': 'public/pic2.jpg'
			}

		],
		'luggage':[{
			'luggageID' : 1,
			'weight': 10,
			'status': 'onBoard',
			'location': 'Hong Kong International Airport',
			'timeline':[
				{
					'time': "02 Jan19 11:27",
					'details': "Checked at PEK"
				},
				{
					'time': "02 Jan19 12:40",
					'details': "Onboard at PEK"
				},
				{
					'time': "02 Jan19 14:20",
					'details': "Offboard at HKG"
				},
				{
					'time': '',
					'details': "On belt at HKG"
				}
			]
			},{
			'luggageID' : 2,
			'weight': 23,
			'status': 'onBoard',
			'location': 'Hong Kong International Airport',
			'timeline':[
				{
					'time': "02 Jan19 11:28",
					'details': "Checked at PEK"
				},
				{
					'time': "02 Jan19 12:41",
					'details': "Onboard at PEK"
				},
				{
					'time': "02 Jan19 14:20",
					'details': "Offboard at HKG"
				},
				{
					'time': '',
					'details': "On belt at HKG"
				}
			]
			}]
		},{
			'tripID': 1,
			'tripNumber' : 'CX5710',
			'Class' :'Business',
			'from': 'Hong Kong',
			'fromShort': 'HKG',
			'to': 'Beijing',
			'toShort': 'PEK',
			'toPicture' : 'beijing.png',
			'fromDate': '04Jan19 15:45',
			'fromDateShort': '04 Jan',
			'toDate': '04Jan19 18:20',
			'PaggaeAllow': '32kg',
			'luggage':[]
			}
		],
		'tripHistory': [{
			'tripID': 2,
			'tripNumber' : 'CX6620',
			'Class' : 'Business',
			'from': 'New York',
			'fromShort': 'NYC',
			'to': 'Hong Kong',
			'toShort': 'HKG',
			'toPicture' : 'hongkong.jpeg',
			'fromDate': '02Jan18 15:45',
			'fromDateShort': '02 Jan',
			'toDate': '02Jan18 18:20',
			'PaggaeAllow': '32kg',
			'luggage':[{
				'luggageID' : 11,
				'weight': 10,
				'status': 'on belt',
				'location': 'Hong Kong International Airport',
				'timeline':[
					{
						'time': "02Jan19 14:20",
						'details': "Offboard at HKG"
					},{
						'time': "02Jan19 12:40",
						'details': "Onboard at BER"
					},{
						'time': "02Jan19 11:27",
						'details': "Checked at BER"
					}
				]
				},{
				'luggageID' : 52,
				'weight': 23,
				'status': 'onBoard',
				'location': 'Berlin International Airport',
				'timeline':[
					{
						'time': "02Jan19 14:20",
						'details': "Offboard at HKG"
					},{
						'time': "02Jan19 12:40",
						'details': "Onboard at BER"
					},{
						'time': "02Jan19 11:27",
						'details': "Checked at BER"
					}
				]
				}]
			},{
				'tripID': 3,
				'tripNumber' : 'CX5710',
				'Class' :'Business',
				'from': 'Hong Kong',
				'fromShort': 'HKG',
				'to': 'Beijing',
				'toShort': 'PEK',
				'toPicture' : 'beijing.png',
				'fromDate': '04Jan19 15:45',
				'fromDateShort': '04 Jan',
				'toDate': '04Jan19 18:20',
				'PaggaeAllow': '32kg',
				'luggage':[{
					'luggageID' : 33,
					'weight': 5,
					'status': 'onBoard',
					'location': 'Hong Kong International Airport',
					'timeline':[
						{
							'time': "02Jan19 18:20",
							'details': "Offboard at PEK"
						},{
							'time': "02Jan19 15:40",
							'details': "Onboard at HKG"
						},{
							'time': "02Jan19 13:27",
							'details': "Checked at HKG"
						}
					]
					},{
					'luggageID' : 44,
					'weight': 22,
					'status': 'onBoard',
					'location': 'Hong Kong International Airport',
					'timeline':[
						{
							'time': "02Jan19 18:20",
							'details': "Offboard at PEK"
						},{
							'time': "02Jan19 15:40",
							'details': "Onboard at HKG"
						},{
							'time': "02Jan19 13:27",
							'details': "Checked at HKG"
						}
					]
					}]
				}
			]
	}
]

var sensorSet = [{
	'sensorID' : 1,
	'status': 'Check In'
},{
	'sensorID' : 2,
	'status': 'On Board'
},{
	'sensorID' : 3,
	'status': 'Off Board'
},{
	'sensorID' : 4,
	'status': 'On Belt'
},{
	'sensorID' : 5,
	'status': 'Missing'
}]

var notification = []
var currentUser;
//notification.push({type: 'warning', content: 'The Luggage is checked in!<br>Check the details inside the app!'})
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create our router
var port = process.env.PORT || 8080; 
var router = express.Router();

// http://localhost:8080/api
router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
	// res.json({message:'this is api'});
});


router.get('/notification', function(req,res){
	console.log(notification);
	if (notification.length !=0){
		res.json(notification);
		notification = [];
	} else {
		res.json(false)
	}
})


//login --if login succeed, return the trip info
	//  --if fail, return false
router.get('/login/:user/:password',function(req,res){
	getUser = dataSet.filter(x=>x.user == req.params.user && x.password == req.params.password)
	currentUser = getUser.length != 0 ? getUser[0] : false
	res.json({result: getUser.length != 0 ? getUser[0].userID : false})
})

//get the specific trip info
router.route('/trip/:userID/:tripID')
	.get(function(req,res){
		user = dataSet.filter(x=> x.userID == req.params.userID);
		trips = user[0].trip
		trip = trips.filter(x=>x.tripID== req.params.tripID)

		res.json(trip.length != 0 ? trip[0]: undefined);
	});

//get the specific trip info
router.route('/tripHistory/:userID/:tripID')
.get(function(req,res){
	user = dataSet.filter(x=> x.userID == req.params.userID);
	trips = user[0].tripHistory
	trip = trips.filter(x=>x.tripID== req.params.tripID)

	res.json(trip.length != 0 ? trip[0]: undefined);
});

//get all trips of the user
router.route('/trips/:userID')
.get(function(req,res){
	user = dataSet.filter(x=> x.userID == req.params.userID);
	if (user[0] !== undefined){
		trip =  user[0].trip;
		res.json(trip.length != 0 ? trip: undefined);
	}else{
		res.json(undefined);
	}
});

//get all trips history of the user
router.route('/tripsHistory/:userID')
.get(function(req,res){
	user = dataSet.filter(x=> x.userID == req.params.userID);
	if (user[0] !== undefined){
		trip =  user[0].tripHistory;
		res.json(trip.length != 0 ? trip: undefined);
	}else{
		res.json(undefined);
	}
});



//when the sensor detect the RFID, show the 
	//change status of the luggage based on the sensor location
router.route('/sensor/:sensorID/:luggageID')
	.get(function(req,res){
		//get the sensor status
		sensorStatus = sensorSet.filter(x => x.sensorID == req.params.sensorID);
		sensorStatus = sensorStatus.length !=0 ? sensorStatus[0].status : undefined;
		console.log("sensorID: " + req.params.sensorID)
		switch(req.params.sensorID) {
			case '1':
				notification.push({type: 'success', content: 'The Luggage is checked in!<br>Check the details inside the app!'})
				break;
			case '2':
				notification.push({type: 'success', content: 'The Luggage is on board!<br>Check the details inside the app!'})
				break;
			case '3':
				notification.push({type: 'success', content: 'The Luggage is off board!<br>Please wait a moment before it proseed!!'})
				break;
			case '4': 
				notification.push({type: 'success', content: 'The Luggage is on the belt!<br>Keep track the belt and get your luggage back!!'})
				break;
			default:
				break;
		}

		console.log(notification);
		
		luggageList = dataSet[0].trip.filter(
				y => y.luggage.filter(
					z => z.luggageID ==req.params.luggageID)
				)

		tripID = luggageList.length != 0 ? luggageList[0].tripID : undefined;

		if (tripID !== undefined){
			var i=0, j=0,k=0, indx=[];
			for ( i=0; i<dataSet.length; i++){
				if (dataSet[i]==dataSet[0]){
					for ( j=0; j<dataSet[i].trip.length; j++){
						if (dataSet[i].trip[j].tripID==tripID){
							for ( k=0; k<dataSet[i].trip[j].luggage.length; k++){
								if (dataSet[i].trip[j].luggage[k].luggageID==req.params.luggageID){
									console.log ("Before:" + dataSet[i].trip[j].luggage[k].status);
									dataSet[i].trip[j].luggage[k].status = sensorStatus;
									console.log ("After:" + dataSet[i].trip[j].luggage[k].status);
								}
							}
						}
					}
				}
			}
		}
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Opening the server on port ' + port);
