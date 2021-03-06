Array.prototype.uniqueJson = function(){
   var res = [];
   var json = {};
   var arr = this;
   var count = 0;
   for(i in arr){
        if(arr[i].topicId!=null){
            for(x in res){
                if(res[x].topicId != null && res[x].topicId == arr[i].topicId){
                    count++;
                }
            }
            if(count<=0){
                res.push(arr[i]);
                count = 0;
            }else{
                count = 0;
            }
        }
   }
   return res;
}
appControllers.controller('refreshAll',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    $scope.refreshAll = function(){
        var addr = window.location.href.toString();
    var id = addr.substring(addr.indexOf("?eventId="), addr.length);
    
        adminService.getEventDetails(id).success(function(data){
            notAdmin(data);
            $rootScope.descInfo = data.descInfo;
        }).error(function(err){
            console.log('error');
        });
    }
}]);
appControllers.controller('commentsDetails',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    console.log('id');
    var addr = window.location.href.toString();
    var id = addr.substring(addr.indexOf("?eventId="), addr.length);
    $scope.displayList = [];
        adminService.getEventDetails(id).success(function(data){
            notAdmin(data);
            $rootScope.descInfo = data.descInfo;
            
        }).error(function(err){
            console.log('error');
        });
    $scope.$watch('descInfo',function(){
        $scope.selector = '选择主讲';
        $scope.change('选择主讲');
        $scope.topicArray = [];
            console.log($rootScope.descInfo.comments);
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].topicId!=null){
                    $scope.topicArray.push({topicId:$rootScope.descInfo.comments[i].topicId,speakerName:$rootScope.descInfo.comments[i].speakerName});
                    // console.log($rootScope.descInfo.comments[i].topicId)
                    if($rootScope.descInfo.comments[i].choosen=='1'){
                        $scope.selectedList.push({"cid":$rootScope.descInfo.comments[i].cid});
                    }else{
                        for(x in $scope.selectedList){
                            if($scope.selectedList[x].cid!=null &&  $rootScope.descInfo.comments[i].cid!=null &&  $scope.selectedList[x].cid == $rootScope.descInfo.comments[i].cid){
                                $scope.selectedList.remove(x);
                            }
                        }
                    }

                    if($rootScope.descInfo.comments[i].choosen!=null && $rootScope.descInfo.comments[i].choosen == '1'){
                        $scope.displayList.push($rootScope.descInfo.comments[i]);
                    }
                }
                
            }
            console.log($scope.topicArray)
            $scope.topicArray = $scope.topicArray.uniqueJson();
            console.log($scope.topicArray)
    })

    $scope.getCommentsById = function(id){
        console.log(id)
        
        console.log($scope.thisComments)
    }
    $scope.selector = '选择主讲';
    $scope.change = function(x){
        console.log(x);
        $scope.thisComments = [];
        if(x!='选择主讲'){
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].topicId!=null && $rootScope.descInfo.comments[i].topicId==x){
                    $scope.thisComments.push($rootScope.descInfo.comments[i]);
                    // console.log($rootScope.descInfo.comments[i].topicId)
                }
                
            }

        }else{
           $scope.thisComments = $rootScope.descInfo.comments; 
        }
    }
    // console.log($scope.selectAll)
    $scope.selectedList = [];
    $scope.addToList = function(a, b){
        if(b){
            $scope.selectedList.push({"cid":a});
            for(i in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[i].cid != null && $rootScope.descInfo.comments[i].cid == a){
                    $rootScope.descInfo.comments[i].choosen = '1';
                    $scope.displayList.push($rootScope.descInfo.comments[i]);
                }
            }
        }else{
            for(i in $scope.selectedList){
                if($scope.selectedList[i].cid!=null && $scope.selectedList[i].cid == a){
                    $scope.selectedList.remove(i);
                }
            }
            for(x in $scope.displayList){
                if($scope.displayList[x].cid != null && $scope.displayList[x].cid == a){
                    $scope.displayList.remove(x)
                }
            }
            for(w in $rootScope.descInfo.comments){
                if($rootScope.descInfo.comments[w].cid != null && $rootScope.descInfo.comments[w].cid == a){
                    console.log($rootScope.descInfo.comments[w].cid == a)
                    $rootScope.descInfo.comments[w].choosen = '0';
                }
            }
        }
        console.log(a+    '      '   +b)
        console.log($scope.selectedList)
        console.log($scope.displayList)
    }
    $scope.removeComments = function(){
        console.log($scope.selectedList)
        if(confirm("确定删除这些留言？")){
            adminService.deleteComment(encodeURIComponent(JSON.stringify($scope.selectedList))).success(function(data){
                notAdmin(data);
                if(data.Message == 'Success'){
                  for(i in $scope.thisComments){
                        for(x in $scope.selectedList){
                           if($scope.thisComments[i].cid!=null && $scope.selectedList[x].cid!=null && $scope.thisComments[i].cid == $scope.selectedList[x].cid){
                                console.log($scope.thisComments[i])
                               $scope.thisComments.remove(i); 
                            } 
                        }
                    }

                    $scope.selectedList = [];
                }
                
            }).error(function(err){
                console.log('error');
            });
        }

    }

    $scope.removeComment = function(id){
        console.log(id);
        var tempA = [];
        if(confirm("确定删除此条留言？")){
            tempA.push({"cid":id});
            console.log(tempA);
            adminService.deleteComment(encodeURIComponent(JSON.stringify(tempA))).success(function(data){
                notAdmin(data);
                if(data.Message == 'Success'){
                  for(i in $scope.thisComments){
                        if($scope.thisComments[i].cid!=null && $scope.thisComments[i].cid == id){
                            console.log($scope.thisComments[i])
                           $scope.thisComments.remove(i); 
                        }
                    }
                    for(i in $rootScope.descInfo.comments){
                        if($rootScope.descInfo.comments[i].cid == id){
                            $rootScope.descInfo.comments.remove(i);
                        }
                    }
                }
                
            }).error(function(err){
                console.log('error');
            });
        }
    }
    $scope.saveQuestion = function(){
        adminService.saveQuestion(encodeURIComponent(JSON.stringify($scope.displayList))).success(function(data){
                notAdmin(data);
                console.log(data);
                
            }).error(function(err){
                console.log('error');
            });
    }
}]);

appControllers.controller('adminCommentsController',['$scope','$timeout','$rootScope','adminService', function($scope,$timeout,$rootScope,adminService){
    $scope.saveAdminComments = function(){
        $scope.adminComments.first.checkbox = 1;
        console.log($scope.adminComments)
    }
    $scope.resetAdminComments = function(){
        $scope.adminComments = null;
    }
    
}]);
