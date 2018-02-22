carItern.controller('loginController', [
    '$scope', '$http', '$timeout', '$rootScope', '$location', 'jsonRpc', 
    function($scope, $http, $timeout, $rootScope, $location, jsonRpc, data){

    // $rootScope.host = "http://odootrip.br";
    // $scope.database = 'odoo10';
    $rootScope.host = "http://odootrip.br";
    $scope.database = 'odoo10';
    jsonRpc.odoo_server = $rootScope.host; 

    //login page
    $scope.login = function(username, password) {

        jsonRpc.odoo_server = $rootScope.host;

        jsonRpc.login($scope.database, username, password)
        .then(function(response) {
            console.log('res', response);
            $scope.model = 'res.users';
            $scope.domain = [['id', '=', response.uid]];
            $scope.fields = ['display_name', 'partner_id'];
            jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
            .then(function(response) {
                $rootScope.user = response.records[0];
                $rootScope.loggedin = true;
                // $scope.load_parts();
                var current_user = {
                    "id": $rootScope.user.id ,
                    "name": $rootScope.user.display_name,
                    "partner_id": $rootScope.user.partner_id[0],
                }
                console.log(current_user, "current_user");
                window.localStorage.setItem("currentUser", angular.toJson(current_user));

                window.location.href='mylisting';

            },function(response){
                console.log(response.title);
            });        
            
            
        },function(response){
            if (response.title == 'wrong_login'){
                console.log('login details incorect');
            }else{
                 console.log('Connection Error');
            }
        });
    }

}])