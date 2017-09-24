
gnApp.controller('EmployerController',
    ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
        function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

            var ref = new Firebase(FIREBASE_URL);
            var auth = $firebaseAuth(ref);

            auth.$onAuth(function (authUser) {
                if (authUser) {
                    var projectRef = new Firebase(FIREBASE_URL + 'users/' + $rootScope.currentUser.$id + '/projects');
                    var projectData = $firebaseArray(projectRef);

                    $scope.projects = projectData;

                    //projectData.$loaded().then(function (data) {
                    //    $rootScope.howManyProjects = projectData.length;
                   // }); //loaded in refreshment

                    projectData.$watch(function () {
                        $rootScope.howManyProjects = projectData.length;
                    }); //watch load without refereshment

                    $scope.addProject = function () {
                        $rootScope.dataLoading = true;
                        projectData.$add({
                            name: $scope.project.name,
                            cost: $scope.project.cost,
                            startDate: $scope.project.startDate.getTime(),
                            endDate: $scope.project.endDate.getTime(),
                            createDate: Firebase.ServerValue.TIMESTAMP
                        }).then(function () {
                            $scope.project.name = '';
                            $scope.project.cost = '';
                            $scope.project.startDate = '';
                            $scope.project.endDate = '';
                            $scope.projectForm.$setPristine();
                            $scope.projectForm.$setUntouched();
                            $scope.hiddenClass = true;
                            $rootScope.dataLoading = false;
                        });
                    };// addProject

                    $scope.deleteProject = function (key) {
                        projectData.$remove(key);
                    };// deleteProject

                } //authUser
            });


        }]);