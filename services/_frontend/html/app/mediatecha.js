// alert('ok');

var mediatechaApp = angular.module( 'mediatechaControllers', [] );
var backend = 'http://localhost:3000';

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

function cinemaMovieMapping( item )
{
    
    item.title = item.title.replace(/(\.RUS|\.ENG|\.SUB|\.DUB|\.XVID|\.AC3|\.HDRIP|\.WEB-DLRIP|\.HDRIP|\.HDTVRIP|\.DTS|\.BLURAY|\.BDRIP|\.1080P|\.AVC|\.DVDScr|\.Eng|\.x264)/gi, ' ');
    
    item.title = item.title.replace(/[\.|_]/g, ' ');
    item.img = item.photo_320;
    item.url = backend + item.uri;
    item.exttype = 'primary';
    item.size = parseInt( item.size / 1024 / 1024) + ' Mb'
    item.english = item.uri.match(/(\.|_|\()Eng/g) != null ? 'Eng': null;
    item.subtitle = item.uri.match(/(\.|_|\()(Srt|Sub)/g) != null ? 'Subtitle': null;
    
    /*switch(item.extension)
    {
        case 'avi': item.exttype = 'primary'; break;
        case 'mkv': item.exttype = 'warning'; break;
        case 'mp4': item.exttype = 'success'; break;
        case 'm4v': item.exttype = 'danger'; break;
        default: item.exttype = 'info'; break;
    }*/
    
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
            
    $http.get( backend + '/movies/').success( function(data){
            
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
            
    $http.get( backend + '/music/').success( function(data){
        
        page.rows = [];
        data.response.forEach(function(item, index){
            
            item.dur = getDuration( item.duration );
            item.url = backend + '/download/music/' + btoa(item.url.split('?')[0]); // to base64
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
    
        $http.get( backend + '/cinema/').success( function(data){
            
            page.rows = [];
            var row = [];
            
            data.response.items.forEach(function(item, index){
               
                row.push( cinemaMovieMapping( item ) );
                
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
