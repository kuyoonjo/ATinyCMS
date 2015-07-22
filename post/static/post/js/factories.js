/**
 * Created by yuchen on 7/16/15.
 */

app.factory('navigators', function() {
    var factory = {};
    var navigators;
    var selected;
    factory.set = function(navs) {
        navigators = navs;
    };

    factory.select = function(nav) {
        selected = nav;
    };

    factory.selectByURI = function(uri) {
        var category_uri = uri.split('/')[0];
        for(i=0; i<navigators.length; i++) {
            if(navigators[i].category) {
                if(navigators[i].category.uri.split('/')[0] == category_uri) {
                    factory.select(navigators[i]);
                    return;
                }
            }
        }
    };

    factory.isSelected = function(nav) {
        return selected == nav;
    }

    return factory;
});

app.factory('json', function($http, $q){
    var factory = {};
    factory.load = function(url) {
        var deferred = $q.defer();
        $http.get(url).success(function(data){
            deferred.resolve(data);
        }).error(function(){
            deferred.reject('Wrong URL');
        });
        return deferred.promise;
    }
    return factory;
});