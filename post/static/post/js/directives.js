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
            var window = angular.element($window);

            scope.heights = function() {
                return {
                    window: window.height(),
                    body: element.outerHeight()
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

            window.bind('resize', function(){
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
            element.affix({
                offset: {
                    top: element.offset().top
                }
            });
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
            scope.triggerClick = function($event, selector, keywords) {
                $(selector).trigger('click');
                scope.loadSearchResults(keywords);
            };
        }
    };
});

app.directive('ycArticleAnimate', function($animate, $rootScope){
    return function(scope, element) {
        $rootScope.showFooter = false;
        $animate.addClass(element, ' view-frame').then(function(element){
            $rootScope.showFooter = true;
        });
    };
});