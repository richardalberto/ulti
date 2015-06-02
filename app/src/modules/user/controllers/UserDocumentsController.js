'use strict';

angular.module('user').controller('UserDocumentsController', function ($scope, UserService, DocumentService, $stateParams, $modal) {

    $scope.user      = UserService.getById($stateParams.userId);
    $scope.documents = DocumentService.getDocumentsByOwner($scope.user);
    $scope.myFile    = null;

    $scope.$watch('myFile', function () {
        $scope.upload($scope.myFile);
    });

    $scope.add = function() {
        var addModalInstance = $modal.open({
            animation: true,
            templateUrl: '/src/modules/document/views/add-modal.html',
            controller: 'AddModalController',
            size: 'lg'
        });

        addModalInstance.result.then(function(document) {
            if(DocumentService.add(document)) {
                toaster.pop('success', 'Document Create', 'The document was created.');
            }
            else {
                toaster.pop('error', 'Invalid Document', 'The document was not created.');
            }
        });
    };

    $scope.upload = function (files) {
        if (files && files.length) {
            var file = files[0];

            var document = {
                id: DocumentService.getLastId() + 1,
                name: file.name,
                owner: $scope.user,
                downloads: 0,
                views: 0,
                uploaded: new Date(),
                modified: new Date(),
                type: file.type,
                sharedWith: []
            };

            if(DocumentService.add(document)) {
                toaster.pop('success', 'Document Added', 'A new document was added');
            }
            else {
                toaster.pop('error', 'Invalid Document', 'The document was not created because is invalid');
            }

        }
    };

    $scope.$on('document:created', function() {
        $scope.documents = DocumentService.getDocumentsByOwner($scope.user);
    });

});