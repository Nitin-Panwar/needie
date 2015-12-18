'use strict';

angular.module('sasaWebApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, $stateParams, dashBoardsFactory, usersFactory, $http, messageCenterService, parentService, dialogs) {
  	// $http.get("http://10.223.12.51:8099/getUser",{withCredentials:true}).success(function (response) {        
   //        $rootScope.user=response;        
   //      });     
    
    $rootScope.placeholder={metric: [], textBoxes: [], dashboard: {}, edited: false}; 

    /**
  	 * Here system checks if there is an existing dashboard that user wants to see
  	 * @param  {[type]} $stateParams.dashboardId [description]
  	 * @return {[type]}                          [description]
  	 */    
    if($stateParams.dashboardId){
      // $scope.newDashboard = false;
      //Making API call to get dashboard data
      $rootScope.myPromise = dashBoardsFactory.show({dashboardId:$stateParams.dashboardId, filters:{}}).$promise.then(function (data) {         
        $rootScope.placeholder.dashboard = data;   
        // update filters on front end
        $rootScope.globalQuery = $rootScope.placeholder.dashboard.filters;      

        //Add data to placeholder
        for(var i=0;i<data['components'].length;i++)
        {
          if(data['components'][i]['type']=='metric'){
            $rootScope.placeholder.metric.push(data['components'][i]);
          }
          if(data['components'][i]['type']=='textBox'){
            $rootScope.placeholder.textBoxes.push(data['components'][i]);
          }
        }        
        messageCenterService.add('success','Dashboard loaded successfully',{timeout: 10000});
      }, function (err) {
        messageCenterService.add('danger','Could not load dashboard',{timeout: 10000});
      });
    }

    /**
     * Print Dashboard to document
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    $scope.save2document = function (argument) {
        // document.open();
        // document.write("<h1>Hello World</h1>");
        // document.close();
        
       console.log(document.body)
        var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
        myWindow.document.write(document.documentElement.innerHTML);
        console.log(myWindow.document.body)

      //selecting network div and appending svg to it.
      // var width = 900;
      // var height = 1150;
      // var newWindow=window.open("", "MsgWindow", "location=1,status=1,scrollbars=1, width="+width+", height="+height);
      // newWindow.moveTo(1300, 150);
      // var yourDOCTYPE = "<!DOCTYPE html...";

      // var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
      // myWindow.document.write(document.getElementsByTagName('html')[0]);

      // var printPreview = window.open('about:blank', 'print_preview');
      // var printDocument = newWindow.document;
      // printDocument.open();
      // console.log(document.documentElement.innerHTML)
      // newWindow.innerHTML = document.documentElement.innerHTML
      // console.log(newWindow.document)
      // console.log(newWindow.document.body)
      // console.log(newWindow.innerHTML)
      // printDocument.document.body.appendChild(document.body)
      // (document.documentElement.innerHTML
      // printDocument.write(document.getElementsByTagName('html')[0]);

      // printDocument.write(yourDOCTYPE+
      //            "<html>"+
      //                document.documentElement.innerHTML+
      //            "</html>");
      // console.log(newWindow.document.getElementById('body'))
      // console.log(document.body)
      html2canvas($(myWindow.document.body),{
         onrendered:function(canvas){
            myWindow.document.body.appendChild(canvas);
         }
      });

      // var svgElements = d3.select(newWindow.document.body);
      // console.log(svgElements)
      // newWindow.document.body.innerHTML = d3.select("body").innerHTML;
      // var pageD3=d3.select(newWindow.document.body)
      // var svg = pageD3.append("div")
      //          .attr("class","test")
      // .attr('width', width)
      // .attr('height', height)

      // var finalCanvas = document.createElement("canvas");
      // finalCanvas.className = "screenShotTempfinalCanvas";
      //   finalCanvas.width=1000;
      //   finalCanvas.height=500;


    //   svgElements.each(function () {
    //     var canvas, xml;
    
    //     canvas = document.createElement("canvas");
    //     canvas.className = "screenShotTempCanvas";
    //     canvas.width=1000;
    //     canvas.height=500;
        
    //     xml = (new XMLSerializer()).serializeToString(this);
    //     // console.log(xml)
    //     // Removing the name space as IE throws an error
    //     // xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

    //     //draw the SVG onto a canvas
    //     canvg(canvas, xml);
    // //     // console.log(canvas)
    // //     // d3.select("finalCanvas").append("canvas");
    //     $(canvas).insertAfter(newWindow.document.body);
    // //     // console.log(finalCanvas);
    //     // finalCanvas = canvas;
    //     //hide the SVG element
        
    //     // d3.select(this).attr("className","tempHide");
    //     // console.log(this);
    //     // $(this).hide();
        
    //   });
    //   // console.log(finalCanvas);
    //   // var myImage = finalCanvas.toDataURL("image/png");
      
  
  

    //   html2canvas($(newWindow.document.body), {
    //    onrendered: function(canvas) {
    //    // canvas is the final rendered <canvas> element
    //    var ctx = canvas.getContext('2d');
    //    ctx.msImageSmoothingEnabled = false;
    //    ctx.mozImageSmoothingEnabled = false;
    //    ctx.imageSmoothingEnabled = false;
            
    //   // console.log("Canvas")
    //   // console.log(canvas.toString())
    //   var myImage = canvas.toDataURL("image/png");
      
    //   var dataUrl = canvas.toDataURL();
    //   var myWindow = window.open("", "MsgWindow2", "width=1000, height=900");
    //       myWindow.document.write("<img src=\"" + dataUrl + "\"/>");
      
    //     },    
    // allowTaint: true,
    // logging:true
    // });
    
    //  // $("body").find('.screenShotTempCanvas').remove();
    //  // $("body").find('.tempHide').show().removeClass('tempHide');
    //   // console.log(svgElements);
    //   // svgElements.each(function () {

    //   //   var canvas, xml;
        
    //   //   canvas = pageD3.append("canvas")
    //   //             .attr("className","screenShotTempCanvas")
    //   //             .attr("width",1000)
    //   //             .attr("height",500);
    //   //   // canvas.className = "screenShotTempCanvas";
    //   //   // canvas.width=1000;
    //   //   // canvas.height=500;
        
    //   //   xml = (new XMLSerializer()).serializeToString(this);
    //   //   // Removing the name space as IE throws an error
    //   //   //xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

    //   //   //draw the SVG onto a canvas
    //   //   canvg(canvas, xml);
    //   //   $(canvas).insertAfter(newWindow.document.body);
    //   //   // finalCanvas = canvas;
    //   //   //hide the SVG element
    //   //   // this.className = "tempHide";
    //   //   // $(this).hide();
        
    //   // });

      // var code = document.getElementById('dashboard').innerHTML;
      // console.info(code);
    }

    /**
     * This function adds text boxes in placeholder
     */    
    $scope.addTextBox = function () {
      var obj = {
          size: { x: 1, y: 8 },          
          text: null,
          type:'textBox'
        };
      $rootScope.placeholder.textBoxes.push(obj);      
      $rootScope.placeholder.edited = true;
    };

    /**
     * this function removes text boxes
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    $scope.removeTextBox = function (item) {
      $rootScope.placeholder.textBoxes.splice($rootScope.placeholder.textBoxes.indexOf(item), 1);
      $rootScope.placeholder.edited = true;
    };

    /**
     * this function saves the dashboard
     * @return {[type]} [description]
     */ 
    $scope.launchSave = function () {      
      var dlg = dialogs.create('app/dashboard/dashboard_save_dialog.html','DashboardSaveCtrl', $rootScope.placeholder.dashboard,'sm');              
        dlg.result.then(function(data){
          console.info(data);
        });  
    }  

    /**
     * this function sets a dashboard as homepage
     */
    $scope.setHomepage = function () {
      usersFactory.setHomepage({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as homepage',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as homepage', {timeout: 10000});
      })
    } 

    /**
     * Set a dashboard as favorite
     */
    $scope.setFavorite = function () {
      usersFactory.save({idsid: $rootScope.user, dashboardId: $rootScope.placeholder.dashboard._id}).$promise.then(function (data) {
        messageCenterService.add('success','Dashboard set as favorite',{timeout: 3000});
      },function (err) {
        messageCenterService.add('danger','Could not set dashboard as favorite',{timeout: 10000});
      });
    }

    /**
     *Below it watches for any changes in movement of metrics on the dashboard and resize
     *
     */
    $scope.gridsterDashboardOpts = {
      resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         start: function(event, $element, widget) {}, // optional callback fired when resize is started,
         resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished resizing
      },
      draggable: {
         enabled: true, // whether dragging items is supported
         handle: '.mover-handle', // optional selector for resize handle
         start: function(event, $element, widget) {}, // optional callback fired when drag is started,
         drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
         stop: function(event, $element, widget) {$rootScope.placeholder.edited = true;} // optional callback fired when item is finished dragging
      }
    };    

  });
