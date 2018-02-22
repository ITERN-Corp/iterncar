var carApp = angular.module('carApp', ['ngRoute', 'odoo']);

carApp.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
// // configure our routes
// carApp.config(function($routeProvider) {
// 	$routeProvider
//
// 		// route for the login page
// 		.when('/', {
// 			templateUrl : 'pages/state.html',
// 			controller  : 'mainController'
// 		})
//
// 		// route for the home page
// 		.when('/home', {
// 			templateUrl : 'pages/home.html',
// 			controller  : 'homeController'
// 		});
// });

carApp.controller('mainController', [
	'$scope', '$http', '$timeout', '$rootScope', '$location', 'jsonRpc', 
	function($scope, $http, $timeout, $rootScope, $location, jsonRpc, data){  
		
	$rootScope.bodyclass = 'login-layout light-login';
		// $rootScope.bodyclass = 'no-skin';

    $rootScope.host = "http://system.car.itern.te";
    $scope.database = 'testcar';

    $scope.login = function(username, password) {

    	var username = 'admin';
    	var password = 'admin';

    	console.log(username, password);

        jsonRpc.odoo_server = $rootScope.host;

        jsonRpc.login($scope.database, username, password)
        .then(function(response) {
            console.log('res', response);
	        $scope.model = 'res.users';
	        $scope.domain = [];
	        $scope.fields = ['display_name'];
	        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
	        .then(function(response) {
	            $rootScope.user = response.records[0];
	            $rootScope.bodyclass = 'no-skin';
	            $rootScope.loggedin = true;
	            // $scope.load_parts();
                console.log("$rootScope.user", $rootScope.user);
	        },function(response){
	            console.log(response.title);
	        });        

            $location.url('/home');  
            
        },function(response){
            if (response.title == 'wrong_login'){
                console.log('login details incorect');
            }else{
                 console.log('Connection Error');
            }
        });

    }

    $scope.load_parts = function () {

        $scope.work_orders = [];
        $scope.thickness = [];
        $scope.materials = [];
        $scope.customers = [];
        $scope.workcenters = [];

        // search work orders
        $scope.model = 'mrp.production.workcenter.line';
        $scope.domain = [['state', 'not in', ['done', 'cancel']]];
        $scope.fields = [
            'name',
            'production_state',
            'production_id',
            'part_id',
            'saleorder_id',
            'part_image_medium',
            'part_commitment_date',
            'part_thickness',
        ];
        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
            .then(function (response) {
                console.log('work orders');
                $scope.work_orders = response.records;

                // Update
            }, function (response) {
                console.log(response.title);
            });


    }

    $scope.show_part_details = function (part) {
		$scope.selected_part = part;
	}
  
}]);
