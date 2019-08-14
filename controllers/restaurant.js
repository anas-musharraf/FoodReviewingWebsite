const app = angular.module('webApp', []);

app.controller('restaurantController', function($scope, $http) {
	const url = '/restaurants/api/' + location.href.split('/').pop();

	$http.get(url).then((response) => {
		$scope.restaurant = response.data;

		$scope.getUser = function() {
			// make server call to get user information
			$http.get('/currentuser').then((response) => {
				const loggedIn = response.data.loggedIn;

				if (loggedIn) {
					$scope.user = response.data.user;
					$scope.loggedIn = true;
					$scope.isFollowing = $scope.user.restaurantsFollowing.indexOf($scope.restaurant._id) != -1;
					$scope.reviewedRestaurant = $scope.didReviewRestaurant();
				}
			});
		}

		$scope.follow = function() {
			const uri = `/restaurants/follow/${$scope.restaurant._id}/${$scope.user._id}`;

			$http.post(uri).then((response) => {
				$scope.isFollowing = true;
				$scope.user.restaurantsFollowing.push($scope.restaurant._id);
				$scope.restaurant.followers.push($scope.user._id);
			}, (error) => {
				console.log(error);
			});
		}

		$scope.unfollow = function() {
			const uri = `/restaurants/follow/${$scope.restaurant._id}/${$scope.user._id}`;

			$http.delete(uri).then((response) => {
				$scope.isFollowing = false;

				let index = $scope.user.restaurantsFollowing.indexOf($scope.restaurant._id);
				$scope.user.restaurantsFollowing.splice(index, 1);

				let index2 = $scope.restaurant.followers.indexOf($scope.user._id);
				$scope.restaurant.followers.splice(index2, 1);
			}, (error) => {
				console.log(error);
			});
		}

		$scope.getAverageRating = function(reviews) {
			sum = 0;

			for(let i = 0; i < reviews.length; i++) {
				sum += reviews[i].rating;
			}

			return reviews.length > 0 ? Math.floor(sum / reviews.length) : 0;
		}

		$scope.getTopDishes = function(n) {
			// get top n dishes
			return $scope.restaurant.dishes.sort((a, b) => {
				if($scope.getAverageRating(a.reviews) > $scope.getAverageRating(b.reviews)) {
					return -1;
				} else if($scope.getAverageRating(a.reviews) < $scope.getAverageRating(b.reviews)) {
					return 1;
				} else {
					return 0;
				}
			}).slice(0, n);
		}

		$scope.changeRating = function(rating) {
			$scope.userRating = rating + 1;
		}

		$scope.submitReview = function() {
			const review = {
				'comment': $scope.formData.userComment,
				'rating': $scope.userRating,
			};

			const uri = `/restaurants/review/${$scope.restaurant._id}/${$scope.user._id}`;

			$http.post(uri, review).then((response) => {
				review.user = $scope.user;
				review.date = new Date();
				$scope.restaurant.reviews.push(review);
				$scope.reviewedRestaurant = true;
			});
		}

		$scope.removeReview = function(revID) {
			const arg = `/restaurants/${revID}`
			for(let i = $scope.restaurant.reviews.length - 1; i >= 0; i--) {
				if($scope.restaurant.reviews[i]._id === revID) {
					$scope.restaurant.reviews.splice(i,1)
				}
			}
			$http.delete(arg).then((response) => {
				console.log(response)
			})
		}

		$scope.convertDate = function(date) {
			date = new Date(date);
			const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		}

		$scope.didReviewRestaurant = function() {
			if ($scope.user) {
				for(let i = 0; i < $scope.restaurant.reviews.length; i++) {
					const review = $scope.restaurant.reviews[i];

					if (review.user._id === $scope.user._id) {
						return true;
					}
				}
			}

			return false;
		}

		$scope.logout = function() {
			$http.get('/logout');
		}

		$scope.search = function () {
			const url = `/?query=${$scope.searchForm.query}`;
			location.href = url;
		}

		$scope.loggedIn = false;
		$scope.getUser();
		$scope.reviewedRestaurant = $scope.didReviewRestaurant()
		$scope.formData = {};
		$scope.searchForm = {};
		$scope.userRating = 0;
	});
});
