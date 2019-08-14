const app = angular.module('webApp', []);

app.controller('adminController', function($scope, $http) {

	$scope.getUser = function() {
		// make server call to get user information
		$http.get('/currentuser').then((response) => {
			const loggedIn = response.data.loggedIn;

			if (loggedIn) {
				$scope.user = response.data.user;
				$scope.loggedIn = true;
			}
		});
	}

	$scope.getAllUsers = function() {
		// server call goes here
		$http.get('/admin/users').then((response) => {
			$scope.allUsers = response.data;
		});
	}

	$scope.getAllRestaurants = function() {
		// server call goes here
		$http.get('/admin/restaurants').then((response) => {
			$scope.allRestaurants = response.data;
		});
	}

	$scope.removeUser = function(userID) {
		const arg = `/admin/users/${userID}`
		for(let i = 0; i < $scope.allUsers.length; i++) {
			if(userID === $scope.allUsers[i]._id){
				$scope.allUsers.splice(i,1)
			}
		}
		$http.delete(arg).then((response) => {
			$scope.allUsers = response.data;
		})
	}

	$scope.removeRestaurant = function(restID) {
		const arg = `/admin/restaurants/${restID}`
		let restaurants = $scope.allRestaurants;
		for(let i = 0; i < restaurants.length; i++) {
			if(restID === $scope.allRestaurants[i]._id) {
				$scope.allRestaurants.splice(i,1)
			}
		}
		$http.delete(arg).then((response) => {
			$scope.allRestaurants = response.data;
		})
	}

	$scope.search = function () {
		const url = `/?query=${$scope.searchForm.query}`;
		location.href = url;
	}

	$scope.getUser();
	$scope.users = $scope.getAllUsers();
	$scope.searchForm = {};
	$scope.restaurants = $scope.getAllRestaurants();
});
