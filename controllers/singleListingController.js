carItern.controller('singleListingController', [
    '$scope', '$http', '$timeout', '$rootScope', '$location', '$route', '$routeParams', 'jsonRpc', 
    function($scope, $http, $timeout, $rootScope, $location, $route, $routeParams, jsonRpc, data){ 

        console.log("called");
        
        $scope.id = $routeParams.id;
        $scope.load_singleListing = function(id){
            var config = {headers:  {
                "Content-Type":"json",
                }
            };
            var data = {
                'singleListingId': id
            };

            $http.post($rootScope.host + '/web/singlelisting', data).success(function(data, status, headers, config) {
                var listing = data.result.singlelisting;
                // if listing doesn not exist redirect to 404.
                if (!listing){
                    window.location.href = 'page404';
                }else{
                    $scope.listing = listing[0];
                }
            }).error(function(data, status) { 
                console.log('failed');  
            });
            
        }
        $scope.load_singleListing($scope.id);

}]);

