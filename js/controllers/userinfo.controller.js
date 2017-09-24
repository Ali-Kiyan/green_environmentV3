
gnApp.controller('UserInfoController',
    ['$scope', '$routeParams', '$location' , '$firebaseAuth', '$firebaseObject', 'FIREBASE_URL',
        function ($scope, $routeParams, $location , $firebaseAuth, $firebaseObject, FIREBASE_URL) {

    $scope.whichUser = $routeParams.uId;

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    auth.$onAuth(function (authUser) {
        if (authUser) {
            var userRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser);
            var userObj = $firebaseObject(userRef);
            $scope.user = userObj;

            $scope.changeInfo= function () {
                var userRef = new Firebase(FIREBASE_URL + 'users/');

                var input = document.getElementById("inputFile");
                console.log(input);
                if(input.value !== ''){
                    var fReader = new FileReader();
                    fReader.readAsDataURL(input.files[0]);
                    fReader.onloadend = function(event) {
                        userRef.child($scope.whichUser).update({
                            image : event.target.result
                        });
                    };
                    input.value = '';
                }
                userRef.child($scope.whichUser).update({
                    name : $scope.user.name,
                    nationalCode : $scope.user.nationalCode,
                    telephone : $scope.user.telephone,
                    sex : $scope.user.sex,
                    maritalState : $scope.user.maritalState,
                    childCount : ($scope.user.maritalState == 'single' ? '0' : $scope.user.childCount),
                    accountNumber : $scope.user.accountNumber,
                    workRecord : $scope.user.workRecord,
                    address : $scope.user.address,
                    changeAt : Firebase.ServerValue.TIMESTAMP
                });
                swal("Successful", "Your changes has been saved successfully", "success");

            }; //changeInfo

            $scope.deleteImage = function () {
                var userRef = new Firebase(FIREBASE_URL + 'users/');
                userRef.child($scope.whichUser).update({
                    image : ''
                });
            }; //deleteImage

        }
    })

}]);