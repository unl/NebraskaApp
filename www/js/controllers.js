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

.controller('NewsCtrl', function($scope, $timeout, PersonService, $http, $state) {

  $scope.openInAppBrowser = function()
  {
  //    var link ='';
  //   PersonService.GetFeed().then(function(items){
  //     //console.log(items.data[articleid].title);
  //   var article = items.data[id];
  //  //  console.log(items.data[articleid]);
  //     link = article.link;
   //
  //   })
    var link ='http://news.unl.edu/newsrooms/unltoday/';
    console.log(link);
   // Open in app browser

   window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
  };




  $scope.goHome = function(){
    $state.go('main');
  }

  $scope.items = [];
  $scope.newItems = [];
  $scope.imageLinks =[];
  var final ={};
  var images =[];
  $scope.finalItems = [];
  var count =0;
  PersonService.GetFeed().then(function(items){
    //var  actualObj = items.data;
  //  console.log("hahahahahhah");
    $scope.finalItems = items.data;
    $scope.items = items.data;

    for (var i = 0; i < items.data.length; i++) {
        final = items.data[i];



          //console.log(tLink);
          $scope.items[i].id= i;

      $http.get(items.data[i].link,
                    {transformResponse:function(data) {
                      // convert the data to JSON and provide
                      // it to the success function below
                        // var x2js = new X2JS();

                        // var json = x2js.xml_str2json( data );
                      return data;
                              //  console.log(count);
                                //  console.log($scope.finalItems);
                            //  $scope.finalItems['image']=link;

                              //actualObj["image"] = link;

                      //  return items = json.rss.channel.item;


                        }

                    }

                ).success(function(data, status) {
                  //console.log(count);
                  var indexStart = data.indexOf("<img src=");

                  var res = data.substring(indexStart, indexStart+200);
                    var indexEnd = res.indexOf("width=");
                      var link = res.substring(10, (indexEnd-2));
                      //items.data[i].image = link;
                      $scope.imageLinks.push(link);
                      images.push(link);
                      final.image = link;
                      var hours = items.data[count].pubDate;
                      var teaserText = items.data[count].description;
                      hours = hours.substring(0,(hours.length-15));
//  console.log(teaserText);

                        var pStart = teaserText.indexOf("<p>");
                        var pEnd = teaserText.indexOf("</p>");
                      teaserText = teaserText.substring(pStart+3,pEnd);
                      //  console.log(teaserText);
                        $scope.items[count].time= hours;
                        $scope.items[count].teaserText= teaserText;
                    //  $scope.finalItems.push(final);
                      $scope.finalItems[count].image= link;
                      $scope.items[count].image= link;
                      count=count+1;

                    // send the converted data back
                    // to the callback function
//console.log(images.length);
//$scope.newItems.image = images;
                    //return items = data;

                    //callback(data);
                })


      //console.log(items.data[i].link);
    }

    // console.log(imageLinks.length);
    //
    // for (var i = 0; i < $scope.imageLinks.length; i++) {
    //         console.log($scope.imageLinks[i]);
    // }
// for (var item in items.data) {
//     console.log(item);
// }
  //$scope.newItems = actualObj





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


.controller('ArticleCtrl', function($scope, $stateParams, $scope, PersonService, $http, $ionicHistory, $ionicViewSwitcher, $state) {


  $scope.goBackState = function(){
    $ionicViewSwitcher.nextDirection('back');
    $ionicHistory.goBack();
  }

  $scope.goHome = function(){
    $state.go('main');
  }
  var articleid = $stateParams.id;
 //console.log($stateParams.id);
 var texts = [];
 var article ={};
 PersonService.GetFeed().then(function(items){
   //console.log(items.data[articleid].title);
   article = items.data[articleid];
//  console.log(items.data[articleid]);
   console.log(items.data[articleid].link);

    $http.get(items.data[articleid].link).then(function(response){
    	var content = response.data;

      var indexStart = content.indexOf("<img src=");

      var res = content.substring(indexStart, indexStart+200);
        var indexEnd = res.indexOf("width=");
          var link = res.substring(10, (indexEnd-2));
          console.log(link);

        var indexStart = content.indexOf("<p>");
      //  console.log(indexStart);
        var trimmedContent = content.substring(indexStart,content.length);
      //  console.log(content.length);
          var indexEnd = trimmedContent.indexOf("</div>");
          trimmedContent = trimmedContent.substring(0,indexEnd);
            trimmedContent = trimmedContent.replace(/<p>/g, "");
        trimmedContent = trimmedContent.replace(/<\/p>/g, "HAHAHAHA123");
         texts = trimmedContent.split("HAHAHAHA123");
      //  console.log(texts.length);
        //  console.log(trimmedContent);
          //
        // while (true) {
        //   indexEnd = trimmedContent.indexOf("</p>");
        //   console.log(indexEnd);
        //   if (indexEnd!=null) {
        //     lastIndex = indexEnd;
        //     trimmedContent = trimmedContent.substring(indexEnd,trimmedContent.length);
        //   }
        //
        // }
      //  console.log(lastIndex);
      //console.log(stuff);
      //article.stuff = stuff;

      article.link = link;
      $scope.texts = texts;
      $scope.article = article;
    //  console.log(texts);
    	return content;
    });
    //  for (var i = 0; i < items.data.length; i++) {
    //    console.log(items.data[i].title);
    //  }
 })




})

.controller('DinningCtrl', function($scope, $stateParams, $state) {

  $scope.goHome = function(){
    $state.go('main');
  }

})


.controller('AthleticsCtrl', function($scope, $stateParams, $state) {

  $scope.goHome = function(){
    $state.go('main');
  }

})

.controller('DirectoryCtrl', function($scope, $stateParams, $state) {

  $scope.goHome = function(){
    $state.go('main');
  }

})






.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller("MainCtrl", function($scope, $ionicSlideBoxDelegate) {

  $scope.openInAppBrowserNews = function()
  {
    var link ='http://news.unl.edu/newsrooms/unltoday/';
    console.log(link);
   // Open in app browser
   window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
  };

  $scope.openInAppBrowserDirectory = function()
  {
    var link ='https://directory.unl.edu';
   // Open in app browser
   window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
  };

  $scope.openInAppBrowserEvents = function()
  {
    var link ='https://events.unl.edu';
   // Open in app browser
   window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
  };


$scope.openInAppBrowserCourses = function()
{
  var link ='https://bulletin.unl.edu/undergraduate/courses/search';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};

$scope.openInAppBrowserEmergency = function()
{
  var link ='http://emergency.unl.edu';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};


$scope.openInAppBrowserMaps = function()
{
  var link ='https://maps.unl.edu';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};



$scope.openInAppBrowserAthletics = function()
{
  var link ='http://www.huskers.com';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};

$scope.openInAppBrowserDinning = function()
{
  var link ='http://housing.unl.edu/dining-center-hours';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};

$scope.openInAppBrowserMedia = function()
{
  var link ='https://mediahub.unl.edu/search/';
 // Open in app browser
 window.open(link,'_blank', 'location=yes', 'closebuttoncaption=Return');
};

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
