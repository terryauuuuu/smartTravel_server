var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var cors = require('cors');

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
		'from': 'Berlin',
		'fromShost': 'BER',
		'to': 'Hong Kong',
		'toShort': 'HKG',
		'toPicture' : 'src/src/hongkong.jpg',
		'fromDate': '02Jan19 15:45',
		'toDate': '02Jan19 18:20',
		'PaggaeAllow': '32kg',
		'luggage':[{
			'luggageID' : 1,
			'weight': 10,
			'status': 'onBoard',
			'location': 'Berlin International Airport'
			},{
			'luggageID' : 2,
			'weight': 23,
			'status': 'onBoard',
			'location': 'Berlin International Airport'
			}]
		},{
			'tripID': 1,
			'tripNumber' : 'CX5710',
			'Class' :'Business',
			'from': 'Hong Kong',
			'fromShost': 'HKG',
			'to': 'Beijing',
			'toShort': 'PEK',
			'toPicture' : 'src/src/beijing.jpg',
			'fromDate': '02Jan19 15:45',
			'toDate': '02Jan19 18:20',
			'PaggaeAllow': '32kg',
			'luggage':[{
				'luggageID' : 3,
				'weight': 5,
				'status': 'onBoard',
				'location': 'Hong Kong International Airport'
				},{
				'luggageID' : 4,
				'weight': 22,
				'status': 'onBoard',
				'location': 'Hong Kong International Airport'
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
}]

var currentUser;

app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create our router
var port = process.env.PORT || 8080; 
var router = express.Router();

// http://localhost:8080/api
router.get('/', function(req, res) {
	res.json({message:'this is api'});
});

//login --if login succeed, return the trip info
	//  --if fail, return false
router.get('/login/:user/:password',function(req,res){
	getUser = dataSet.filter(x=>x.user == req.params.user && x.password == req.params.password)
	currentUser = getUser.length != 0 ? getUser[0] : false
	res.json({result: getUser.length != 0 ? getUser[0].trip : false})
})

//get the specific trip info
router.route('/trip/:tripID')
	.get(function(req,res){
		trip = currentUser.filter(x=> x.trip.tripID == req.params.tripID );
		res.json(trip.length != 0 ? trip[0]: '');
	});

//when the sensor detect the RFID, show the 
	//change status of the luggage based on the sensor location
router.route('/sensor/:sensorID/:luggageID')
	.get(function(req,res){
		//get the sensor status
		sensorStatus = sensorSet.filter(x => x.sensorID == req.params.sensorID);
		sensorStatus = sensorStatus.length !=0 ? sensorStatus[0].status : undefined;
		
		luggageList = currentUser.trip.filter(
				y => y.luggage.filter(
					z => z.luggageID ==req.params.luggageID)
				)

		tripID = luggageList.length != 0 ? luggageList[0].tripID : undefined;

		if (tripID !== undefined){
			var i=0, j=0,k=0, indx=[];
			for ( i=0; i<dataSet.length; i++){
				if (dataSet[i]==currentUser){
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
