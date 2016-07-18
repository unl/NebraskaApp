angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller("FeedController", function($http, $scope) {

    $scope.init = function() {
        $http.get("http://ajax.googleapis.com/ajax/services/feed/load", { params: { "v": "1.0", "q": "https://www.thepolyglotdeveloper.com/feed/" } })
            .success(function(data) {
                $scope.rssTitle = data.responseData.feed.title;
                $scope.rssUrl = data.responseData.feed.feedUrl;
                $scope.rssSiteUrl = data.responseData.feed.link;
                $scope.entries = data.responseData.feed.entries;
            })
            .error(function(data) {
                console.log("ERROR: " + data);
            });
    }

})

.controller('NewsCtrl', function($scope, $timeout, PersonService, $http) {
  $scope.items = [];
  $scope.newItems = [];
  $scope.imageLinks =[];

  PersonService.GetFeed().then(function(items){

    for (var i = 0; i < items.data.length; i++) {

      console.log(items.data[i].link);
    }
// for (var item in items.data) {
//     console.log(item);
// }


  $http.get('http://news.unl.edu/newsrooms/unltoday/article/cic-becomes-big-ten-academic-alliance/',
                {transformResponse:function(data) {
                  // convert the data to JSON and provide
                  // it to the success function below
                    // var x2js = new X2JS();
                    // var json = x2js.xml_str2json( data );
                    var indexStart = data.indexOf("<img src=");

                    var res = data.substring(indexStart, indexStart+200);
                      var indexEnd = res.indexOf("width=");
                        var link = res.substring(10, (indexEnd-2));

                        var  actualObj = items.data;
                        //  actualObj["image"] = link;

                  //  return items = json.rss.channel.item;
                    }
                }
            ).success(function(data, status) {
                // send the converted data back
                // to the callback function
//console.log("HAHAHAHHAH");
                //return items = data;

                //callback(data);
            })

            	$scope.items = items.data;

  });

  $scope.doRefresh = function() {
		if($scope.newItems.length > 0){
			$scope.items = $scope.newItems.concat($scope.items);

			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');

			$scope.newItems = [];
		} else {
			PersonService.GetNewUsers().then(function(items){
				$scope.items = items.data.concat($scope.items);

				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
  };

  $scope.loadMore = function(){
    PersonService.GetOldUsers().then(function(items) {
      $scope.items = $scope.items.concat(items);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

   var CheckNewItems = function(){
		$timeout(function(){
			PersonService.GetNewUsers().then(function(items){
				$scope.newItems = items.data.concat($scope.newItems);

				CheckNewItems();
			});
		},10000);
   }

  CheckNewItems();
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller("MainCtrl", function($scope, $ionicSlideBoxDelegate) {

    $scope.images = [];

    //console.log('lalalalalallalalala');

   // $scope.images = "http://www.trendingtoplists.com/wp-content/uploads/2015/09/Nebraska_Cornhuskers2.jpg";//TODO
   // $scope.images = "http://www.trendingtoplists.com/wp-content/uploads/2015/09/Nebraska_Cornhuskers2.jpg";


   $scope.images.push("img/2.png");
   $scope.images.push("img/1.png");
   $scope.images.push("img/3.png");
   $scope.images.push("img/4.png");
   $scope.images.push("http://www.trendingtoplists.com/wp-content/uploads/2015/09/Nebraska_Cornhuskers2.jpg");


   $ionicSlideBoxDelegate.update();
   // $ionicSlideBoxDelegate.does-continue(true);


     //setTimeout(function() {
                // $ionicSlideBoxDelegate.slide(0);
                // $ionicSlideBoxDelegate.update();
                // //$ionicSlideBoxDelegate.does-continue(true);
                // $scope.$apply();
                // console.log('lalalalalallalalala');
          //  });



});
