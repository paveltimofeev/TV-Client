
var mediatechaApp = angular.module( 'mediatechaApp', [ 'ngRoute', 'mediatechaControllers' ] );

mediatechaApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider
        .when('/cinema/', { templateUrl:'views/movies.html', controller:'CinemaController' } )
        .when('/music/',   { templateUrl:'views/music.html', controller:'MusicController' })
        .when('/social/:userId', { templateUrl:'views/movies.html', controller:'VideoController' })
        .when('', { redirectTo:'/cinema/'})
        .otherwise({ redirectTo:'/cinema/'});
}]);
