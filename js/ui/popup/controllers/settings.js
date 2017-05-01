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
     * @ngdoc function
     * @name passmanApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the passmanApp
     */
    angular.module('passmanExtension')
        .controller('SettingsCtrl', ['$scope', '$rootScope', 'Settings', '$location', function ($scope, $rootScope, Settings, $location) {
            $scope.settings = {
                nextcloud_host: '',
                nextcloud_username: '',
                nextcloud_password: '',
                ignoreProtocol: true,
                ignoreSubdomain: true,
                ignorePort: true,
                ignorePath: true,
                generatedPasswordLength: 12,
                remember_password: true,
                remember_vault_password: true,
                refreshTime: 60,
                debug: false
            };
            $scope.errors = [];

            API.runtime.sendMessage(API.runtime.id, {'method': 'getRuntimeSettings'}).then(function (settings) {
                $scope.errors = [];
                if (settings) {
                    $scope.settings = angular.copy(settings);
                }

                $scope.get_vaults = function () {
                    if (!$scope.settings.hasOwnProperty('nextcloud_host') || !$scope.settings.hasOwnProperty('nextcloud_password') || !$scope.settings.hasOwnProperty('nextcloud_username')) {
                        return;
                    }
                    PAPI.username = $scope.settings.nextcloud_username;
                    PAPI.password = $scope.settings.nextcloud_password;
                    PAPI.host = $scope.settings.nextcloud_host;
                    $scope.extension = API.runtime.getManifest().name + ' extension ' + API.runtime.getManifest().version;
                    PAPI.getVaults(function (vaults) {
                        $scope.errors = [];
                        var save_btn = jQuery('#save'),
                            login_required = jQuery('.login-req');
                        if (vaults.hasOwnProperty('error')) {

                            var errors = API.i18n.getMessage('invalid_response_from_server', [vaults.result.status, vaults.result.statusText]);
                            $scope.errors.push(errors);
                            login_required.hide();
                            save_btn.hide();
                            $scope.$apply();
                            return;

                        }
                        login_required.show();
                        save_btn.show();
                        $scope.vaults = vaults;
                        $scope.$apply();

                    });
                };

                $scope.$watch('[settings.nextcloud_host, settings.nextcloud_username, settings.nextcloud_password]', function () {
                    if ($scope.settings.nextcloud_host && $scope.settings.nextcloud_username && $scope.settings.nextcloud_password) {
                        $scope.get_vaults();
                    }
                }, true);

                if ($scope.settings.nextcloud_host && $scope.settings.nextcloud_username && $scope.settings.nextcloud_password) {
                    $scope.get_vaults();
                }
                $scope.$apply();
            });

            $scope.saving = false;
            $scope.saveSettings = function () {
                $scope.errors = [];
                var settings = angular.copy($scope.settings);
                for (var i =0; i < $scope.vaults.length; i++){
                    var vault = $scope.vaults[i];
                    if(vault.guid == settings.default_vault.guid){
                        settings.default_vault = angular.copy(vault);
                        break;
                    }
                }

                try {
                    /** global: PAPI */
                    PAPI.decryptString(settings.default_vault.challenge_password, settings.vault_password);
                } catch (e) {
                    $scope.errors.push(API.i18n.getMessage('invalid_vault_password'));
                    return;
                }

                $scope.saving = true;
                API.runtime.sendMessage(API.runtime.id, {method: "saveSettings", args: settings}).then(function () {
                    setTimeout(function () {
                        window.location = '#!/';
                        $scope.saving = false;
                    }, 750);
                });
            };

            $scope.removeSite = function (site) {
                var idx = $scope.settings.ignored_sites.indexOf(site);
                $scope.settings.ignored_sites.splice(idx, 1);
            };

            $scope.ignoreSite = '';
            $scope.addSite = function (site) {
                $scope.settings.ignored_sites.push(site);
                $scope.ignoreSite = '';
            };


            $scope.cancel = function () {
                window.location = '#!/';
            };
        }]);
}());

