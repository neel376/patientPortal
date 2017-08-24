 var app = angular.module("myapp", []).factory('MyFactory', function () {
  window._data = 'default';
  return {
    setData: function (val) {
      console.log('setData() called with val == ', val);
      localStorage.setItem('token', val);
    },
    getData: function () {


        // test committ  app.js in VSTS
        return localStorage.getItem('token');


    },
  }
});
