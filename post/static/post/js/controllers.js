/**
 * Created by yuchen on 7/16/15.
 */

app.controller('myCtrl', function($scope, $location, $window, $sce, json) {
    $scope.$on('$routeChangeStart', function() {
        window.scrollTo(0, 0);
        $scope.showFooter = false;
    });
    $scope.$on('$routeChangeSuccess', function () {
        $scope.showFooter = true;
    });

    $scope.calendar =  {
        goto: function(date) {
            $location.path($scope.settings.postUri + $scope.settings.dateUri + date.format('YYYY-MM-DD'));
        }
    }

    $scope.loadArticles = function (url, to, callback) {
        json.load(url)
            .then(function(data){
                to.author = $scope.settings.author;
                to.email = $scope.settings.email;
                to.site = $scope.settings.site;
                to.root = $scope.settings.postUri;
                to.data = callback($scope, data);
            }, function(data){
                to.data = $scope.notFound;
                $scope.title = to.data[0].title + ' - ' + $scope.settings.title;
            });
        to.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }
    }
});



app.controller('articleCtrl', function($scope, $routeParams) {
    $scope.loadArticles($scope.settings.articleUri + $routeParams.uri, $scope, function(scope, data){
        if(data.list.length > 1) {
            scope.title = data.list[0].category + ' - ' + scope.settings.title;
        } else if(data.list.length == 1) {
            scope.title = data.list[0].title + ' - ' + scope.settings.title;
        } else {
            return {
                by: 'empty',
                list: [{
                    title: 'No Posts Found',
                    content: ''
                }]
            };
        }
        return data;
    });
});

app.controller('tagCtrl', function($scope, $routeParams) {
    $scope.loadArticles($scope.settings.tagUri + $routeParams.tag, $scope, function(scope, data){
        if(data.list.length > 0) {
            scope.title = $routeParams.tag + ' - ' + scope.settings.title;
            scope.tag = $routeParams.tag;
        } else {
            return {
                by: 'empty',
                list: [{
                    title: 'No Posts with tag ' + $routeParams.tag,
                    content: ''
                }]
            };
        }
        return data;
    });
});

app.controller('dateCtrl', function($scope, $rootScope, $routeParams) {
    var regex = /^(\d{4})-(\d{2})-(\d{2})$/g;
    var match = regex.exec($routeParams.date);
    if(match) {
        $scope.loadArticles($scope.settings.dateUri + match[0], $scope, function(scope, data){
            scope.title = match[0] + ' - ' + scope.settings.title;
            scope.date = match[0];
            return data;
        });
    } else {
        $scope.data = $rootScope.notFound;
    }
});


app.controller('searchCtrl', function($scope, $rootScope, $routeParams, json){
    json.load($scope.settings.searchEngineUri + '?q='+ $routeParams.q)
        .then(function(data){
            $scope.data = data;
            $rootScope.title = 'Search' + ' - ' + $rootScope.settings.title;
        }, function(data){
            $scope.data = $rootScope.notFound;
        });
});
