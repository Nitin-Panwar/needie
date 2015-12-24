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
  
          var testdiv = document.getElementById("testdiv");
          var style = "\n"
    
          for (var i=0;i<document.styleSheets.length; i++) {
            //console.log(document.styleSheets[i]);
            var rules = document.styleSheets[i].rules;
            for (var j=0; j<rules.length;j++){
              style += (rules[j].cssText + "\n");
              // console.log(style)
            }
          }
          // svgdiv=$("#visualisation");
          // //$('link[rel=stylesheet]').remove();
          // svgdiv.prepend("\n<style type='text/css'></style>");
          // style="body { background-color: lightblue; }"
          // //style="body { background-color: lightblue; }h1 { color: navy; margin-left: 20px; }"
          // svgdiv.find("style").html("\n<![CDATA[" + style + "]]>\n");

          // console.log("TESTDIV");
          // console.log(testdiv);
          // var svgElements= $(testdiv).find('#bar');
          var svgElements= d3.selectAll('#bar');
        
                
                
                
                
                /* OPTION 2: */
                
          // var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
          // myWindow.document.write(document.body.innerHTML);
          var doc = new jsPDF('p', 'pt', 'a4', false);

          doc.setFontSize(40);
          doc.setDrawColor(0);
          doc.setFillColor(238, 238, 238);
          doc.rect(0, 0, 595.28,  841.89, 'F');
          doc.text(35, 100, "My Report");
          console.log("IMAGE DATA");
          var i=0;
          // console.log(imgData);
                                
                svgElements.each(function () {
                                console.log("working");
                                
                                
                                if(i%2===0 && i!==0){
                                  doc.addPage('a4')
                                  i=0;
                                }
                                i=i+1;
                                
                                var canvas, xml;
                                
                                canvas = document.createElement("canvas");
                                canvas.className = "screenShotTempCanvas";
                                canvas.width=1000;
                                canvas.height=500;
                                
                                // this.prepend("\n<style type='text/css'></style>");
                                // this.find("style").html("\n<![CDATA[" + style + "]]>\n");

                                xml = (new XMLSerializer()).serializeToString(this);
                                // Removing the name space as IE throws an error
                                //xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

                                // var svg1 = svgdiv[0].outerHTML; 
                                 var svg1 = this.outerHTML;
                                // console.log("SVG FINAL");
                                // console.log(svg1);
                                // svg1.prepend("\n<style type='text/css'></style>");
                                // svg1.find("style").html("\n<![CDATA[" + style + "]]>\n");

                                //draw the SVG onto a canvas
                                canvg(canvas, svg1);

                                $(canvas).insertAfter(this);
                                var ctx = canvas.getContext('2d');
         
                                    
                                ctx.msImageSmoothingEnabled = false;
                                ctx.mozImageSmoothingEnabled = false;
                                ctx.imageSmoothingEnabled = false;
                                                                                                                
                                // console.log(" ENTERED FOR WINDOW DOCUMENT Canvas")
                                // console.log(canvas.toString())
                                
                                var myImage = canvas.toDataURL("image/png");
                  
                    // var dataUrl = canvas.toDataURL();
                    // var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
                    // document.body.innerHTML ="<img src=\"" + dataUrl + "\"/>";
                            //myWindow.document.write("<img src=\"" + dataUrl + "\"/>");
                    // var imgData= finalCanvas.toDataURL("image/png");
                                myImage.replace(/^data:image\/(png|jpg);base64,/, "");
                                console.log("calling Pdf function")
                                if(i%2===0){
                                    doc.addImage(myImage, 'png', 100, i*300, 280, 210, undefined, "none");
                                }
                                else{
                                  doc.addImage(myImage, 'png', 100, i*200, 280, 210, undefined, "none");
                                }
                                //test(canvas)
                                // finalCanvas = canvas;
                                //hide the SVG element
                                // this.className = "tempHide";
                                // $(this).hide();
                                
                });
              doc.save( 'MyReport.pdf')
                // console.log("MYWINDOW");
                // console.log(myWindow.document);
                // canvas is the final rendered <canvas> element
                function test(canvas){

                  var ctx = canvas.getContext('2d');
         
                                    
                  ctx.msImageSmoothingEnabled = false;
                  ctx.mozImageSmoothingEnabled = false;
                  ctx.imageSmoothingEnabled = false;
                                                                                                  
                  // console.log(" ENTERED FOR WINDOW DOCUMENT Canvas")
                  // console.log(canvas.toString())
                  
                  var myImage = canvas.toDataURL("image/png");
                  
                  // var dataUrl = canvas.toDataURL();
                  // var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
                  // document.body.innerHTML ="<img src=\"" + dataUrl + "\"/>";
                          //myWindow.document.write("<img src=\"" + dataUrl + "\"/>");
                  // var imgData= finalCanvas.toDataURL("image/png");
                  myImage.replace(/^data:image\/(png|jpg);base64,/, "");
                  console.log("calling Pdf function")
                  createPDFObject(myImage,"jpg base64","jpg","none") 

                }
                                                          
                                                
                                                
                                                
    //             html2canvas(myWindow.document.body, {
    //                  onrendered: function(canvas) {
    //                                             // canvas is the final rendered <canvas> element
                                                          
                                                
    //                                             var ctx = canvas.getContext('2d');
         
                                    
    //                                             ctx.msImageSmoothingEnabled = false;
    //                                             ctx.mozImageSmoothingEnabled = false;
    //                                             ctx.imageSmoothingEnabled = false;
                                                                                                                                
    //                                             // console.log(" ENTERED FOR WINDOW DOCUMENT Canvas")
    //                                             // console.log(canvas.toString())
                                                
    //                                             var myImage = canvas.toDataURL("image/png");
                                                
    //                                             // var dataUrl = canvas.toDataURL();
    //                                             // var myWindow = window.open("", "MsgWindow", "width=1000, height=900");
    //                                             // document.body.innerHTML ="<img src=\"" + dataUrl + "\"/>";
    //                                                     //myWindow.document.write("<img src=\"" + dataUrl + "\"/>");
    //                                             // var imgData= finalCanvas.toDataURL("image/png");
    //                                             myImage.replace(/^data:image\/(png|jpg);base64,/, "");
    //                                             console.log("calling Pdf function")
    //                                             createPDFObject(myImage,"jpg base64","jpg","none") 
                                                
    //     },                     
    //             allowTaint: true,
    //             logging:true
    // });
                $("#testdiv").find('.screenShotTempCanvas').remove();
    $("#testdiv").find('.tempHide').show().removeClass('tempHide');

      
    }
    function appendImageToPdf(imgData, type, format, compress) {

     // var doc = new jsPDF('p', 'pt', 'a4', false);

        doc.addImage(imgData, format, 100, 200, 280, 210, undefined, compress);

     // doc.save( type + '.pdf')
    }
    function createPDFObject(imgData, type, format, compress) {

      var doc = new jsPDF('p', 'pt', 'a4', false);

      doc.setFontSize(40);
      doc.setDrawColor(0);
      doc.setFillColor(238, 238, 238);
      doc.rect(0, 0, 595.28,  841.89, 'F');
      doc.text(35, 100, type);
      console.log("IMAGE DATA");
      console.log(imgData);
      //doc.addImage(imgData, format, 100, 200, 280, 210, undefined, compress);

     // doc.save( type + '.pdf')
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
    
    /**
     * [metricList description]
     * @return {[type]} [description]
     */
    $scope.metricList = function(){
      $scope.getMetricsList();
      $scope.state= true;
      $scope.metricList =true;
      $scope.showmydashboards = false;
      $scope.showfilters = false;

    }  

  });
