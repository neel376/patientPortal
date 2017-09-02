app.controller("LoginController", function($scope, $http, $sce, MyFactory) {

    
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
          window.location = window.location.href + "dashboard.html";//response.url;
            ///views/dashboard.html
        }
      };
    });
});