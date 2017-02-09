/* global API */

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
     * @ngdoc service
     * @name passmanApp.CacheService
     * @description
     * # CacheService
     * Service in the passmanApp.
     */
    angular.module('passmanExtension')
        .factory('Settings', ['$q', function ($q) {
            var storage = new API.Storage();
            var settings = {};
            settings.set = function (key, value) {
                storage.set(key, value);
                settings[key] = value;

            };
            settings.setAll = function (_settings) {
                storage.set('settings', _settings);
            };

            settings.getSettings = function (callback) {
                storage.get('settings').then(function(keyValue) {
                    callback(keyValue);
                }).error(function () {
                    callback(undefined);
                });
            };

            return settings;
        }]);
}());

