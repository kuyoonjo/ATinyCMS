/**
 * Created by yuchen on 7/16/15.
 */


var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ezfb']);

app.config(function($httpProvider, $routeProvider, $locationProvider, ezfbProvider) {
    $routeProvider
        .when(config.settings.searchUri, {
                templateUrl: parse('%spost/html/search.html', config.settings.staticUri),
                controller: 'mySearchCtrl'
        })
        .when(config.settings.postUri, {
            redirectTo: config.settings.postUri + config.settings.home
        })
        .when(parse('%s:uri*', config.settings.postUri), {
            templateUrl: parse('%spost/html/articles.html', config.settings.staticUri),
            controller: 'myArticleCtrl'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    ezfbProvider.setInitParams({
        appId: '375005332696718'
    });
});

app.run(function($rootScope) {
    $rootScope.config = config;
    $rootScope.settings = $rootScope.config.settings;
    $rootScope.title = $rootScope.settings.title;
    $rootScope.footer = {style: {}};
    $rootScope.navigators = $rootScope.config.navigators;
    $rootScope.inSearch = false;
    $rootScope.images = {
        nav: {
            logo: image_logo_kitty_uri,
            bullet: image_bullet_kitty_uri
        }
    };
    $rootScope.notFound = [{
        title: 'Error',
        content: '404 Not Found Error.'
    }];
});