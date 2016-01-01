// alert('ok');

var mediatechaApp = angular.module( 'mediatechaControllers', [] );


function getApproximateDuration(seconds)
{
    var dur = parseInt( seconds /60 );
    return dur > 0 ? dur + ' мин' : seconds + ' сек';
}

function getDuration(seconds)
{
    var min = parseInt( seconds / 60 );
    return ( min + ' мин : ' + (seconds % 60 ) + ' сек');
}

function vkMovieMapping( item )
{
    item.title = item.title;
    item.dur = getDuration( item.duration );
    item.img = item.photo_320;
    item.url = item.player;
    return item;
}

function stubMovieMapping( item )
{
    //item.title = 'Title';
    item.description = 'Фильмы и видео из соцсетей и локального сервера';
    item.dur = getDuration( 95 * 60 )  ;
    item.img = "../img/stub.jpg"; 
    item.url = '../img/stub.jpg';  
    return item;
}


mediatechaApp.controller('VideoController', function MediaController($scope, $http){
    
    var page = {
                "pageHeading": "Видео",
                "secondaryHeading": "из соцсетей",
                "rows":[]
            }
            
    $http.get('http://localhost:3000/movies/').success( function(data){
            
            page.rows = [];
            var row = [];
            
            data.response.items.forEach(function(item, index){
               
                row.push( stubMovieMapping( item ) );
                
                if(index % 3 == 2)
                {    
                    page.rows.push( row );
                    row = [];
                }
            });
            
            page.rows.push( row );     
            
            $scope.page = page;
        });
        
});

mediatechaApp.controller('MusicController', function MediaController($scope, $http){
    
    var page = {
                "pageHeading": "Музыка",
                "secondaryHeading": "из соцсетей",
                "rows":[]
            }
            
    $http.get('http://localhost:3000/music/').success( function(data){
        
        page.rows = [];
        data.response.items.forEach(function(item, index){
            
            item.dur = getDuration( item.duration );
            page.rows.push( item );
        });
    });
    
    $scope.page = page;
});

mediatechaApp.controller('CinemaController', function MediaController($scope, $http){
    
        var page = {
                "pageHeading": "Фильмы",
                "secondaryHeading": "с  локального сервера",
                "rows":[]
            }
    
        $http.get('http://localhost:3000/cinema/').success( function(data){
            
            page.rows = [];
            var row = [];
            
            data.response.items.forEach(function(item, index){
               
                row.push( stubMovieMapping( item ) );
                
                if(index % 3 == 2)
                {    
                    page.rows.push( row );
                    row = [];
                }
            });
            
            page.rows.push( row );     
            
            $scope.page = page;
        });
        
});
