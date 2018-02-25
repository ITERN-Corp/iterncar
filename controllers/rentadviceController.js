

carItern.controller('rentadviceController', [
    '$scope', '$http', '$timeout', '$rootScope', '$location', '$route', '$routeParams', 'jsonRpc', 
    function($scope, $http, $timeout, $rootScope, $location, $route, $routeParams, jsonRpc, data){ 

       console.log("called sfgdxhcvbnm,");
        
       $scope.id = $routeParams.id;

    $scope.load_singleadvice = function(id){
            var config = {headers:  {
                "Content-Type":"json",
                }
            };

          var data = {
                'rentAdviceId': id
            };
          

            $http.post($rootScope.host + '/web/rentingadvice', data).success(function(data, status, headers, config)  {
                var listing = data.result.rent_advice;
                if (!listing){
                    window.location.href = 'page404';
                }else{
                    $scope.listing = listing[0];
                }
            }).error(function(data, status) { 
                console.log('failed');  
            });
            
        }
    $scope.load_singleadvice($scope.id);



}]);
