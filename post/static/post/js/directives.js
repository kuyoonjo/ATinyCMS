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

app.directive('ycBody', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            scope.heights = function() {
                return {
                    window: $window.innerHeight,
                    body: element[0].offsetHeight
                };
            };

            var setFooter = function() {
                if (scope.windowHeight > scope.bodyHeight + 100) {
                    scope.footer.style = {
                        position: 'absolute',
                        bottom: 0
                    };
                } else {
                    scope.footer.style = {};
                }
            };

            scope.$watch(scope.heights, function (newValue, oldValue) {
                scope.windowHeight = newValue.window;
                scope.bodyHeight = newValue.body;
                setFooter();
            }, true);

            angular.element($window).bind('resize', function(){
                scope.$apply();
            });
        }
    };
});

app.directive('ycNavbar', function($window, $location, navigators){
    // navigators="" template-url="" post-uri="" search-uri="" images="" articleCtrl="" searchCtrl=""
    var orignOffsetTop;
    function getCurrentOffsetTop(element) {
        return element.offsetTop
    }
    return {
        restrict: 'A',
        scope: {
            navigators: '=',
            images: '=',
            postUri: '@',
            searchUri: '@',
            articleCtrl: '@',
            searchCtrl: '@'
        },
        templateUrl: function(element, attrs) {
            return attrs.templateUrl;
        },
        link: function(scope, element, attrs) {
            orignOffsetTop = element[0].offsetTop;
            scope.currentOffsetTop = function() {
                return $window.pageYOffset;
            };
            navigators.set(scope.navigators);
            scope.navbarCollapsed = true;
            scope.isSelected = function(navigator) {
                return navigators.isSelected(navigator);
            };
            scope.loadSearchResults = function(keywords) {
                $location.path(scope.searchUri).search('q', keywords);
            };
            scope.$watch(scope.currentOffsetTop, function(newValue, oldValue){
                if(newValue > orignOffsetTop) {
                    angular.element(element).addClass('navbar-fixed-top');
                } else {
                    angular.element(element).removeClass('navbar-fixed-top');
                }
            });
            angular.element($window).bind('scroll', function(){
                scope.$apply();
            });
        },
        controller: function($scope) {
            $scope.$on('$routeChangeStart', function() {
                navigators.select(null);
                $scope.inSearch = false;
            });
            $scope.$on('$routeChangeSuccess', function (event, current, previous) {
                if(current.$$route.controller == $scope.articleCtrl) {
                    navigators.selectByURI(current.params.uri);
                }
                if(current.$$route.controller == $scope.searchCtrl) {
                    $scope.inSearch = true;
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