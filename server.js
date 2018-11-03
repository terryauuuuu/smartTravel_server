var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

var dataSet = [
	{
		'userID' : 0,
		'user' : 'user',
		'password': 'password',
		'trip': {
			'tripID': 0,
			'from': 'BER',
			'to': 'HK',
			'fromDate': '2018-10-3 19:45',
			'toDate': '2018-10-4 10:45',
			'luggage':[
				{
					'luggageID' : 1,
					'weight': 123,
					'status': 'onBoard'
				},
				{
					'luggageID' : 2,
					'weight': 234,
					'status': 'onBoard'
				}
			]
		}
	}
]

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

//login --return true if the login succeed
router.get('/login/:user/:password',function(req,res){
	getUser = dataSet.filter(x=>x.user == req.params.user && x.password == req.params.password)
	res.json({result: getUser.length != 0 ? true: false})
})

//get the luggage id and return the weight and status
router.route('/luggage/:luggageID')
	.get(function(req,res){
		luggage = luggageList.filter(x=> x.luggageID ==req.params.luggageID );
		res.json({weight: luggage[0].weight,
				status: luggage[0].status
				});
	});

//the sensor retrieve the RFID 
	//change status of the luggage based on the sensor location
router.route('/luggage/:luggageID')
	.get(function(req,res){
		lug = luggageList.filter(x=> x.luggageID ==req.params.luggageID );
		res.json({weight: lug[0].weight,
				status: lug[0].status
				});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Opening the server on port ' + port);
