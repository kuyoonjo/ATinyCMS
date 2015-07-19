/**
 * Created by yuchen on 7/16/15.
 */

app.controller('myCtrl', function($scope, $location, $window, navigators) {
});

app.controller('myArticleCtrl', function($scope, $rootScope, $routeParams, navigators, json) {
    navigators.selectByURI($routeParams.uri);
    $rootScope.inSearch = false;
    json.load($scope.settings.articleUri + $routeParams.uri)
        .then(function(data){
            $scope.data = data;
            if(data.length > 1) {
                $rootScope.title = data[0].category + ' - ' + $rootScope.settings.title;
            } else {
                $rootScope.title = data[0].title + ' - ' + $rootScope.settings.title;
            }
        }, function(data){
            $scope.data = $rootScope.notFound;
            $rootScope.title = $scope.data[0].title + ' - ' + $rootScope.settings.title;
        });
});

app.controller('mySearchCtrl', function($scope, $rootScope, $routeParams, navigators, json){
    navigators.select(null);
    $rootScope.inSearch = true;
    //$rootScope.showFooter = false;
    json.load($scope.settings.searchEngineUri + '?q='+ $routeParams.q)
        .then(function(data){
            $scope.data = data;
            $rootScope.title = 'Search' + ' - ' + $rootScope.settings.title;
        }, function(data){
            $scope.data = $rootScope.notFound;
        });
});