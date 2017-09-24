var gnApp = angular.module('gnApp', ['ngRoute', 'ngAnimate', 'firebase' ])
    .constant('FIREBASE_URL','https://geapp.firebaseio.com/')

    .run(['$rootScope', '$location', function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            if (error == 'AUTH_REQUIRED') {

                $location.path('/login');
                swal("Error", "You don't have the access to this page", "error");

            }
        });
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
            //console.log($$route);
            console.log('event : ' + event);
            console.log('current : ' + current);
            console.log('previous : ' + previous);
            console.log(current.$$route.title);

        });
    }])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                title : 'Login',
                templateUrl: 'views/login.html',
                controller: 'RegisterController',
                resolve: {
                    isAuth: function (Authentication) {
                        return Authentication.nowAuth();
                    }
                }
            })
            .when('/reg-employer', {
                title : 'Employer register',
                templateUrl: 'views/register.html',
                controller: 'RegisterController',
                resolve: {
                    isAuth: function (Authentication) {
                        return Authentication.nowAuth();
                    }
                }
            })
            .when('/employer', {
                title : 'Employer Dashboard',
                templateUrl: 'views/employer.html',
                controller: 'EmployerController',
                resolve: {
                    currentAuth: function (Authentication) {
                        return Authentication.requireAuth();
                    }
                }
            })
            .when('/userInfo/:uId', {
                title : 'User Profile',
                templateUrl: 'views/userinfo.html',
                controller: 'UserInfoController',
                resolve: {
                    currentAuth: function (Authentication) {
                        return Authentication.requireAuth();
                    }
                }
            })
            .when('/userManagement/:uId/:pId', {
                title : 'User Management',
                templateUrl: 'views/user-management.html',
                controller: 'UserManagementController',
                resolve: {
                    currentAuth: function (Authentication) {
                        return Authentication.requireAuth();
                    }
                }
            })
            .when('/rollCall/:uId/:pId', {
                title : 'Rollcall',
                templateUrl: 'views/roll-call.html',
                controller: 'RollCallController',
                resolve: {
                    currentAuth: function (Authentication) {
                        return Authentication.requireAuth();
                    }
                }
            })
            .otherwise({
                redirectTo: '/login'
            })
    }]);