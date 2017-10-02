/**
 * AngularJS module for updating browser title/history based on the current ui-router state.
 *
 * @link https://github.com/josduj/angular-ui-router-title
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
        .run(["$transitions", "$injector", function ($transitions, $injector) {
            $transitions.onStart({}, function (trans) {
                trans.promise.finally(function () {
                    var title = getTitleValue(trans.injector().get('$title'));
                    var documentTitle = documentTitleCallback
                        ? $injector.invoke(documentTitleCallback, null, {title: title})
                        : title || defaultDocumentTitle;
                    document.title = documentTitle;
                });
            });
        }]);

    function getTitleValue(title) {
        return angular.isObject(title) ? undefined : title;
    }

})(window.angular);