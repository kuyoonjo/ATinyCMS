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

app.directive('ycNavbar', function($rootScope, $location, navigators){
    return {
        restrict: 'A',
        scope: {
            inSearch: "=inSearch"
        },
        templateUrl: parse('%spost/html/navbar.html', $rootScope.settings.staticUri),
        link: function(scope, element) {
            /*element.affix({
                offset: {
                    top: element.offset().top
                }
            });*/
            scope.navbarCollapsed = true;
            scope.navigators = $rootScope.navigators;
            scope.root = $rootScope.settings.postUri;
            scope.images = $rootScope.images;
            navigators.set(scope.navigators);
            scope.isSelected = function(navigator) {
                return navigators.isSelected(navigator);
            };
            scope.loadSearchResults = function(keywords) {
                $location.path($rootScope.settings.searchUri).search('q', keywords);
            };
        }
    };
});

app.directive('ycArticleAnimate', function($animate, $rootScope){
    return function(scope, element) {
        $rootScope.showFooter = false;
        $animate.addClass(element, 'view-frame').then(function(element){
            $rootScope.showFooter = true;
        });
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