var employeeControllers = angular.module('employeeController',[]);

var employee_serviceURL = ''; //Leaving blank till I look at the cloud 9 project.

employeeControllers.controller('', ['$scope', '$http', function($scope, $http){
    $http.get(employee_serviceURL)
        .then(function (response) {
            $scope.todo = response.data;
        });
}]);

employeeControllers.controller('', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http)  {
        $scope.isbn = $routeParams.isbn;

        $http.get(employee_serviceURL + $routeParams.employeeID)
            .then(function (response) {
                $scope.messages = response.data[0];
            });
    }]);

employeeControllers.controller('', ['$scope', '$http',
    function($scope, $http){
        $scope.sortField = 'isbn10';
        $scope.sortReverse = false;

        $http.get(employee_serviceURL)
            .then(function (response) {
                $scope.messages = response.data;
            });
    }]);
