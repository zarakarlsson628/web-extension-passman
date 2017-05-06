/**
 * Nextcloud - passman
 *
 * @copyright Copyright (c) 2016, Sander Brand (brantje@gmail.com)
 * @copyright Copyright (c) 2016, Marcos Zuriaga Miguel (wolfi@wolfi.es)
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name passmanApp.directive:passwordGen
     * @description
     * # passwordGen
     */
    angular.module('passmanExtension')
        .directive('copyText', ['$compile', '$timeout',
            function ($compile, $timeout) {
                var strCopy = API.i18n.getMessage('copy');

                return {
                    restrict: 'E',
                    scope:{
                      text: '='
                    },
                    template: '<md-icon class="pointer" ng-click="copyText()">content_copy</md-icon>',
                    replace: true,
                    link: function (scope, el) {
                        scope.copyText = function () {
                            var txtToCopy = document.createElement('input');
                            txtToCopy.value = scope.text;
                            document.body.appendChild(txtToCopy);
                            txtToCopy.select();
                            document.execCommand('copy');
                            txtToCopy.parentNode.removeChild(txtToCopy);
                        };
                    }
                };
            }
        ]);
}());