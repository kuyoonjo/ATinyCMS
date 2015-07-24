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
            $location.path($scope.settings.postUri + 'by' + $scope.settings.dateUri + date.format('YYYY-MM-DD'));
        }
    };

    $scope.loadArticles = function (url, to, callback) {
        json.load(url)
            .then(function(data){
                to.author = $scope.settings.author;
                to.email = $scope.settings.email;
                to.site = $scope.settings.site;
                to.root = $scope.settings.postUri;
                to.data = callback($scope, data);
            }, function(data){
                console.log(data);
                to.data = $scope.notFound;
                $scope.title = $scope.notFound.error.title + ' - ' + $scope.settings.title;
            });
        to.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }
    }
});



app.controller('articleCtrl', function($scope, $rootScope, $routeParams) {
    $scope.loadArticles($scope.settings.articleUri + $routeParams.uri, $scope, function(scope, data){
        if(!data.success) {
            return $rootScope.notFound;
        }
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

app.controller('tagCtrl', function($scope, $rootScope, $routeParams) {
    $scope.loadArticles($scope.settings.tagUri + $routeParams.tag, $scope, function(scope, data){
        if(!data.success) {
            return $rootScope.notFound;
        }
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

app.controller('listCtrl', function($scope, $routeParams, $location) {
    var fail = {
        by: 'error',
        error: {
            title: 'Error',
            content: 'No posts found.'
        }
    }
    $scope.loadArticles($scope.settings.listUri + $routeParams.category, $scope, function(scope, data){
        if(data.success){
            if(data.list.length > 0) {
                scope.title = data.category + ' - ' + scope.settings.title;
                data.getThumbnail = function(d) {
                    return d.thumbnail ? d.thumbnail : scope.images.thumbnail;
                };
                data.show = function(url) {
                    $location.path(url);
                }
                return data;
            }
        }
        return fail;
    });
});

app.controller('dateCtrl', function($scope, $rootScope, $routeParams) {
    var regex = /^(\d{4})-(\d{2})-(\d{2})$/g;
    var match = regex.exec($routeParams.date);
    var fail = $rootScope.notFound;
    if(match) {
        $scope.loadArticles($scope.settings.dateUri + match[0], $scope, function(scope, data){
            if(data.success){
                scope.title = match[0] + ' - ' + scope.settings.title;
                scope.date = match[0];
                return data;
            }
            return fail;
        });
    } else {
        $scope.data = fail;
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

app.controller('modalCtrl', function ($scope, $modal) {
    $scope.openModal = function(url, size, animationDisabled) {
        $modal.open({
            animation: !animationDisabled,
            templateUrl: url,
            size: size
        });
    }
});