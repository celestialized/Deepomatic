myApp.factory('storeService', ['$http', '$q', function($http, $q){

  // Service de gestion des données et appels API 
  /***************** 
   
  format des données:
  {
    imageUrl: string,
    type: string,                      // 'url' ou 'file'
    deepomaticId: integer,             // id pour GET analyse
    deepomaticFetched: false           // statut du GET analyse
    analysisData: [
      {
        name: String,                  // nom du vetement
        xmin: number,                  // coordonnées du cadre pour entourer le vetement
        xmax: number,
        ymin: number,
        ymax: number
      },
      {...},
      ...
    ]
  }

  ******************/

  var settings = {
    headers: {
      'Content-Type': 'application/json',
      'X-APP-ID': 283723326633,
      'X-API-KEY': 'b01a86463f6e4d58978da77b912d7fa5'
    }
  };

  var factory = {
    store: [],
    // envoi API type url
    postUrl: function(url){
      var deferred = $q.defer();
      $http.get('https://api.deepomatic.com/v0.6/detect/fashion/?url=' + url, settings).then(
        function(data){
          factory.store.push({
            imageUrl: url,
            type: 'url',
            deepomaticId: data.data.task_id,
            deepomaticFetched: false
          });
          deferred.resolve(data);
        },
        function(error){
          deferred.reject(error);
        }
      );
      return deferred.promise;
    },
    // envoi API type upload > file format = String, base64
    postFile: function(file){
      var deferred = $q.defer();
      $http.post('https://api.deepomatic.com/v0.6/detect/fashion/', {"base64": file}, settings).then(
        function(data){
          factory.store.push({
            imageFile: file,
            type: 'file',
            deepomaticId: data.data.task_id,
            deepomaticFetched: false
          });
          deferred.resolve(data);
        },
        function(error){
          deferred.reject(error);
        }
      );
      return deferred.promise;
    },
    // GET analyse deepomatic
    fetchAnalysis: function(index){
      
      if(!factory.store[index].deepomaticFetched){
        var deferred = $q.defer();
        $http.get('https://api.deepomatic.com/v0.6/tasks/' + factory.store[index].deepomaticId, settings).then(
          function(data){
            if(data.data.task.status === "success"){
              var data = data.data.task.data.boxes;
              factory.store[index].analysisData = [];
              for (var prop in data) {
                data[prop].forEach(function(item){
                  var newItem = item;
                  item.name = prop;
                  factory.store[index].analysisData.push(newItem);
                });
              }
              factory.store[index].analysisFetched = true;
            }
            deferred.resolve(data);
          },
          function(error){
            deferred.reject(error);
          }
        );
        return deferred.promise;
      }
    }
  };

  return factory;


}]);