const app = angular.module('webApp', []);

app.controller('userProfileController', function($scope, $http) {
    const url = '/users/api/' + location.href.split('/').pop();

    $http.get(url).then((response) => {
		$scope.viewedUser = response.data; // Info of a user being viewed
		console.log($scope.viewedUser.image)
		$scope.getUser = function() { // Info of a user using a webpage
			// make server call to get user information
			$http.get('/currentuser').then((response) => {
				const loggedIn = response.data.loggedIn;

				if (loggedIn) {
					$scope.user = response.data.user;
					$scope.loggedIn = true;
					$scope.isFollowing = $scope.user.following.indexOf($scope.viewedUser._id) != -1;
				}
			});
		}

		$scope.follow = function() {
			const url = `/users/follow/${$scope.viewedUser._id}/${$scope.user._id}`;

			$http.post(url).then((response) => {
				$scope.isFollowing = true;
				$scope.user.following.push($scope.viewedUser._id);
				$scope.viewedUser.followers.push($scope.user._id);
			}, (error) => {
				console.log(error);
			});
		}

		$scope.unfollow = function() {
			const url = `/users/follow/${$scope.viewedUser._id}/${$scope.user._id}`;

			$http.delete(url).then((response) => {
				$scope.isFollowing = false;
				let index = $scope.user.following.indexOf($scope.viewedUser._id);
				$scope.user.following.splice(index, 1);

				let index2 = $scope.viewedUser.followers.indexOf($scope.user._id);
				$scope.viewedUser.followers.splice(index2, 1);
			}, (error) => {
				console.log(error);
			});
		}

		$scope.convertDate = function(date) {
			date = new Date(date);
			const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
		}

		$scope.search = function () {
			const url = `/?query=${$scope.searchForm.query}`;
			location.href = url;
		}

		$scope.logout = function() {
            $http.get('/logout');
        }

        $scope.loggedIn = false;
		$scope.searchForm = {};
		$scope.getUser();
    });
});
