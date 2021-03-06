var myApp = angular.module('myApp', ['ui.router', 'naif.base64']);

myApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      abstract: true,
      templateUrl: 'views/home.html',
      controller: 'homeController'
    }).state('home.search', {
      url: '',
      templateUrl: 'views/search.html',
      controller: 'searchController'
    }).state('home.result', {
      url: 'result',
      params: {id: null},
      templateUrl: 'views/result.html',
      controller: 'resultController'      
    });


}]);