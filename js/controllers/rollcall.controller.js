gnApp.controller('RollCallController',
    ['$scope','$routeParams','$firebaseAuth', '$firebaseObject', 'FIREBASE_URL',
        function ($scope, $routeParams, $firebaseAuth, $firebaseObject, FIREBASE_URL) {

            $scope.whichUser = $routeParams.uId;
            $scope.whichProject = $routeParams.pId;

            var ref = new Firebase(FIREBASE_URL);
            var auth = $firebaseAuth(ref);

            auth.$onAuth(function (authUser) {
                if (authUser) {
                    var projectRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/' + $scope.whichProject);
                    var projectData = $firebaseObject(projectRef);
                    projectData.$loaded().then(function () {
                        $scope.projectName = projectData.name;
                        var startDate = new Date(projectData.startDate);
                        var endDate = new Date(projectData.endDate);

                        var daysOfYear = [];
                        for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                            daysOfYear.push(new Date(d));
                        }
                        $scope.days = daysOfYear;
                    });
                }
            });

        }]);