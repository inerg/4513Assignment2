/*global angular*/
(function () {
  var assign2app = angular.module('assign2app', ['ngRoute','employeeControllers']);
  assign2app.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider
        .when("/login.html", { 
            templateUrl: "partials/login.html",
            controller: "LoginCtrl"
        })
        .when("/dashboard.html", { 
            templateUrl: "partials/dashboard.html",
            controller: "UserCtrl"
        })
        .when("/about.html", { 
            templateUrl: "partials/about.html",
            controller: "UserCtrl"
        })
        .when("/todo.html", { 
            templateUrl: "partials/todo.html",
            controller: "UserCtrl"
        })
        .otherwise({
           redirectTo: '/login.html'
        });
    }])
}());

