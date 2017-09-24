
gnApp.controller('UserManagementController',
    ['$scope', '$rootScope', '$routeParams', 'orderByFilter' , '$firebaseAuth', '$firebaseArray', '$firebaseObject', 'FIREBASE_URL',
        function ($scope, $rootScope, $routeParams, orderBy , $firebaseAuth, $firebaseArray, $firebaseObject, FIREBASE_URL) {

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
                    });

                    var userRef = new Firebase(FIREBASE_URL + 'users/');
                    var prRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/');



                    var executiveRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/' + $scope.whichProject + '/personals/executive/');
                    var executiveData = $firebaseArray(executiveRef);
                    $scope.executives = executiveData;
                    executiveData.$loaded().then(function (data) {
                        $scope.howManyExecutivePer = executiveData.length;
                        prRef.child($scope.whichProject).update({
                            executiveCount: $scope.howManyExecutivePer
                        });
                    }); //loaded

                    executiveData.$watch(function () {
                        $scope.howManyExecutivePer = executiveData.length;
                        prRef.child($scope.whichProject).update({
                            executiveCount: $scope.howManyExecutivePer
                        });
                    }); //watch



                    var accountantRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/' + $scope.whichProject + '/personals/accountant/');
                    var accountantData = $firebaseArray(accountantRef);
                    $scope.accountants = accountantData;
                    accountantData.$loaded().then(function (data) {
                        $scope.howManyAccountantPer = accountantData.length;
                        prRef.child($scope.whichProject).update({
                            accountantCount: $scope.howManyAccountantPer
                        });
                    }); //loaded

                    accountantData.$watch(function () {
                        $scope.howManyAccountantPer = accountantData.length;
                        prRef.child($scope.whichProject).update({
                            accountantCount: $scope.howManyAccountantPer
                        });
                    }); //watch




                    var employeeRef = new Firebase(FIREBASE_URL + '/users/' + $scope.whichUser + '/projects/' + $scope.whichProject + '/personals/employee/');
                    var employeeData = $firebaseArray(employeeRef);
                    $scope.employees = employeeData;
                    employeeData.$loaded().then(function (data) {
                        $scope.howManyEmployeePer = employeeData.length;
                        prRef.child($scope.whichProject).update({
                            employeeCount: $scope.howManyEmployeePer
                        });
                    }); //loaded

                    employeeData.$watch(function () {
                        $scope.howManyEmployeePer = employeeData.length;
                        prRef.child($scope.whichProject).update({
                            employeeCount: $scope.howManyEmployeePer
                        });
                    }); //watch



                    $scope.addUser = function () {
                        $rootScope.dataLoading = true;
                        auth.$createUser({
                            email: $scope.user.email,
                            password: $scope.user.password
                        }).then(function (regUser) {

                            var myData = {
                                name: $scope.user.name,
                                nationalCode: $scope.user.nationalCode,
                                email: $scope.user.email,
                                telephone: $scope.user.telephone,
                                sex: $scope.user.sex,
                                maritalState: $scope.user.maritalState,
                                childCount: ($scope.user.maritalState == 'single' ? '0' : $scope.user.childCount),
                                accountNumber: $scope.user.accountNumber,
                                workRecord: $scope.user.workRecord,
                                address: $scope.user.address,
                                projectAssign: $scope.whichProject,
                                roleId: $scope.user.roleId,
                                regUser: regUser.uid,
                                createdBy: $scope.whichUser,
                                createdAt: Firebase.ServerValue.TIMESTAMP
                            };
                            userRef.child(regUser.uid).set(myData);
                            // do not generate hash key
                            switch ($scope.user.roleId) {
                                case '2':
                                    executiveData.$add(myData).then(function (ref) {
                                        var id = ref.key();
                                        var input = document.getElementById("inputFile");
                                        if (input.value !== '') {
                                            var fReader = new FileReader();
                                            fReader.readAsDataURL(input.files[0]);
                                            fReader.onloadend = function (event) {

                                                userRef.child(regUser.uid).update({
                                                    image: event.target.result
                                                });
                                                executiveRef.child(id).update({
                                                    image: event.target.result
                                                });
                                            };
                                            input.value = '';
                                        }
                                    });
                                    break;
                                case '3':
                                    accountantData.$add(myData).then(function (ref) {
                                        var id = ref.key();
                                        var input = document.getElementById("inputFile");
                                        if (input.value !== '') {
                                            var fReader = new FileReader();
                                            fReader.readAsDataURL(input.files[0]);
                                            fReader.onloadend = function (event) {

                                                userRef.child(regUser.uid).update({
                                                    image: event.target.result
                                                });
                                                accountantRef.child(id).update({
                                                    image: event.target.result
                                                });
                                            };
                                            input.value = '';
                                        }
                                    });
                                    break;
                                case '4':
                                    employeeData.$add(myData).then(function (ref) {
                                        var id = ref.key();
                                        var input = document.getElementById("inputFile");
                                        if (input.value !== '') {
                                            var fReader = new FileReader();
                                            fReader.readAsDataURL(input.files[0]);
                                            fReader.onloadend = function (event) {

                                                userRef.child(regUser.uid).update({
                                                    image: event.target.result
                                                });
                                                employeeRef.child(id).update({
                                                    image: event.target.result
                                                });
                                            };
                                            input.value = '';
                                        }
                                    });
                                    break;
                            }
                            $rootScope.dataLoading = false;
                            swal("Personnel is added", "", "success");
                            $scope.user.name = '';
                            $scope.user.nationalCode = '';
                            $scope.user.email = '';
                            $scope.user.telephone = '';
                            $scope.user.sex = '';
                            $scope.user.maritalState = '';
                            $scope.user.childCount = '';
                            $scope.user.accountNumber = '';
                            $scope.user.workRecord = '';
                            $scope.user.address = '';
                            $scope.user.roleId = '';
                            $scope.user.password = '';
                            $scope.userForm.$setPristine();
                            $scope.userForm.$setUntouched();

                        }).catch(function (error) {
                            $rootScope.dataLoading = false;
                            swal("Oops...", error.message, "error");
                        });

                    }; //Add User

                    $scope.deleteExecutive = function (key) {
                        executiveData.$remove(key);
                    }; // Delete Executive

                    $scope.copyExecutive = function (key) {
                        $scope.eUser = executiveData[key];
                    }; // Copy Executive Details

                    $scope.editExecutive = function () {

                        executiveRef.child($scope.eUser.$id).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });
                        userRef.child($scope.eUser.regUser).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });

                        var input = document.getElementById("inputEditImageExecutive");
                        if (input.value !== '') {
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {

                                userRef.child($scope.eUser.regUser).update({
                                    image: event.target.result
                                });
                                executiveRef.child($scope.eUser.$id).update({
                                    image: event.target.result
                                });
                            };
                            input.value = '';
                        }
                        $scope.msg = 'The information has been saved';
                    }; // Edit Executive Details

                    $scope.deleteAccountant = function (key) {
                        accountantData.$remove(key);
                    }; // Delete Accountant

                    $scope.copyAccountant = function (key) {
                        $scope.eUser = accountantData[key];
                    }; // Copy Accountant Details

                    $scope.editAccountant = function () {

                        accountantRef.child($scope.eUser.$id).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });
                        userRef.child($scope.eUser.regUser).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });

                        var input = document.getElementById("inputEditImageAccountant");
                        if (input.value !== '') {
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {

                                userRef.child($scope.eUser.regUser).update({
                                    image: event.target.result
                                });
                                accountantRef.child($scope.eUser.$id).update({
                                    image: event.target.result
                                });
                            };
                            input.value = '';
                        }
                        $scope.msg = 'The information has been saved';
                    }; // Edit Accountant Details

                    $scope.deleteEmployee = function (key) {
                       employeeData.$remove(key);
                    }; // Delete Employee

                    $scope.copyEmployee = function (key) {
                        $scope.eUser = employeeData[key];
                    }; // Copy Employee Details

                    $scope.editEmployee = function () {

                        employeeRef.child($scope.eUser.$id).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });
                        userRef.child($scope.eUser.regUser).update({
                            name: $scope.eUser.name,
                            nationalCode: $scope.eUser.nationalCode,
                            telephone: $scope.eUser.telephone,
                            sex: $scope.eUser.sex,
                            maritalState: $scope.eUser.maritalState,
                            childCount: ($scope.eUser.maritalState == 'single' ? '0' : $scope.eUser.childCount),
                            accountNumber: $scope.eUser.accountNumber,
                            workRecord: $scope.eUser.workRecord,
                            address: $scope.eUser.address,
                            changeAt: Firebase.ServerValue.TIMESTAMP
                        });

                        var input = document.getElementById("inputEditImageEmployee");
                        if (input.value !== '') {
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {

                                userRef.child($scope.eUser.regUser).update({
                                    image: event.target.result
                                });
                                employeeRef.child($scope.eUser.$id).update({
                                    image: event.target.result
                                });
                            };
                            input.value = '';
                        }
                        $scope.msg = 'The information has been saved';
                    }; // Edit Employee Details

                }
            });

            $scope.sortBy = function(propertyName,checkRole) {
                $scope.propertyName = propertyName;
                switch (checkRole){
                    case 'emp':
                        $scope.reverseEmp = (propertyName !== null && $scope.propertyName === propertyName) ? !$scope.reverseEmp : false;
                        $scope.employees = orderBy($scope.employees, $scope.propertyName, $scope.reverseEmp);
                        break;
                    case 'acc':
                        $scope.reverseAcc = (propertyName !== null && $scope.propertyName === propertyName) ? !$scope.reverseAcc : false;
                        $scope.accountants = orderBy($scope.accountants, $scope.propertyName, $scope.reverseAcc);
                        break;
                    case 'exe':
                        $scope.reverseExe = (propertyName !== null && $scope.propertyName === propertyName) ? !$scope.reverseExe : false;
                        $scope.executives = orderBy($scope.executives, $scope.propertyName, $scope.reverseExe);
                        break;
                }
            };


        }]);