/**
 * Created by yuchen on 7/17/15.
 */

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function HighlightCode() {
    var elements = document.querySelectorAll('pre > code');
    for(i=0; i<elements.length; i++) {
        hljs.highlightBlock(elements[i]);
    }
}

function articleCtrl(uri) {
    return function($scope, $rootScope, $routeParams, $sce, navigators, json) {
        json.load(uri + $routeParams.uri)
            .then(function(data){
                $scope.data = data;
                $scope.author = $rootScope.settings.author;
                $scope.email = $rootScope.settings.email;
                $scope.site = $rootScope.settings.site;
                $scope.root = $rootScope.settings.postUri;
                if(data.length > 1) {
                    $rootScope.title = data[0].category + ' - ' + $rootScope.settings.title;
                } else {
                    $rootScope.title = data[0].title + ' - ' + $rootScope.settings.title;
                }
            }, function(data){
                $scope.data = $rootScope.notFound;
                $rootScope.title = $scope.data[0].title + ' - ' + $rootScope.settings.title;
            });
        $scope.trustAsHtml = function(html) {
            return $sce.trustAsHtml(html);
        }
    }
}