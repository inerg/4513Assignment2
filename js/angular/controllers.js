/*global angular*/
var employeeControllers = angular.module('employeeControllers',['ngCookies']);

// Simplify our code here by hard-coding the url of service.
// In real code, we would likely encapsulate it within angular factory or service
var emp_serviceURL = 'inerg.xyz/api/employees/';

//Cookies Service
employeeControllers.factory("cookieService", [
	"$cookies", function($cookies) {
		var theuser;

		return {
			setCookieData: function(username, password) {
				theuser = username;
				$cookies.put("usrnm", theuser);
			},
			getCookieData: function() {
				return $cookies;
			},
			clearCookieData: function() {
				theuser = "";
				$cookies.remove("usrnm");
			}
		}
	}
]);

//LoginCtrl
employeeControllers.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$cookies', 'cookieService', '$location', 
    function ($scope, $rootScope, $http, $cookies, cookieService, $location) {
      $scope.credentials = {
        username: '',
        password: ''
      };
      //shody check to see if user is logged in to redirect until i can come up with
      //how to do it on the routing so it doesnt load the dang thing
      $cookies = cookieService.getCookieData();
      if ($cookies.get('usrnm') != undefined)
      {
          window.location = "#/dashboard.html";
      }
      //end shoddy routing
      //here is the login script that happens when you click the button
      $scope.login = function (credentials) {
          //restart fields
          restartClasses();
          //login logic
          //calls mongod query
          $http.get(emp_serviceURL + $scope.credentials.username).then(function (response){
                if (response.data != 0){
                    //found the user
                    var user = response.data[0];
                    //password auth
                    if (user.employee.password == credentials.password){
                        //yes!!
                        setCredentials(credentials.username, credentials.password);
                        $location.path("#/dashboard");
                        window.location.reload();
                    }else{
                        //no!! wrong password, right user
                        wrongPassword();
                    }
                }else {
                    //wrong user
                    wrongUser();
                }
          
          });
      }
      
      //for logging in
      function setCredentials(usr, pss){
          $http.defaults.headers.common['Authorization'] = 'User'; 
          cookieService.setCookieData(usr);
      }
}]);

// UserCtrl (Dashboard)
employeeControllers.controller('UserCtrl', ['$scope', '$http', '$cookies', 'cookieService', '$location', 
    function($scope,$http, $cookies, cookieService, $location) {
        // retrieve employee data from our service
        $cookies = cookieService.getCookieData();
        var emp_dat = $cookies.get('usrnm');
        //check if user is logged out and in the dashboard
        //to kick them out
        if (emp_dat == undefined)
          {
              window.location = "#/login.html";
          }
          //remove the above later
          //end routing
        //Setting sort reverse
        $scope.sortReverse = false;
        $scope.sortField = 'title';
        //orderByDate since it doesn't recognize the format
        $scope.orderByDate = function(item) {
            // console.log(item);
            var splitDate = item.date.split("/");
            var date = new Date(splitDate[2],splitDate[0],splitDate[1]);
            // var date = 1;
            return date;
        };
        
        $http.get(emp_serviceURL + emp_dat)
            .then(function (response) {
                $scope.user = response.data[0];
            
            });
        //logout function
        $scope.logout = function () {
          $http.defaults.headers.common.Authorization = 'None';
          cookieService.clearCookieData();
          $location.path("#/login");
          window.location.reload();
        }
        //delete to-do function
        $scope.deltodo = function (todoid) {
            //add delete thing here
            //need to send emp_data + the todoid and call delete
            $http.get(emp_serviceURL + emp_dat + "/tododel/" + todoid)
            .then(function () {
                
            });
            window.location.reload();
        }
        //new to-do function
        $scope.addtodo = function (description, status, priority) {
            //need to send emp_data + the desired data for the to-do entry
            var id = Math.floor((Math.random() * 1000) + 10);
            $http.get(emp_serviceURL + emp_dat + '/todoadd/' + id + '/' + status + '/' + priority + '/' + description)
            .then(function () {
                
            });
            window.location.reload();
        }
        //edit to-do function
        $scope.edittodo = function (description, status, priority, id) {
            //need to send emp_data + the desired data for the to-do entry
            //$http.get(emp_serviceURL + emp_dat + '/todoedit/' + id + '/' + status + '/' + priority + '/' + description)
            $http.get(emp_serviceURL + emp_dat + '/todoedit/' + id + '/' + status + '/' + priority + '/' + description)
            .then(function () {
                
            }); //    /api/employees/:usn/todoedit/:id/:stts/:prio/:desc
            //window.location.reload();
            window.location.replace("#/dashboard.html");
        }
    }
    
]); 

//functions for login errors!
function wrongUser() {
    var labelUser = document.getElementById("username");
    labelUser.className += " is-invalid-label";
    
    var inputUser = labelUser.getElementsByTagName("input")[0];
    inputUser.className += " is-invalid-input";
    
    var spanUser = labelUser.getElementsByTagName("span")[0];
    spanUser.className += " is-visible";
}

function wrongPassword() {
    var labelPassword = document.getElementById("password");
    labelPassword.className += " is-invalid-label";
    
    var inputPassword = labelPassword.getElementsByTagName("input")[0];
    inputPassword.className += " is-invalid-input";
    
    var spanPassword = labelPassword.getElementsByTagName("span")[0];
    spanPassword.className += " is-visible";
}

function restartClasses() {
    var labelUser = document.getElementById("username");
    labelUser.className = "";
    
    var inputUser = labelUser.getElementsByTagName("input")[0];
    inputUser.className = "";
    
    var spanUser = labelUser.getElementsByTagName("span")[0];
    spanUser.className = "";
    spanUser.className = "form-error";
    
    //Password labels
    var labelPassword = document.getElementById("password");
    labelPassword.className = "";
    
    var inputPassword = labelPassword.getElementsByTagName("input")[0];
    inputPassword.className = "";
    
    var spanPassword = labelPassword.getElementsByTagName("span")[0];
    spanPassword.className = "";
    spanPassword.className = "form-error";
}

