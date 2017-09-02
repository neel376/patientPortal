
app.controller("MainController", function($scope, $http, $sce, MyFactory) {

    AuthRocket.setInstanceUrl('https://hlw3jklx.e1.loginrocket.com/');
    $(function(){
      console.log("YE");
      $('#login-form').submit(function(event){
        console.log($('#login_username').val());
        AuthRocket.authenticate({
          username: $('#login_username').val(),
          password: $('#login_password').val()
        }, arLoginHandler);
        return false;
      });
      function arLoginHandler(response){
        if (response.error) {
          $("#login-errors").text(response.error);
        } else {
            var token = response.token;
            document.cookie = "token=" + token; //stores token in a cookie
            localStorage.setItem('token', token);
            window.location = window.location.href + "dashboard.html";//response.url;
        }
      };
    });

$scope.showDiv = false;
$scope.showLabOv = false;
$scope.showMed = false;
$scope.showLab = false;
$scope.showResults = false;
$scope.showNothing = false;
$scope.linkIndex = 0;
$scope.loadPage = true;

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

$scope.getData = function() {
  // const token = MyFactory.getData();//********** hard code token below by logging in with geemo(pass: password)
                                     // and copying token from url for TESTING LOCALLY. Then comment out this line


   
   var token = localStorage.getItem('token');


   // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6ImpreV8wdlRidGUwcFl2elBqWk9MYXZtcE03In0.eyJpYXQiOjE1MDI4NDUyMjEsImV4cCI6MTUwMjg2NjgyMSwidWlkIjoidXNyXzB2VEVFd1dYSXZIeHJLTXNnYXVWQlEiLCJ1biI6ImdlZW1vIiwiZm4iOiJHdWlsbGVybW8iLCJsbiI6Ik1vbnRveWEiLCJuIjoiR3VpbGxlcm1vIE1vbnRveWEiLCJ0ayI6Imtzc18wdlVmWkd0M1c4QXZybDllcGRWOXJyIn0.GLIofQQnnMVnBSeOJ_FvaIrqvYzhGWN57SHAat9uGsE';
    $http.post("/getPatientData", { token: token }).success(function (data) {
     //   console.log(token);
     $scope.summarys = data[0]; //data[0] = patient summary
     $scope.refferals = data[1]; //data[1] = refferals
     $scope.immunizations = data[2]; //data[2] = immunizations
     $scope.results = data[3]; //data[3] = lab results
     $scope.testData = data[4]; //data[4] == testdata for now calling lab result and binding to UI Grid
     $scope.loadPage = true;
  }).error(function(error){
      console.log("OH NO **** " + error); result
  });

}
   $scope.trustSrc = function(src) { //trusts and allows pdf links to be used
    return $sce.trustAsResourceUrl(src);
  }

   $scope.labResult = function ($index) {
  var sideBar_height = $('.sidebar').height();
  var navBar_height = $('theNav').height();
  $scope.showLab = !$scope.showLab;
  $scope.showLabOv =  !$scope.showLabOv;
 $('.lab-pdf').height(sideBar_height - navBar_height- 50);
 $scope.linkIndex = $index;
  }  
});
