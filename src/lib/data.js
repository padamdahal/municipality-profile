$(document).on('keyup', 'input :not(#search)', function (e) {
    $(this).val(function(index, value) {
        return value
        .replace(/[^0-9.]/g, "")
        ;
    });
});

function htmlIdStringencode(str) {
    var i = str.length,
        aRet = [];

    while (i--) {
        var iC = str[i].charCodeAt();
        aRet[i] = iC;
    }
    return aRet.join('');
}

function searchListByKeyWord() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("indicator-ul");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("span")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
}

function unqiueArrayValue(value, index, self){
    return self.indexOf(value) === index
}

async function ajaxResponse(url, method = 'GET', data={}, successCallback='', errorCallback=''){
    var response = {};
    await $.ajax({
        url:url,
        type: method,
        data:data,
        dataType: 'json',
        success:function(result){
            response = result;
            if(typeof result === 'object' && result !== null){                
                if(result.hasOwnProperty('httpStatusCode')) {
                    response = {};
                }
            }
            if(successCallback){
                successCallback(result);                    
            }
        },
        error:function(err){
            response = {};
            if(errorCallback){
                errorCallback(err);
            }
        }
    });

    return response;
}

async function ajaxPostResponse(url, method, data={}, successCallback='', errorCallback=''){
    var success = false;
    await $.ajax({
        url:url,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        type: method,
        data: JSON.stringify(data),
        success:function(result){
            success = true;
            if(successCallback){
                successCallback(result);                    
            }
        },
        error:function(err){
            console.log(err);
            if(errorCallback){
                errorCallback(err);
                return;
            }
        }
    });
    if(success) {
        return true;
    }else{
        return Promise.reject(false);
    }
}

function serializeHeaderRowsByKey(data, arrIndexKey, arrValueKey){
    var serializeArray = [];
    console.log(data);
    if(typeof(data.rows != 'undefined')){
        if(data.rows.length){
            data.rows.forEach((val) => {
                serializeArray[val[arrIndexKey]] = { value : val[arrValueKey], event : val[0]}; 
            } );
        }
    }
    return serializeArray;

}

function selectedIndicatorView(resp){
    var  indicatorLists = '';
    resp.indicators.forEach(function (data) {
        indicatorLists += 
            '<li> Indicator Selection <input class="indicator-selected" type="checkbox" ' + 
            'data-indicatorname = "' + data.name + '" '+
            'data-indicatorid = "' + data.id + '" '+
            'data-programname = "' + resp.name + '" '+
            'data-method = "post" '+
            'data-event = "" '+
            '>  Public <input class="indicator-public" type="checkbox" ' + 
            '>  ' + 
            data.displayName + 
            '</li>';
    });

    return indicatorLists;
}

function toastMessageError(text){
    toastMessage(text,'#b30c2a');
}

function toastMessage(text, color = 'green') {
    Toastify({
        text: text,
        duration: 3000,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: color ,
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function formBlockUi() {
    $.blockUI({message: $('#loading-popup'), baseZ: 6000});
    // $.blockUI({ message: '<h4><img src="busy.gif" /> Just a moment...</h4>' });
}

function removeBlockUi(){
    $.unblockUI();
    var loader_div = '<div class="loading-popup" id="loading-popup" style="display:none;">\
                    <div class="loader-content-holder">\
                                <div class="loader-circular">\
                                </div>\
                                <div class="loader-mask">\
                                </div>\
                                <div class="loader-mask">\
                                </div>\
                            </div>\
                    </div>';

    $(document).find('#loading-popup').remove();
    $('body').append(loader_div);
}

var data = [];
var program = [];
var programIndicatorGroup = [];
var indicator = [];
var fiscalYear = [];


class DataRepository {
    constructor() {
        this.url = url_config;
        this.baseUrl = baseUrl_config;
        this.bridgeUrl = bridgeUrl_config;
        this.liveUrl = liveUrl_config;
        this.bridgePlainUrl = bridgePlainUrl_config; 
    }

    async getOganizationUnits() {
        var callback = function(resp){
            var organizationUnitLists = '';
            if(typeof(resp.organisationUnits) != 'undefined'){
                resp.organisationUnits.forEach(function (data) {
                    organizationUnitLists += '<option value="' + data.id + '">' + data.name + '</option>';
                });
            }
            $('#organization-unit-select').html(organizationUnitLists);
        } 

        var url = this.baseUrl + 'api/me.json?fields=id,name,displayName,organisationUnits[id, name]';
        var response = await ajaxResponse(url, 'GET', {}, callback);
        return response;        
    }

    getPrograms() {      
        var callback = function(resp){
            var programLists = '<option value="">Select Program</option>';
            if(typeof(resp.indicatorGroups) != 'undefined'){
                resp.indicatorGroups.forEach(function (data) {
                    programLists += '<option value="' + data.id + '">' + data.displayName + '</option>';
                });
            }
            $('#program-select').html(programLists);
        }
        var url = this.baseUrl + 'api/indicatorGroups.json?paging=false';
        return ajaxResponse(url, 'GET', {}, callback);
    }
    
    getFiscalYear() {         
        var callback = function(resp){
            var fiscalYearLists = '';

            if(typeof(resp.items) != 'undefined'){
                resp.items.forEach(function (data) {
                    fiscalYearLists += '<option value="' + data.code + '">' + data.name + '</option>';
                });
            }
            $('#fiscal-year-select').html(fiscalYearLists);
        }
        var endpoint = 'api/categories/EIwENR14wWG.json?fields=items[id,name,code]';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return ajaxResponse(url, 'GET', {}, callback);
    }

    getIndicatorSettingDataByProgram(programId, orgUnit){
        var indicatorUpdateData = [];
        var programIndicatorsData = [];
        var baseUrl = this.baseUrl;
        var obj = this;
        formBlockUi();
        obj.getProgramIndicators(programId, orgUnit).then( function(programIndicatorsResponse)
        {
            obj.getIndicatorSelectedData(programId, orgUnit).then( function(indicatorUpdateResponse) {                
                if(indicatorUpdateResponse.hasOwnProperty('rows')){
                    if(indicatorUpdateResponse.rows.length){
                        indicatorUpdateResponse.rows.forEach((val) => {
                            indicatorUpdateData[val[18]]= { selected : val[20] , public : val[17], eventId : val[0] };
                        } );
                    }
                }

                if(typeof(programIndicatorsResponse.indicators != 'undefined')){
                    if(programIndicatorsResponse.indicators.length){
                        programIndicatorsResponse.indicators.forEach((object) => {
                            object.isData = false;
                            object.isPublic = false;
                            object.method = 'post';
                            object.eventId = '';
                            if( typeof(indicatorUpdateData[object.id]) != 'undefined'){
                                if(indicatorUpdateData[object.id]['selected']){
                                    object.isData = true;
                                }
                                if(indicatorUpdateData[object.id]['public']){
                                    object.isPublic= true;
                                }
                                object.method = 'put';
                                object.eventId = indicatorUpdateData[object.id]['eventId'];
                            }
                        });

                        var indicatorLists = '<div class="card">' +
                            '<div class="text-center py-3">' +
                                '<h6>' + 
                                    $('#program-select option:selected').text()
                                +'</h6>' +
                            '</div>' +
                            '<div class="card-body">' +
                            '<div class="row">' +
                                '<table class="table bg-light">' +
                                    '<thead> <tr>' + 
                                    '<th>Indicator Name</th>' + 
                                    '<th>Indicator Selection</th>' + 
                                    '<th>Indicator For Public</th> </tr></thead><tbody>' ;

                        if(programId){
                            programIndicatorsResponse.indicators.forEach(function (data) {
                                var checked = (data.isData) ? 'checked' : '';
                                var publicChecked = (data.isPublic) ? 'checked' : '';
                                indicatorLists += '<tr>' +
                                '<td>' +data.displayName+ '</td>' +
                                '<td style="width:15%"> <input class=" indicator-selected" type="checkbox" ' + 
                                'data-indicatorname = "' + data.name + '" '+
                                'data-indicatorid = "' + data.id + '" '+
                                'data-programname = "' + programIndicatorsResponse.name + '" '+
                                'data-method = "' + data.method + '" '+
                                'data-event = "' + data.eventId + '" '+
                                checked +'></td>' +
                                '<td style="width:15%"> <input class="indicator-public" type="checkbox" ' + 
                                publicChecked +'></td>' +
                                '</tr>';
                            });                                
                        }
                        indicatorLists += '</tbody></table></div></div><div class="form-control"><button class="button btn btn-sm btn-success" id="save">Update</button></div></div>';
                        $('#indicator-div').html(indicatorLists);
                    }
                }
            }); 
        }).catch((err) => {
            removeBlockUi();
        })
        .finally(() => {
            removeBlockUi();
        });
    }

    async saveIndicatorData(orgUnit, programId, indicatorName, indicatorId, programName, selected, isPublic, method, event) {
        var date = new Date; 
        var data = {
            'program' : 'rCUMf9NmSYR',
            'orgUnit' : orgUnit,
            // 'eventDate': date.getFullYear() + '' + date.getMonth() + '' + date.getDate(),
            'eventDate': '2022-11-11',
            'status' : 'COMPLETED',
            dataValues: [
                {dataElement : 'bLzw0ztPCoR', value : indicatorName},
                {dataElement : 'TUaGfBWVU24', value : indicatorId},
                {dataElement : 'iCLT9qVWlQB', value : programName},
                {dataElement : 'QS2SEEPBSKW', value : selected},
                {dataElement : 'baQV30DLA6K', value : isPublic},
                {dataElement : 'aKlNuarfnWv', value : programId},
            ]
        };

        formBlockUi();
        var successCallback = function(resp) {
            removeBlockUi();
        }

        var errorCallback = function(res){
            removeBlockUi();
            toastMessageError('Error occured on indicator ' + indicatorName); 
        } 
            
        var url = this.bridgeUrl + 'api/events';
        if(method == 'put'){
            url = this.bridgeUrl + 'api/events/' + event;
        }

        var response =  await ajaxPostResponse(url, method, data, successCallback, errorCallback);
        
        if(response) {
            return true;
        }else{
            return Promise.reject(false);
        }
    }

    async saveIndicatorFiscalYearData(orgUnit, programId, indicatorName, indicatorId, programName, fiscalYear, value, method, event) {
        var date = new Date; 
        var data = {
            'program' : 'SlesGRHx6wN',
            'orgUnit' : orgUnit,
            'eventDate': '2022-11-11',
            'status' : 'COMPLETED',
            dataValues: [
                {dataElement : 'bLzw0ztPCoR', value : indicatorName},
                {dataElement : 'TUaGfBWVU24', value : indicatorId},
                {dataElement : 'j3zNqRWgIfv', value : fiscalYear},
                {dataElement : 'lMvQhESA7y7', value : value},
                {dataElement : 'aKlNuarfnWv', value : programId},
                {dataElement : 'iCLT9qVWlQB', value : programName}
            ]
        };
        
        formBlockUi();
        var successCallback = function(resp) {
            removeBlockUi();
        }

        var errorCallback = function(res){
            removeBlockUi();
            toastMessageError('Error occured on indicator ' + indicatorName); 
        } 
        
        var url = this.bridgeUrl + 'api/events';
        if(method == 'put'){
            url = this.bridgeUrl + 'api/events/' + event;
        }

        var response = await ajaxPostResponse(url, method, data, successCallback, errorCallback);
        
        if(response) {
            return true;
        }else{
            return Promise.reject(false);
        }
    }

    getIndicatorFiscalYearSettingData(programId, orgUnit, fiscalYear){
        var indicatorMasterData = [];
        var indicatorPostData = [];
        var indicatorUpdatedata = [];
        var indicatorsString = '';

        var baseUrl = this.baseUrl;
        
        var obj = this;
        formBlockUi();
        
        obj.getProgramIndicators(programId, orgUnit).then( function(programIndicatorsResponse)
        {
            programIndicatorsResponse.indicators.forEach(function (data) {
                indicatorsString += data.id + ';';
            });
                        
            obj.getIndicatorSelectedData(programId, orgUnit).then( function(indicatorUpdateResponse) 
            {
                indicatorUpdatedata = serializeHeaderRowsByKey(indicatorUpdateResponse, 18, 20);
                
                obj.getIndicatorMasterData(programId, orgUnit, fiscalYear, indicatorsString).then(function(masterDataResp)
                {   
                    indicatorMasterData = serializeHeaderRowsByKey(masterDataResp, 0, 2);
                    
                    obj.getIndicatorPostData(programId, orgUnit, fiscalYear).then(function(postDataResp){
                        indicatorPostData = serializeHeaderRowsByKey(postDataResp, 19, 18);
                        
                        if(typeof(programIndicatorsResponse.indicators != 'undefined')){
                            if(programIndicatorsResponse.indicators.length){
                                programIndicatorsResponse.indicators.forEach((object) => {
                                    object.isData = false;
                                    object.postData = '';
                                    object.masterData = '';
                                    object.event = '';
                                    object.method = 'post';

                                    if( typeof(indicatorUpdatedata[object.id]) != 'undefined'){
                                        if(indicatorUpdatedata[object.id]['value']){
                                            object.isData = true;
                                        }
                                    }
                                    if( typeof(indicatorMasterData[object.id]) != 'undefined'){
                                        object.masterData = indicatorMasterData[object.id]['value'];
                                    }
                                    
                                    if( typeof(indicatorPostData[object.id]) != 'undefined'){
                                        object.postData = indicatorPostData[object.id]['value'];
                                        object.event = indicatorPostData[object.id]['event'];
                                        object.method = 'put';
                                    }
                                })  
                                
                                var indicatorLists = '<p style="color:red"> No any indicator checked for data update yet </p>';

                                if(programId){
                                    indicatorLists = '<div class="card">' +
                                                '<div class="text-center py-3">' +
                                                    '<h6>' + 
                                                        $('#program-select option:selected').text()
                                                    +'</h6>' +
                                                '</div>' +
                                                '<div class="card-body">' +
                                                '<div class="row">' +
                                                '<div class="form-control"><button class="button btn btn-sm btn-success" id="masterCopy">Copy Master Data </button></div>' +
                                                '<table class="table bg-light">' +  
                                                    '<thead> <tr>' + 
                                                    '<th>Indicator Name</th>' + 
                                                    '<th>New Data</th>' + 
                                                    '<th>Master Data</th> </tr></thead><tbody>' ;
                                                    
                                    programIndicatorsResponse.indicators.forEach(function (data) {
                                        if(data.isData){                                           
                                
                                            // var valueData = data.postData ?  data.postData : data.masterData;
                                            var valueData = data.postData ;
                                            indicatorLists += '<tr>' +
                                            '<td>' +data.displayName+ '</td>' +
                                            '<td style="width:15%"> <input type="text" class="indicator-data-value"' +
                                            'data-indicatorid="' + data.id + '"' + 
                                            'data-indicatorname="' + data.name + '"'  + 
                                            'data-event="' + data.event + '"'  + 
                                            'data-method="' + data.method + '"'  + 
                                            'value="' + valueData + '"' +
                                            'class="form-control" name="' + data.id + '"></td>' +
                                            '<td style="width:15%"> <input type="text" readonly value="' + data.masterData + '" class="form-control master-data-value"></td>' +
                                            '</tr>';
                                        }
                                    });                                        
                                    indicatorLists += '</tbody></table></div></div><div class="form-control"><button class="button btn btn-sm btn-success" id="save">Update</button></div></div>';
                                }
                                $('#indicator-data-div').html(indicatorLists);
                            }
                        }
                        removeBlockUi();
                    })            
                });
            });        
        }).catch((err) => {
            removeBlockUi();
        })
        .finally(() => {
            removeBlockUi();
        });        
    }

    async getIndicatorMasterData(programId, orgUnit, fiscalYear, indicatorString){
        var url = this.liveUrl +
        encodeURIComponent('api/analytics.json?dimension=dx:' + indicatorString + 
        '&dimension=pe:' + fiscalYear +
        '&filter=ou:' + orgUnit + 
        '&displayProperty=NAME&outputIdScheme=CODE');
        
        var response = await ajaxResponse(url);
        return response;
    }   
    
    async getIndicatorPostData(programId, orgUnit, fiscalYear){
        var url = this.bridgeUrl +
        encodeURIComponent('api/events/query.json?orgUnit=' + orgUnit
        +'&programStage=pa0utdLAwZS&filter=j3zNqRWgIfv:like:' + fiscalYear 
        + '&dataElement=bLzw0ztPCoR,iCLT9qVWlQB,TUaGfBWVU24,lMvQhESA7y7,j3zNqRWgIfv&order=lastUpdated:desc&pageSize=50&page=1&totalPages=true');

        var response = await ajaxResponse(url);
        return response;
    }   
    
    async getIndicatorSelectedData(programId, orgUnit){
        var url = this.bridgeUrl +
        encodeURIComponent('api/events/query.json?orgUnit=' + orgUnit
        + '&programStage=bkAobe7ok7F&filter=aKlNuarfnWv:like:' + programId + 
        '&dataElement=bLzw0ztPCoR,TUaGfBWVU24,iCLT9qVWlQB,baQV30DLA6K,QS2SEEPBSKW&order=lastUpdated:desc');      
    
        return await ajaxResponse(url);
    }   
    
    async getProgramIndicators(programId, orgUnit){
        var url = this.baseUrl + 'api/indicatorGroups/' + programId + '.json?fields=id,name,indicators[id,name,displayName]&paging=false';

        return await ajaxResponse(url);
    }
    
    setAllIndicartorData(programId, orgUnit){
        var baseUrl = this.baseUrl;
        var obj = this;
        var indicatorsString = '';

        formBlockUi();
        obj.getProgramIndicators(programId, orgUnit).then( function(programIndicatorsResponse)
        {
            var search = `<input style="width:100% !important" type="text" id="search" onkeyup="searchListByKeyWord()" placeholder="Search for indicators.."><br>`;
            $('#indicator-ul').append(search);

            var list = '';
            programIndicatorsResponse.indicators.forEach(function (data) {
                indicatorsString += data.id + ';';
                list += `<li><input class="indicator-checkbox"
                type="checkbox" 
                data-text="${data.name}"
                value="${data.id}"> 
                   <span> ${data.name}</span>
                   <hr style="margin:0px">
                </li>`;   
            })

            obj.getIndicatorMonitoringData(orgUnit, indicatorsString).then( function(indicatorMonitoringResponse){
                var indexOfIndicator = 0;
                var indexOfIndicatorCode = 0;
                var indexOfYear = 1;
                var indexOfValue = 2;

                indicatorMonitoringResponse.rows.forEach(function(val) {
                    var chartDataKey = val[indexOfIndicatorCode].toLowerCase()
                        .trim()
                        .replace(/ /g,"-");
                    
                    chartDataKey = htmlIdStringencode(chartDataKey);
                    
                    var fiscalYearText = val[indexOfYear].split(' ')[1];
                    fiscalYearText += '/' + (parseInt(fiscalYearText.slice(-2)) + 1);

                    if( !monitoringChartData.hasOwnProperty(chartDataKey)){
                        monitoringChartData[chartDataKey] = [] ;
                        monitoringChartData[chartDataKey].push({year : fiscalYearText, value : parseFloat(val[indexOfValue])});
                    }else{
                        monitoringChartData[chartDataKey].push({year : fiscalYearText, value : parseFloat(val[indexOfValue])});
                    }
                })

                setTimeout(() => {
                    $('#indicator-ul').append(list);
                    $('.indicator-checkbox').click(function(){
                        // var chartDiv = $(this).val();
                        var chartDivLabel = $(this).data('text');
                        var chartDiv = chartDivLabel.toLowerCase()
                            .trim().replace(/ /g,"-");

                        chartDiv = htmlIdStringencode(chartDiv);

                        if($(this).is(':checked')){    
                            $('#indicator-chart-div').append( '<div class="col-lg-12" id="'+ chartDiv +'"></div>');
                            $('#'+chartDiv).height('400px');
                            $('#'+chartDiv).css("margin-bottom","100px");
                            var chartData = monitoringChartData[chartDiv];
                            am4core.ready(function () {
        
                                am4core.useTheme(am4themes_animated);
                                var chart = am4core.create(chartDiv, am4charts.XYChart)
                                chart.exporting.menu = new am4core.ExportMenu();
                                chart.exporting.menu.align = "right";
                                chart.exporting.menu.verticalAlign = "top";
                                chart.numberFormatter.numberFormat = "#.###";

                                chart.colors.list = [
                                    am4core.color("#558cc0"), //blue
                                    am4core.color("#a9be3b"), //green
                                    am4core.color("orange"), //orange
                                    am4core.color("#c93250"), //red
                                    am4core.color("purple"), // light blue
                                    am4core.color("#c9deea")
                                ];  
        
                                var label = chart.createChild(am4core.Label);
                                label.text = chartDivLabel;
                                label.fontSize = 15;
                                label.align = "center";
                                label.fill = "#558cc0";
                                chart.data = chartData;
                        
                                /* Create axes */
                                var theXAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                                theXAxis.dataFields.category = "year";
                                theXAxis.renderer.minGridDistance = 30;
                        
                        
                                /* Create value axis */
                                var theYAxis = chart.yAxes.push(new am4charts.ValueAxis());
                                theYAxis.renderer.labels.template.disabled = false;
                        
                                /* Create series */
                                var series1 = chart.series.push(new am4charts.LineSeries());
                                series1.dataFields.valueY = "value";
                                series1.dataFields.categoryX = "year";
                                series1.bullets.push(new am4charts.CircleBullet());
                                series1.tooltipText = "{year} : {value}";
                                series1.fill = "#2c3e96";
                                series1.fillOpacity = .3;
                                series1.stroke = "#4967fa";
                                chart.cursor = new am4charts.XYCursor();
                            }); 
                            
                        }else{
                            if($(document).find('#'+chartDiv).length){
                                $(document).find('#'+chartDiv).remove();
                            }
                        }
                    
                    })
                }, 100);                   
            })
        }).catch((err) => {
            removeBlockUi();
        })
        .finally(() => {
            removeBlockUi();
        });
    }

    setIndicatorChart(chartDiv, chartData){
        am4core.ready(function () {

            am4core.useTheme(am4themes_animated);
            var chart = am4core.create(chartDiv, am4charts.XYChart)
            
            chart.colors.list = [
                am4core.color("#558cc0"), //blue
                am4core.color("#a9be3b"), //green
                am4core.color("orange"), //orange
                am4core.color("#c93250"), //red
                am4core.color("purple"), // light blue
                am4core.color("#c9deea")
            ];                

            chart.data = chartData;

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "year";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 0;
            // categoryAxis.renderer.labels.template.horizontalCenter = "right";
            // categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.renderer.labels.template.rotation = 0;
            categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.labels.template.maxWidth = 200;
            categoryAxis.tooltip.disabled = true;
            categoryAxis.renderer.minHeight = 110;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.minWidth = 50;

            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.sequencedInterpolation = true;
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "year";
            series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
            series.columns.template.strokeWidth = 0;

            series.tooltip.pointerOrientation = "vertical";

            series.columns.template.column.cornerRadiusTopLeft = 10;
            series.columns.template.column.cornerRadiusTopRight = 10;
            series.columns.template.column.fillOpacity = 0.8;

            // on hover, make corner radiuses bigger
            var hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.cornerRadiusTopLeft = 0;
            hoverState.properties.cornerRadiusTopRight = 0;
            hoverState.properties.fillOpacity = 1;

            series.columns.template.adapter.add("fill", function(fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
            });

            // Cursor
            chart.cursor = new am4charts.XYCursor();
        }); 
    }

    async getAllIndicatorData(orgUnit){
        var endpoint = 'api/analytics/events/query/SlesGRHx6wN.json?dimension=pe:2022&dimension=ou:' + orgUnit +
        '&dimension=bLzw0ztPCoR&dimension=TUaGfBWVU24&dimension=iCLT9qVWlQB&dimension=aKlNuarfnWv&dimension=j3zNqRWgIfv&dimension=lMvQhESA7y7&stage=pa0utdLAwZS&displayProperty=NAME&outputType=EVENT&desc=eventdate&pageSize=100&page=1&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }

    async getIndicatorMonitoringData(orgUnit, indicatorString){
        var endpoint = 'api/analytics.json?dimension=dx:' + indicatorString + '&dimension=pe:THIS_FINANCIAL_YEAR;LAST_5_FINANCIAL_YEARS&filter=ou:' 
        + orgUnit + '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.liveUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }
}

class demographicRepository {
    constructor() {
        this.url = url_config;
        this.baseUrl = baseUrl_config;
        this.bridgeUrl = bridgeUrl_config;
        this.liveUrl = liveUrl_config;
        this.bridgePlainUrl = bridgePlainUrl_config;        
    }
}

