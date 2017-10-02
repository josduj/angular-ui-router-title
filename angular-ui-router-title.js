/**
 * AngularJS module for updating browser title/history based on the current ui-router state.
 *
 * @link https://github.com/nonplus/angular-ui-router-title
 *
 * @license angular-ui-router-title v0.1.1
 * (c) Copyright Stepan Riha <github@nonplus.net>
 * License MIT
 */

(function(angular) {

    "use strict";

    var documentTitleCallback = undefined;
    var defaultDocumentTitle = document.title;

    angular
        .module("ui.router.title", ["ui.router"])
        .provider("$title", function $titleProvider() {
            return {
                documentTitle: function (cb) {
                    documentTitleCallback = cb;
                },
                $get: ["$state", function ($state) {
                    return {
                        title: function () {
                            return getTitleValue($state.$current.locals.globals["$title"]);
                        }
                    };
                }]
            };
        })
        .run(["$rootScope", "$timeout", "$title", "$injector", function ($rootScope, $timeout, $title, $injector) {
            $rootScope.$on("$stateChangeSuccess", function () {
                var title = $title.title();
                $timeout(function () {
                    var documentTitle = documentTitleCallback ? $injector.invoke(documentTitleCallback) : title || defaultDocumentTitle;
                    document.title = documentTitle;
                });
            });
        }]);

    function getTitleValue(title) {
        return angular.isFunction(title) ? title() : title;
    }

})(window.angular);