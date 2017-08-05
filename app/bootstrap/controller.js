/*!
 * https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md
 * https://github.com/johnpapa/ng-demos
 */
(function () {

    'use strict';

    /**
     * 获取已声明模块(使用getter的链式语法避免直接用一个变量导致出现变量冲突和泄漏问题)
     */
    angular
        .module('app.bootstrap.module')
        .controller('BootstrapCtrl', BootstrapCtrl)
        .controller('BootstrapModalCtrl', BootstrapModalCtrl);

    function BootstrapCtrl($scope, $http, $uibModal, $log) {

        $log.debug($scope);

        var vm = this;

        vm.user = {};

        vm.edit = edit;
        vm.remove = remove;
        vm.view = view;
        vm.query = query;
        vm.reset = reset;

        vm.query();

        function edit(row) {
            var modalInstance = $uibModal.open({
                templateUrl: 'edit.html',
                controller: 'BootstrapModalCtrl',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            parentCtrl: vm,
                            rowData: angular.copy(row),
                            title: '更新用户'
                        };
                    }
                }
            });
            modalInstance.opened.then(function () {
                console.log("modal opened");
            });
            modalInstance.rendered.then(function () {
                console.log("modal rendered");
            });
            modalInstance.closed.then(function () {
                console.log("modal closed");
            });
        }

        function remove(row) {
            $log.info(row);
        }

        function view(row) {
            // row.uid = row.uid + '_';
            // row.username = row.username + '_';
            var userExt = angular.extend({}, row);
            userExt.uid = row.uid + '_';
            var userClone = angular.copy(row);
            userClone.username = row.username + '_';
        }

        function query() {
            $log.info('Query => ' + JSON.stringify(vm.user));
            $http({
                method: 'GET',
                url: 'data/Grid.json',
                data: vm.user
            }).then(function (response) {
                vm.recordsTotal = response.data.recordsTotal;
                vm.users = response.data.data;
            });
        }

        function reset() {
            vm.user = {};
        }

    }

    function BootstrapModalCtrl($scope, $uibModalInstance, $log, items) {

        var vm = this;

        console.info($uibModalInstance);

        vm.user = items.rowData;
        vm.title = items.title;
        vm.parentCtrl = items.parentCtrl;

        vm.save = function () {
            $uibModalInstance.close(true);
            vm.parentCtrl.query();
        };

        vm.close = function () {
            $uibModalInstance.dismiss(0);
        };

        // $scope.$on('$destroy', function () {
        //     $log.debug('Modal scope should be destroyed.');
        // });

    }

})();