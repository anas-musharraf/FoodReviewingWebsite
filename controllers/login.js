const app = angular.module('webApp', []);

app.controller('loginController', function($scope, $http) {
	$scope.invalidLogin = false;

	$scope.authenticate = function() {
		$http.post('/login', {email: $scope.email, password: $scope.password})
			.then((response) => {
				const data = response.data;

				if (data.invalidLogin) {
					$scope.invalidLogin = true;
				} else {
					location.href = '/';
				}
			}, (error) => {
				$scope.invalidLogin = true;
			});
	}
});
