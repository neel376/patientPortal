app.controller("LoginController", function($scope, $http, $sce, MyFactory) {

    
    AuthRocket.setInstanceUrl('https://rq4dyuj1.e1.loginrocket.com/');
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
          window.location = response.url;
        }
      };
    });
    var i = Test;

    // test pportal 

});