angular.module('starter.services', [])

.factory('PersonService', function($http){
	var BASE_URL = "https://news.unl.edu/newsrooms/1/feed/";//http://api.randomuser.me/
	var items = [];//http://gomashup.com/json.php?fds=finance/fortune500/rank/1&jsoncallback=?

//+'?results=10'



	return {
		GetFeed: function(){


      return $http.get(BASE_URL,
                    {transformResponse:function(data) {
                      // convert the data to JSON and provide
                      // it to the success function below
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json( data );
                      //  console.log(json.rss.channel.item);
                        return items = json.rss.channel.item;
                        }
                    }
                ).success(function(data, status) {
                    // send the converted data back
                    // to the callback function
//console.log("HAHAHAHHAH");
                    //return items = data;

                    //callback(data);
                });


			// return $http.get(BASE_URL).success(function(data, status, headers,config){
      //     console.log('data success');
      //     console.log(data); // for browser console
      //     return items = data; // for UI
      //   })
      //   .error(function(data, status, headers,config){
      //     console.log('data error');
      //   })
      //   .then(function(result){
      //     return items = result.data;
      //   });
		},
		GetNewUsers: function(){
			return $http.get(BASE_URL+'?results=2').then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetOldUsers: function(){
			return $http.get(BASE_URL+'?results=10').then(function(response){
				items = response.data.results;
				return items;
			});
		}
	}
})
