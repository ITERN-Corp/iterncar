
carItern.controller('signupController', [
    '$scope', '$http', '$timeout', '$rootScope', '$location', 'jsonRpc', 
    function($scope, $http, $timeout, $rootScope, $location, jsonRpc, data){ 

    // SIGNUP
    $scope.signup = function(name, email, password, re_password){
        $scope.error = null;
        if (password != re_password){
            $scope.error = 'Password do not match';
        }else if (!name || !email || !password){
            $scope.error = 'A requred field is empty';
        }else{
            var config = {headers:  {
                "Content-Type":"json",
                }
            };
            var data = {
              'name': name,
              'email': email,
              'password': password,
            };

            $http.post($rootScope.host + '/web/register', data).success(function(data, status, headers, config) {
                // $scope.successful_post(data.result.msg, data.result.action);
                if (data.result.type == 'new_user'){
                    $scope.signup_response = data.result.msg;
                }else{
                    $scope.error = data.result.msg;
                }
        
                console.log('response from signup', data.result)

                // $scope.showToast('Some required fields are empty');
            }).error(function(data, status) { 
                console.log('failed');  
            });
        }
    }
}])