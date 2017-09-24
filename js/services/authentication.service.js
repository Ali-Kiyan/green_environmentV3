gnApp.factory('Authentication',
    ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth', 'FIREBASE_URL',
        function ($rootScope, $location, $firebaseObject, $firebaseAuth, FIREBASE_URL) {

            var ref = new Firebase(FIREBASE_URL);
            var auth = $firebaseAuth(ref);
            $rootScope.dataLoading = '';

            auth.$onAuth(function (authUser) {
                if (authUser) {
                    var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
                    $rootScope.currentUser = $firebaseObject(userRef);
                } else {
                    $rootScope.currentUser = '';
                }
            }); // Create Current User

            var result = {

                login: function (user) {
                    $rootScope.dataLoading = true;
                    auth.$authWithPassword({
                        email: user.email,
                        password: user.password
                    }).then(function (loginUser) {
                        result.checkRole(loginUser);
                    }).catch(function (error) {
                        $rootScope.dataLoading = false;
                        console.log(error);
                        swal("Oops...", error.message, "error");
                    });
                }, // Login

                register: function (user) {
                    $rootScope.dataLoading = true;
                    auth.$createUser({
                        email: user.email,
                        password: user.password
                    }).then(function (regUser) {

                        var regRef = new Firebase(FIREBASE_URL + '/users');
                        regRef.child(regUser.uid).set({
                            name: user.name,
                            nationalCode: user.nationalCode,
                            roleId: user.roleId,
                            email: user.email,
                            regUser: regUser.uid,
                            createdAt: Firebase.ServerValue.TIMESTAMP
                        });
                        swal("The registration has been successful", "Thank you for your registration", "success");
                        result.login(user);
                    }).catch(function (error) {
                        $rootScope.dataLoading = false;
                        swal("Oops...", error.message, "error");
                    });

                }, // Register

                logout: function () {
                    $rootScope.dataLoading = false;
                    return auth.$unauth();

                }, // Logout

                requireAuth: function () {
                    return auth.$requireAuth();
                }, // Require Authentication

                nowAuth: function () {
                    auth.$onAuth(function (authUser) {
                        if (authUser) {
                            result.checkRole(authUser);
                        }
                    })
                }, // Now Authentication

                checkRole : function (user) {
                    var userRef = new Firebase(FIREBASE_URL + '/users/' + user.uid);
                    var userData = $firebaseObject(userRef);
                    userData.$loaded().then(function () {
                        switch (userData.roleId) {
                            case 1 :
                                $location.path('/employer');
                                $rootScope.dataLoading = false;
                                break;
                            case 2 :
                                $location.path('/executive');
                                $rootScope.dataLoading = false;
                            case 3 :
                                $location.path('/accountant');
                                $rootScope.dataLoading = false;
                        } //User Data

                        // To iterate the key/value pairs of the object, use angular.forEach()
                        //angular.forEach(userData, function(value, key) {
                        //    console.log(key, value);
                        //});
                    });
                } // Check Role

            };

            return result;

        }]);