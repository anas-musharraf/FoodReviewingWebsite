const app = angular.module('webApp', []);

app.controller('searchController', function($scope, $http) {
	$scope.getRestaurants = function() {
		if ($scope.form.query) {
			const url_restaurants = `/restaurants/search/${$scope.form.query}`;
			const url_dishes = `/dishes/search/${$scope.form.query}`;
			$http.get(url_restaurants).then((response) => {
				$scope.restaurantResults = response.data;
			});

			$http.get(url_dishes).then((response) => {
				$scope.dishResults = response.data;
			});
		}
	}

	$scope.getAverageRating = function(reviews) {
		sum = 0;

		for(let i = 0; i < reviews.length; i++) {
			sum += reviews[i].rating;
		}

		return Math.floor(sum / reviews.length);
	}

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

	const params = new URLSearchParams(window.location.search);
	$scope.loggedIn = false;
	$scope.getUser();
	$scope.form = {query: params.get('query')};
	$scope.dishResults = [];
	$scope.restaurantResults = [];
	$scope.getRestaurants();
});
