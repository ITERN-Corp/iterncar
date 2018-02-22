carItern.controller('submitcarController', [
    '$scope', '$http', '$timeout', '$rootScope', '$location', 'jsonRpc', 
    function($scope, $http, $timeout, $rootScope, $location, jsonRpc, data){ 

    jsonRpc.odoo_server = $rootScope.host;

    $scope.editCar = JSON.parse(window.localStorage.getItem("editCar"));

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

    $scope.submitcar = function( make_id, model_id, plate_number,year,fuel_type,car_condition,eng_volume,eng_position,
        eng_cylinder,eng_type,eng_power,eng_transmission,fuel_consu_combine,fuel_consu_urban,fuel_consu_highway,
        fuel_tank,length,width,height,wheelbase,weight){
        console.log("make_id", model_id);


       

        var method = 'create';
        var editCarId = null;

        if ($scope.editCar){
            if($scope.editCar.id){
                var method = 'write_car';
                var editCarId = $scope.editCar.id;
            }
            var make_id = make_id.id
            var model_id = model_id.id
        }
        //debugger;
        var model = 'itern.car';
        var args = [{
            'editId': editCarId,
            'make_id': make_id,
            'model_id': model_id,
            'plate_number':plate_number,
            'year':year.name,
            'fuel_type':fuel_type.value,

            'eng_volume': eng_volume,
            'eng_position': eng_position.value,

            'eng_cylinder':eng_cylinder.value,
            'eng_type':eng_type.value,

            'eng_power':eng_power,
            'eng_transmission':eng_transmission.value,

            'fuel_consu_combine':fuel_consu_combine,
            'fuel_consu_urban':fuel_consu_urban,
            'fuel_consu_highway':fuel_consu_highway,

            'fuel_tank': fuel_tank,
            'length':length,
            'width':width,
            'height':height,
            'wheelbase':wheelbase,
            'weight': weight,
            'location':location,
            'condition':car_condition.value,
            //'description':description,


        }];
        var kwargs = {};
        //debugger;
        jsonRpc.call(
            model,
            method,
            args,
            kwargs
        ).then(function(response) {
            // add car to list
            console.log("success response", response);
            // $scope.editCar = JSON.parse(window.localStorage.getItem("editCar"));
            if ($scope.editCar){
                window.localStorage.setItem("editCar", angular.toJson(response.editedCar));
            }
            window.location.href = 'mylisting';
            

        }, $rootScope.odoo_failure_function);

     }


}])
