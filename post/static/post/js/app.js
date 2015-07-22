/**
 * Created by yuchen on 7/16/15.
 */


var app = angular.module('myApp', ['ngRoute', 'ngSanitize','ui.bootstrap', 'ezfb', 'yc.calendar']);

app.config(function($httpProvider, $routeProvider, $locationProvider, ezfbProvider) {
    var tplArticle = parse('%spost/html/articles.html', config.settings.staticUri);
    $routeProvider
        .when(parse('%s%s:tag', config.settings.postUri, config.settings.tagUri), {
            templateUrl: tplArticle,
            controller: 'tagCtrl'
        })
        .when(parse('%s%s:date', config.settings.postUri, config.settings.dateUri), {
            templateUrl: tplArticle,
            controller: 'dateCtrl'
        })
        .when(config.settings.searchUri, {
            templateUrl: tplArticle,
            controller: 'searchCtrl'
        })
        .when(config.settings.postUri, {
            redirectTo: config.settings.postUri + config.settings.home
        })
        .when(parse('%s:uri*', config.settings.postUri), {
            templateUrl: tplArticle,
            controller: 'articleCtrl'
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
    $rootScope.images = {
        nav: {
            logo: image_logo_kitty_uri,
            bullet: image_bullet_kitty_uri
        }
    };
    $rootScope.notFound = {
        by: 'error',
        list: [{
            title: 'Error',
            content: '404 Not Found Error.'
        }]
    };
});