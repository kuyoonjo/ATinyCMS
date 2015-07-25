/**
 * Created by yuchen on 7/16/15.
 */

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('ycNavbar', function($window, $location, navigators){
    // navigators="" template-url="" post-uri="" search-uri="" images="" articleCtrl="" searchCtrl=""
    return {
        restrict: 'A',
        scope: {
            navigators: '=',
            images: '=',
            postUri: '@',
            searchUri: '@',
            listUri: '@',
            articleCtrl: '@',
            searchCtrl: '@',
            listCtrl: '@'
        },
        templateUrl: function(element, attrs) {
            return attrs.templateUrl;
        },
        link: function(scope, element, attrs) {
            navigators.set(scope.navigators);
            scope.navbarCollapsed = true;
            scope.isSelected = function(navigator) {
                return navigators.isSelected(navigator);
            };
            scope.loadSearchResults = function(keywords) {
                $location.path(scope.searchUri).search('q', keywords);
            };

            var orignOffsetTop = element[0].offsetTop;
            scope.condition = function() {
                return $window.pageYOffset > orignOffsetTop;
            };

            angular.element($window).bind('scroll', function(){
                scope.$apply(function(){
                    if(scope.condition()) {
                        angular.element(element).addClass('navbar-fixed-top');
                    } else {
                        angular.element(element).removeClass('navbar-fixed-top');
                    }
                });
            });
        },
        controller: function($scope) {
            $scope.$on('$routeChangeStart', function() {
                navigators.select(null);
                $scope.inSearch = false;
            });
            $scope.$on('$routeChangeSuccess', function (event, current, previous) {
                switch(current.$$route.controller) {
                    case $scope.articleCtrl:
                        navigators.selectByURI(current.params.uri);
                        break;
                    case $scope.listCtrl:
                        navigators.selectByURI(current.params.category);
                        break;
                    case $scope.searchCtrl:
                        $scope.inSearch = true;
                        break;
                }
            });
        }
    };
});

app.directive('ngcDone', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.ngcDone, function (callback) {

            if (scope.$last === undefined) {
                scope.$watch('data', function () {
                    if (scope.data !== undefined) {
                        $timeout(eval(callback), 1);
                    }
                });
            }

            if (scope.$last) {
                eval(callback)();
            }
        });
    }
});

app.directive('ycTagsIndex', function(json){
   return {
       restrict: 'E',
       scope: true,
       link: function(scope, element, attrs) {
           scope.viewUrl = attrs.viewUrl;
           json.load(attrs.url)
               .then(function(data){
                   scope.tags = data;
               }, function(data){
                   console.log('can not load' + attrs.url);
               });
           scope.isSelected = function(selected) {
               return selected == scope.selected;
           }
       },
       templateUrl: function(element, attrs) {
           return attrs.templateUrl;
       },
       controller: function($scope) {
           $scope.$on('$routeChangeSuccess', function (event, current, previous) {
               $scope.selected = current.params.tag;
           });
       }
   }
});

app.directive('compileTemplate', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            //Recompile if the template changes
            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
            });
        }
    }
});