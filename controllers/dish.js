const app = angular.module('webApp', []);

app.controller('dishController', function($scope, $http) {
	const url = '/dishes/api/' + location.href.split('/').pop();

	$http.get(url).then((response) => {
		$scope.dishes = response.data;

		$scope.getUser = function() {
			// make server call to get user information
			$http.get('/currentuser').then((response) => {
				const loggedIn = response.data.loggedIn;

				if (loggedIn) {
					$scope.user = response.data.user;
					$scope.loggedIn = true;
					$scope.reviewedDish = $scope.didReviewDish();
				}
			});
		}

		$scope.getAverageRating = function() {
		sum = 0;

		for(let i = 0; i < $scope.dishes.reviews.length; i++) {
			sum += $scope.dishes.reviews[i].rating;
		}

		return Math.floor(sum / $scope.dishes.reviews.length);
	}



		$scope.changeRating = function(rating) {
			$scope.userRating = rating + 1;
		}

		$scope.submitReview = function() {
			const review = {
				'comment': $scope.formData.userComment,
				'rating': $scope.userRating,
			};

			const uri = `/dishes/review/${$scope.dishes._id}/${$scope.user._id}`;

			$http.post(uri, review).then((response) => {
				review.user = $scope.user;
				review.date = new Date();
				$scope.dishes.reviews.push(review);
				$scope.reviewedDish = true;
			});
		}

		$scope.convertDate = function(date) {
			date = new Date(date);
			const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		}

		$scope.didReviewDish = function() {
			if ($scope.user) {
				for(let i = 0; i < $scope.dishes.reviews.length; i++) {
					const review = $scope.dishes.reviews[i];

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

		$scope.removeReview = function(revID) {
			const arg = `/dishes/${revID}`
			for(let i = $scope.dishes.reviews.length - 1; i >= 0; i--) {
				if($scope.dishes.reviews[i]._id === revID) {
					$scope.dishes.reviews.splice(i,1)
				}
			}
			$http.delete(arg).then((response) => {
				console.log(response)
			})
		}

		$scope.loggedIn = false;
		$scope.getUser();
		$scope.reviewedDish = $scope.didReviewDish()
		$scope.formData = {};
		$scope.searchForm = {};
		$scope.userRating = 0;
	});
});
