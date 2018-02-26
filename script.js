var carItern = angular.module('carItern', ['ngRoute', 'odoo','ui.bootstrap','angularUtils.directives.dirPagination']);

carItern.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
// // configure our routes
carItern.config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the login page
        .when('/', {
            templateUrl : 'template_index.html'
        })
        .when('/home', {
            templateUrl : 'template_index.html'
        })
        .when('/login', {
            templateUrl : 'template_login_signup.html',
            controller: 'loginController'
        })
        .when('/signup', {
            templateUrl : 'template_login_signup.html',
            controller: 'signupController'
        })
        .when('/mylisting', {
            templateUrl : 'template_mylisting.html',
            //controller: 'mylistingController'
        })

         .when('/cardealer', {
            templateUrl : 'template_car_dealer.html',
            //controller: 'cardealerController'
        })
        .when('/dealercatalog', {
            templateUrl : 'template_dealers_catalog.html',
           //controller: 'cardealerController'
        })

        .when('/carsaleitem/:id', {
            templateUrl : 'template_car_sale_item.html',
            controller: 'singleListingController'
        })

        .when('/rentcarcatalog', {
            templateUrl : 'template_rent_car_catalog.html',
            //controller: 'cardealerController'
        })

        .when('/carlist', {
            templateUrl : 'template_car_lists.html',
            //controller: 'cardealerController'
        })
       .when('/reports', {
            templateUrl : 'template_reports.html',
            //controller: 'cardealerController'
        })

        .when('/favorites', {
            templateUrl : 'template_favorites.html',
            //controller: 'cardealerController'
        })
       .when('/notification', {
            templateUrl : 'template_notifications.html',
            //controller: 'favoritesController'
        })

       .when('/settings', {
            templateUrl : 'template_setting.html',
            //controller: 'settingsController'
        })

       .when('/submitcar', {
            templateUrl : 'template_car_submit.html',
            controller: 'submitcarController'
        })
       .when('/rentadvice/:id',{
            templateUrl:'template_advice.html',
            controller: 'rentadviceController'

       })

       .when('/page404', {
            templateUrl : 'template_404.html',
            controller: 'singleListingController'

        });
        
       
    $locationProvider.html5Mode(true);
});






carItern.controller('mainController', [
    '$scope', '$http', '$timeout','$filter', '$rootScope', '$location', '$route', '$routeParams','jsonRpc', 
    function($scope, $http, $timeout, $filter, $rootScope, $location, $route, $routeParams, jsonRpc, data){  
   
    $scope.data = {};


    $rootScope.host = "http://odootrip.br";
    $rootScope.database = 'odoo10';
    jsonRpc.odoo_server = $rootScope.host;

    //pagination

    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;
    $scope.maxSize = 20;
    $scope.totalItems = 250;
    
    for(var i = 0; i < 250; i++){
        $scope.data[i] = { name: 'cars ' + i }
    }

      // end pagination


      $scope.today = function() {
        $scope.data.drop_of_date = new Date();
      };
      $scope.today();

      $scope.clear = function() {
        $scope.data.drop_of_date = null;
      };

      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      // Disable weekend selection
      // function disabled(data) {
      //   var date = data.date,
      //     mode = data.mode;
      //   return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      // }

      $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
      };

      $scope.toggleMin();

      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };

      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }


        return '';
      }

    
    var current_user = JSON.parse(window.localStorage.getItem("currentUser"));
    if (current_user){
        $rootScope.currentUser = current_user;
    }


    if (window.location.pathname.indexOf("dashboard") !== -1){
        $scope.is_dashboard = true;
    }

    if ($scope.is_dashboard){
       jsonRpc.getSessionInfo().then(function (result) {
            if (result.uid){
                $scope.set_current_user(result.uid);
                $scope.database = result.db;
                console.log("response", result);
            }else{
                console.log("not user");
                window.location.href='/';
            } 
        })
    }

     //select car
    $scope.select_reserve_car = function(car) {
        $scope.data.selectedCar = car;
    }




    // generic failure function
    $rootScope.odoo_failure_function = function(response) {
        $scope.odoo_error = {
            'title': response.fullTrace.message,
            'type': response.fullTrace.data.exception_type,
            'message': response.fullTrace.data.message
        }
        console.log('$scope.odoo_error', $scope.odoo_error);
        // $scope.errorModal();
    }

    $scope.set_current_user = function(id){
        $rootScope.user = false;
        $scope.model = 'res.users';
        $scope.domain = [['id', '=', id]];
        $scope.fields = ['display_name', 'partner_id'];
        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
        .then(function(response) {
            $rootScope.user = response.records[0];
            $rootScope.bodyclass = 'no-skin';
            $rootScope.loggedin = true;
           
            console.log("$rootScope.user", $rootScope.user);
        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        });
    }

    $rootScope.cars = [];
    $rootScope.carmakes = [];
    $rootScope.carmodels = [];
    $rootScope.categories = [];
    $rootScope.agents = [];
    $rootScope.featured_cars = [];
    $rootScope.cylinders = [];
    $rootScope.years=[];

    $rootScope.condition=[];
    $rootScope.fuel_types=[];
    $rootScope.eng_capacity=[];
    $rootScope.eng_gear=[];
    $rootScope.eng_drive=[];
    $rootScope.eng_transmission=[];
    $rootScope.eng_positions=[];



    $scope.load_cars = function(){
        if (!$rootScope.cars.length){
            console.log("cars called");
            var config = {headers:  {
                "Content-Type":"json",
                }
            };
            var data = {};

            $http.post($rootScope.host + '/web/carlistings', data).success(function(data, status, headers, config) {
                $rootScope.cars = data.result.cars;
                $rootScope.carmakes = data.result.carmakes;
                $rootScope.carmodels = data.result.carmodels;
                $rootScope.cylinders = data.result.cylinders;
                $rootScope.years = data.result.years;
                

                $rootScope.condition = data.result.condition;
                $rootScope.fuel_types = data.result.fuel_types;
                $rootScope.eng_capacity = data.result.eng_capacity;
                
                $rootScope.eng_gear = data.result.eng_gear;
                $rootScope.eng_drive = data.result.eng_type;
                $rootScope.eng_positions = data.result.eng_positions;

                $rootScope.eng_transmission = data.result.eng_transmission;

                $rootScope.featured_cars = data.result.featured_cars;
                console.log('$rootScope.cars', $rootScope.carmakes);
            }).error(function(data, status) { 
                console.log('failed');  
            });
        }
    }

    $scope.load_cars();

   //MYLISTING FUNTIONS
   $scope.editThisCar = function(car) {
       window.localStorage.setItem("editCar", angular.toJson(car));
       window.location.href = 'submitcar';
    
   }

   $scope.addNewCar = function() {
       window.localStorage.removeItem("editCar");
       window.location.href = 'submitcar';
    
   }

    $scope.logout = function(){
        jsonRpc.logout();
        window.localStorage.removeItem("currentUser");
        window.location.href = '/';
    }


       //wacth date change and update total price
    $scope.$watchGroup(['data.drop_of_date', 'data.pick_up_date'], function(newValues) {
        var datediff = (($scope.data.drop_of_date - $scope.data.pick_up_date)  / 1000 / 60 / 60 / 24);
        $scope.data.no_of_days = Math.round(datediff);
        if ($scope.data.selectedCar){
            $scope.data.total =  $scope.data.no_of_days * $scope.data.selectedCar.hire_price;
        }
    });

// Reserve Car
    $scope.reserveCar = function(){
        
        $scope.data.error = null;
        if (!$scope.data.name){
            $scope.data.error = 'A requred field is empty';
        }else{
            var config = {headers:  {
                "Content-Type":"json",
                }
            };

            var data = {
                'car_id': $scope.data.selectedCar.id,
                'name': $scope.data.name,
                'phone': $scope.data.phone,
                'license_or_id':$scope.data.license_or_id,
                'email':$scope.data.email,
                'pick_up_date':$scope.data.pick_up_date,
                'location':$scope.data.location.location,
                'drop_of_date': $scope.data.drop_of_date,
                'rent_notes':$scope.data.rent_notes,
                'total': $scope.data.total,
            };
        

            $http.post($rootScope.host + '/web/reservation', data).success(function(data, status, headers, config) {
                // $scope.successful_post(data.result.msg, data.result.action);
                if (data.result.type == 'new_reservation'){
                    $scope.data.reservation_response = data.result.msg;
                }else{
                    $scope.data.error = data.result.msg;
                }
        
                console.log('response from reservation', data.result)

            }).error(function(data, status) { 
                console.log('failed');  
        });
        }
    }


   $rootScope.rent_advice=[];

    $scope.load_rent_advice = function(){

         if (!$rootScope.rent_advice.length){
            console.log("Advice called");
            var config = {headers:  {
                "Content-Type":"json",
                }
            };
            var data = {};

            $http.post($rootScope.host + '/web/rentingadvice', data).success(function(data, status, headers, config) {
                $rootScope.rent_advice = data.result.rent_advice;

                console.log('$rootScope.rent_advice', $rootScope.rent_advice);
            }).error(function(data, status) { 
                console.log('failed');  
            });
        }



    }
    $scope.load_rent_advice();


  $rootScope.partners=[];

    $scope.load_dealers = function(){

         if (!$rootScope.partners.length){
            console.log("partners called");
            var config = {headers:  {
                "Content-Type":"json",
                }
            };
            var data = {};

            $http.post($rootScope.host + '/web/partners', data).success(function(data, status, headers, config) {
                $rootScope.partners = data.result.partners;

               console.log('$rootScope.partners', $rootScope.partners);
            }).error(function(data, status) { 
                console.log('failed');  
            });
        }




    }
    $scope.load_dealers();



  
}]);