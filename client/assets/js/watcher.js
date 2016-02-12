/************************
* 
*                  Developer: NSwamy1
*                  Simple Custom watcher to watch on Dom element Height/Width properties for all Visualization chart and also for non angular applications.
*                  Dependency: D3
*                  Status: Developement completed, under Testing phase, 
*                  Code Standards: This soltion is based on Prototypical + Publish-Subscribe + singleton design pattern.
*                  
*                  Usage Example:
*                        //d3.watcher() will be a global object
*                   var watcher_ = d3.watcher();
*
*                    To Add event listener to Dom element 'graph' on 'width' property.
*                     var watcherId = watcher_.Subscribe('graph','width',function(){
*                           chart.zoomOut();
*                         });
*
                   /* whenever View is not active
                            Case 1: if Dom Exists, but Hidden - Explicitly Unsubscribe by passing the watcher Object.
                            Case 2: when dom doesnt Exists, then Watcher will handle internally, It will skip to process.
*                            
*                    To unSubscribe :
*                         watcher_.unSubscribe(watcherId);
*
*                     To change call back method:
*                         watcher_.Subscribe('graph','width',function(){
*                           //New Callback method;
*                         });                    
 * 
 * *********************/


(function(){  
  'use strict';

  var watcherObject = null;
      d3 = d3 || {};
  d3.watcher = function()
  {    
    

    function eleObject(containerId,property,callBack,ID){
      this.containerId = containerId;
      this.property = property;
      this.callBack = callBack;
      this.ID = ID;
      this.previousValue = null;
    };

    eleObject.prototype.execute = function(){
      this.callBack();
    }
    eleObject.prototype.resetCallBack = function(_){
      if(typeof _ != 'function') return;
      this.callBack =  _;
    };
    eleObject.prototype.resetContainerId = function(_){
      this.containerId =  _;
    };
    eleObject.prototype.resetProperty = function(_){
      this.property =  _;
    };
    eleObject.prototype.previousValue = function(_){
      this.previousValue =  _;
    };


    function watcher(frequency) {
      this.items = [];
      this.frequency = frequency?frequency:500;
      var that = this;

      this.timeOut = setInterval(function(){

        that.items.forEach(function(d,i){
          var div = document.getElementById(d.containerId);
          if(div === null){
              that.items = that.items.splice(i,1);

            return;
          }
          if(div[d.property] != d.previousValue){
            setTimeout(function(){d.execute()},0);
            d.previousValue = div[d.property];
          }
        });
      },this.frequency);
      
    };

    watcher.prototype.destroy = function(){
        if (this.timeOut) {
            window.clearInterval(this.timeOut);
            this.timeOut = null;
            this.items = [];
        }else{
          console.log('Watcher Not Running');
        }
    };
    watcher.prototype.Subscribe = function(containerId,property,callBack) {

        if((document.getElementById(containerId) === null) || (typeof callBack != 'function') || (arguments.length <3))
          return;

        var map = {'width':'offsetWidth','height':'offsetHeight'};
            property = map[property];
        var o = new eleObject(containerId,property,callBack,'ID_'+containerId+'_'+property+'_');
        var index = this.check(o);
        if(index === -1){
          this.items.push(o);
        }
        else{
          this.items[index].resetCallBack(callBack);
        }

      return {watcher_:this,Object_:o};
    };
    watcher.prototype.check = function(o){
      var index = -1;

          this.items.every(function(d,i){
            if(o.ID === d.ID){
              index = i;
              return false;
            }
            else{
              return true;
            }
          });
          return index;
    };
    watcher.prototype.unSubscribe = function(obj) {
      var index;
      
          this.items.forEach(function(d,i){
            if(obj.Object_.ID === d.ID){
              index = i;
            }
          });
          if((index == undefined)||(index >= this.items.length)){
            return;
          }
          this.items.splice(index,1);
          
      return this;
    };

    /*
         Singleton Object
    */
    if(watcherObject === null){
      watcherObject = new watcher;
      return watcherObject;
    }
    else{
      return watcherObject;
    }
  };
})()
