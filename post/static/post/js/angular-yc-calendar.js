/**
 * Created by yuchen on 7/21/15.
 */

angular.module('yc.calendar', [])
    .directive("calendar", function($http, $q) {
        return {
            restrict: "E",
            scope: {
                bind: '=',
                ctrl: '@'
            },
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl;
            },


            link: function(scope, element, attrs) {
                if(attrs.posts) {
                    _loadJson(attrs.posts)
                        .then(function(data){
                            scope.posts = data;
                        }, function(data){
                            console.log('can not load' + attrs.posts);
                        });
                }
                scope.dateCtrl = attrs.dateCtrl;

                scope.month = _removeTime(moment());
                var start = scope.month.clone();
                start.date(1);
                _removeTime(start.day(0));

                _buildMonth(scope, start, scope.month);

                scope.select = function(day) {
                    scope.bind.goto(day.date);
                };

                scope.next = function() {
                    var next = scope.month.clone();
                    _removeTime(next.month(next.month()+1).date(1));
                    scope.month.month(scope.month.month()+1);
                    _buildMonth(scope, next, scope.month);
                };

                scope.previous = function() {
                    var previous = scope.month.clone();
                    _removeTime(previous.month(previous.month()-1).date(1));
                    scope.month.month(scope.month.month()-1);
                    _buildMonth(scope, previous, scope.month);
                };

                scope.hasPosts = function(day) {
                    if(scope.posts){
                        for(i=0; i<scope.posts.length; i++) {
                            if(scope.posts[i].list[day.date.format('YYYY-MM-DD')] != undefined){
                                return true;
                            }
                        }
                    }
                    return false;
                }

                scope.tips = function(day) {
                    if(scope.hasPosts(day)) {
                        var strs = [];
                        for(i=0; i<scope.posts.length; i++) {
                            var c = scope.posts[i].list[day.date.format('YYYY-MM-DD')];
                            if(c != undefined) {
                                strs.push(scope.posts[i].prefix + c + scope.posts[i].affix);
                            }
                        }
                        return strs.join(", ");
                    }
                    return null;
                }
            },
            controller: function($scope) {
                $scope.$on('$routeChangeSuccess', function (event, current, previous) {
                    if(current.$$route.controller == $scope.ctrl) {
                        var regex = /^(\d{4})-(\d{2})-(\d{2})$/g
                        var match = regex.exec(current.params.date);
                        if(match) {
                            $scope.selected = moment(match[0]);
                        } else {
                            $scope.selected = null;
                        }
                    }
                });
            }
        };
        function _removeTime(date) {
            return date.day(0).hour(0).minute(0).second(0).millisecond(0);
        }
        function _buildMonth(scope, start, month) {
            scope.weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
            while (!done) {
                scope.weeks.push({ days: _buildWeek(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }
        function _buildWeek(date, month) {
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    date: date
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }

        function _loadJson(url) {
            var deferred = $q.defer();
            $http.get(url).success(function(data){
                deferred.resolve(data);
            }).error(function(){
                deferred.reject('Wrong URL');
            });
            return deferred.promise;
        }
});