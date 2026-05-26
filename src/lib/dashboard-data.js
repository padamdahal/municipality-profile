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

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');
    if (indexOfSpace === -1) {
        return '';
    }
    return str.substring(indexOfSpace + 1);
}

function unqiueArrayValue(value, index, self){
    return self.indexOf(value) === index
}

function GetParameterValues(param) {  
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');  
    for (var i = 0; i < url.length; i++) {  
        var urlparam = url[i].split('=');  
        if (urlparam[0] == param) {  
            return urlparam[1];  
        }  
    }  
}  

var mymap = null;

class DataRepository {
    constructor() {
        this.url = url_config;
        this.baseUrl = baseUrl_config;
        this.bridgeUrl = bridgeUrl_config;
        this.liveUrl = liveUrl_config;
    }

    setKeyDemographicChart(orgUnit, fiscalYear){
        var data = [];
        this.getKeyDemographicData(orgUnit, fiscalYear).then(function(response){
            $('#key-demographic-div').html('');
            response.rows.forEach(function(val) {
                var content = `<li class="d-flex border-bottom border-1 align-items-center"> <h4> ${val[0].replace('DHP-', '')}</h4><p> ${parseInt(val[2])}</p><span>${val[1]}</span></li>`;
                $('#key-demographic-div').append(content);                
            })
            $('#key-demographic-div').closest('.box-body').addClass('loaded');
        })
    }
    
    setHealthFacilityChart(orgUnit, fiscalYear){
        var data = [];
        this.getHealthFacilityData(orgUnit, fiscalYear).then(function(response){
            $('#health-facility-div').html('');
            response.rows.forEach(function(val) {
                var content = `<li class="d-flex border-bottom border-1 align-items-center"> <h4> ${val[0].replace('DHP-Facility Type-', '')}</h4><p> ${parseInt(val[2])}</p><span>${val[1]}</span></li>`;
                $('#health-facility-div').append(content);                
            })
            $('#health-facility-div').closest('.box-body').addClass('loaded');
        })
    }
    
    setWardWiseHealthFacilityChart(orgUnit, fiscalYear){
        var data = [];
        var healthFacility = [];
        var ward = [];
        this.getWardWiseHealthFacilityData(orgUnit, fiscalYear).then(function(response){
            $('#ward-health-facility-div').html('');            
            var content = '';

            response.rows.forEach(function(val) {
                healthFacility.push(val[0]);
                ward.push(val[1]);
                data[val[0] + '-' + val[1]] = val[2];
            })

            healthFacility = healthFacility.filter(unqiueArrayValue).sort();
            ward = ward.filter(unqiueArrayValue).sort();
            console.log(healthFacility);

            content += `<thead>
                <th>Health Facility/Ward</th>`;

            ward.forEach(function(w){
                content += `<th>${removeFirstWord(removeFirstWord(w))}</th>`;
            })

            content += `</thead><tbody>`;
            
            healthFacility.forEach(function(health, index){
                content += `<tr>
                    <td> ${health.replace('DHP-Facility Type-', '')} </td>`;

                ward.forEach(function(w){
                    content += `<td>${ typeof data[health + '-' + w] != 'undefined' ? parseInt(data[health + '-' + w]) : '-'}</td>`;
                })

                content += `</tr>`;            
            })
            content += `</tbody>`;            
            $('#ward-health-facility-div').closest('.box-body').addClass('loaded');
            $('#ward-health-facility-div').append(content);
        })
    }
    
    setMunicipalityInfo(orgUnit, fiscalYear){
        var data = [];
        this.getMunicipalityInfoData(orgUnit, fiscalYear).then(function(response){
            $('#municipality-info').html('');
            response.rows.forEach(function(val) {
                var content = val[3];
                $('#municipality-info').append(content);                
            })
            $('#municipality-info').closest('.box-body').addClass('loaded');
        })
    }
    
    setMap(orgUnit, fiscalYear){
        var data = [];
        var obj = this;
        var co = [27.9044, 85.1531];
        
        if(orgUnit == 'hHrDGEWVf6J'){
            co = [27.9131, 84.9089];
        }
        
        this.getMapData(orgUnit, fiscalYear).then(function(response){     
            if( mymap != null) {
                mymap.remove();
            }

            if(response.length){
                co = response[0].co;
                co = co.split(',');
                co = [co[1].replace(']', ''), co[0].replace('[', '')];
            }
            mymap =  new L.map('map').setView(co, 11);
            
            response.forEach(function(val) {
                var data_co = val.co;
                data_co = data_co.split(',');
                var marker_co = [data_co[1].replace(']', ''), data_co[0].replace('[', '')];
                L.marker(marker_co).bindPopup(val.na).addTo(mymap);                
            })
           
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);        
            
            
            var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 13
            });

            obj.getMapBoundryData(orgUnit).then(function(response){
                var boundry_co = response[0].co;
                boundry_co = JSON.parse("[" + boundry_co + "]")[0][0];
                console.log(boundry_co);
                var states = [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": boundry_co
                    }
                }];
                
                L.geoJSON(states, {
                    style: function(feature) {
                        return {color: "#ff0000"}
                    }
                }).addTo(mymap);
            })            
        })
    }

    populationByGenderKeys(){
        return [
            'DHP-Population-75 and above',
            'DHP-Population-70 to 74 Years' ,
            'DHP-Population-65 to 69 Years' ,
            'DHP-Population-60 to 64 Years' ,
            'DHP-Population-55 to 59 Years' ,
            'DHP-Population-50 to 54 Years' ,
            'DHP-Population-45 to 49 Years' ,
            'DHP-Population-40 to 44 Years' ,
            'DHP-Population-35 to 39 Years' ,
            'DHP-Population-30 to 34 Years' ,
            'DHP-Population-25 to 29 Years' ,
            'DHP-Population-20 to 24 Years' ,
            'DHP-Population-15 to 19 Years' ,
            'DHP-Population-10 to 14 Years' ,
            'DHP-Population-5 to 9 Years' ,
            'DHP-Population-0 to 4 Years' 
        ]
    }
    
    setPopulationByGenderChart(orgUnit, fiscalYear){
        var data = [];
        var gender = [];
        var age = this.populationByGenderKeys();

        this.getPopulationByGenderData(orgUnit, fiscalYear).then(function(response){
            response.rows.forEach(function(val) {
                data[val[0] + '-' + val[1]]= val;  
                gender.push(val[1]);  
            })

            $('#populationByGender').closest('.box-body').addClass('loaded');
    
            am4core.ready(function () {
                am4core.useTheme(am4themes_animated);
                var chart = am4core.create("populationByGender", am4charts.XYChart);
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";
                chart.colors.list = [
                    am4core.color("#558cc0"), //blue
                    am4core.color("#a9be3b"), //green
                    am4core.color("orange"), //orange
                    am4core.color("#c93250"), //red
                    am4core.color("black"), // light blue
                    am4core.color("#c9deea")
                ];
                var chartData = [];
                age.forEach(function(ageVal){
                    var dataObject = { "age" : ageVal.replace('DHP-Population-', ''), "male" : -0, "female" : 0 };
                    var male = 'FVRBa3Bj5Cx';
                    var femal = 'YgXbPg8EkUW';
                    gender.forEach(function(genderval){
                        if( typeof data[ageVal + '-' + genderval] != 'undefined'){  
                            var key = genderval == "FVRBa3Bj5Cx" ? 'male' : 'female';
                            dataObject[key] = (key == 'male') ? -Math.abs(parseInt(data[ageVal + '-' + genderval][4])) : parseInt(data[ageVal + '-' + genderval][4]);
                        }
                    })
                    chartData.push(dataObject);
                })
                chart.data = chartData;
                // Use only absolute numbers
                chart.numberFormatter.numberFormat = "#.#s";
                
                // Create axes
                var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "age";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.inversed = true;
                categoryAxis.dataFields.value = "age";
                
                var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.extraMin = 0.1;
                valueAxis.extraMax = 0.1;
                valueAxis.renderer.minGridDistance = 40;
                valueAxis.renderer.ticks.template.length = 5;
                valueAxis.renderer.ticks.template.disabled = false;
                valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
                valueAxis.renderer.labels.template.adapter.add("text", function (text) {
                    return text == "Male" || text == "Female" ? text : text ;
                })
                
                // Create series
                var male = chart.series.push(new am4charts.ColumnSeries());
                male.dataFields.valueX = "male";
                male.dataFields.categoryY = "age";
                male.clustered = false;

                var maleLabel = male.bullets.push(new am4charts.LabelBullet());
                maleLabel.label.text = "{valueX}";
                maleLabel.label.hideOversized = false;
                maleLabel.label.truncate = false;
                maleLabel.label.horizontalCenter = "right";
                maleLabel.label.dx = -10;
                
                var female = chart.series.push(new am4charts.ColumnSeries());
                female.dataFields.valueX = "female";
                female.dataFields.categoryY = "age";
                female.clustered = false;
                
                var femaleLabel = female.bullets.push(new am4charts.LabelBullet());
                femaleLabel.label.text = "{valueX}";
                femaleLabel.label.hideOversized = false;
                femaleLabel.label.truncate = false;
                femaleLabel.label.horizontalCenter = "left";
                femaleLabel.label.dx = 10;

                var maleRange = valueAxis.axisRanges.create();
                maleRange.value = -4000;
                maleRange.endValue = 0;
                maleRange.label.text = "Male";
                maleRange.label.fill = chart.colors.list[0];
                maleRange.label.dy = 20;
                maleRange.label.fontWeight = '600';
                maleRange.grid.strokeOpacity = 1;
                maleRange.grid.stroke = male.stroke;
                
                var femaleRange = valueAxis.axisRanges.create();
                femaleRange.value = 0;
                femaleRange.endValue = 4000;
                femaleRange.label.text = "Female";
                femaleRange.label.fill = chart.colors.list[1];
                femaleRange.label.dy = 20;
                femaleRange.label.fontWeight = '600';
                femaleRange.grid.strokeOpacity = 1;
                femaleRange.grid.stroke = female.stroke;
                
            }); 
        })
    }

    securityChartKeys(){
        return {
            'senior' : 'DHP-Social Security-Senior Citizen\'s Allowance - Dalit',
            'disabled' : 'DHP-Social Security-Severly Disabled Grant',
            'caste' : 'DHP-Social Security-Senior Citizen\'s Allowance - Other Caste',
            'allowance' : 'DHP-Social Security-Widow Allowance',
            'disability' : 'Social Security-Full Disability Grant',
            'child' : 'DHP-Social Security-Child Protection - Dalit',
        }
    }

    setSecurityChart(orgUnit, fiscalYear){
        var data = [];
        var fiscalYear = [];
        var indexOfFiscalYear = 1;
        var chartData = [];
        var securityChartKeys = this.securityChartKeys();

        this.getSecurityData(orgUnit, fiscalYear).then(function(response){
            $('#socialbenificers').closest('.box-body').addClass('loaded');
            response.rows.forEach(function(val) {
                chartData.push({ country : val[0].replace('DHP-', ''), visits : parseInt(val[2])});
            })
            
            console.log('response.rows');
            console.log(response.rows);
            console.log(chartData);
            am4core.ready(function () {

                am4core.useTheme(am4themes_animated);
                var chart = am4core.create('socialbenificers', am4charts.XYChart)
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";
                
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
                categoryAxis.dataFields.category = "country";
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
                series.dataFields.valueY = "visits";
                series.dataFields.categoryX = "country";
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
             
        })
    }

    setPopulationByCasteChart(orgUnit, fiscalYear){
        var data = [];
        var chartData = [];
        this.getPopulationByCasteData(orgUnit, fiscalYear).then(function(response){
            $('#castewise').closest('.box-body').addClass('loaded');
            response.rows.forEach(function(val) {
                chartData.push({ value : parseInt(val[3]), category : val[0].replace('DHP-Population-', '')});  
            })
    
            am4core.ready(function () {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                var chart = am4core.create("castewise", am4charts.PieChart3D);
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";
    
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
                chart.data = chartData;
    
                var series = chart.series.push(new am4charts.PieSeries3D());
                series.dataFields.value = "value";
                // series.dataFields.radiusValue = "value";
                series.dataFields.category = "country";
                // series.slices.template.cornerRadius = 6;
                // series.colors.step = 6;
                series.colors.list = [
                    am4core.color("#558cc0"), //blue
                    am4core.color("#a9be3b"), //green
                    am4core.color("orange"), //orange
                    am4core.color("#c93250"), //red
                    am4core.color("yellow"), // light blue
                    am4core.color("#c9deea")
                ];
                // series.template.tooltipText = "[bold]{category}[/]: [font-size:14px]{value}";
                series.tooltip.autoTextColor = false;
                series.tooltip.label.fill = am4core.color("#FFFFFF");
                series.hiddenState.properties.endAngle = -90;
    
                chart.legend = new am4charts.Legend();
            })
        })
    }
    
    setInsuranceChart(orgUnit, fiscalYear){
        var data = [];
        var chartData = [];
        this.getInsuranceData(orgUnit, fiscalYear).then(function(response){
            $('#insures').closest('.box-body').addClass('loaded');
            response.rows.forEach(function(val) {
                if(val[0] == 'DHP-Total Insurees.Female'){
                    chartData.push({ value : parseInt(val[3]), category : 'Female' });  
                }
                
                if(val[0] == 'DHP-Total Insurees.Male'){
                    chartData.push({ value : parseInt(val[3]), category : 'Male' });  
                }

                if(val[0] == 'DHP-Total Insured Households.default'){
                    $("#insureHousehold-data").html(parseInt(val[3]));
                }

                
            })
    
            am4core.ready(function () {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                var chart = am4core.create("insures", am4charts.PieChart3D);
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";
                
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
                chart.data = chartData;
    
                var series = chart.series.push(new am4charts.PieSeries3D());
                series.dataFields.value = "value";
                series.dataFields.radiusValue = "value";
                series.dataFields.category = "country";
                series.slices.template.cornerRadius = 6;
                // series.colors.step = 6;
                chart.innerRadius = am4core.percent(40);
                series.colors.list = [
                    am4core.color("#558cc0"), //blue
                    am4core.color("#a9be3b"), //green
                    am4core.color("orange"), //orange
                    am4core.color("#c93250"), //red
                    // am4core.color("black"), // light blue
                    am4core.color("#c9deea")
                ];
                // series.template.tooltipText = "[bold]{category}[/]: [font-size:14px]{value}";
                series.tooltip.autoTextColor = false;
                series.tooltip.label.fill = am4core.color("#FFFFFF");
                series.hiddenState.properties.endAngle = -90;
    
                chart.legend = new am4charts.Legend();
            })
        })
    }

    setDiseaseChart(orgUnit, fiscalYear){
        var data = [];
        var chartData = [];
        var chartDataByPercentage = [];
        var totalPopulation = 0;
        var percentage = 0;
        this.getDiseaseData(orgUnit, fiscalYear).then(function(response){
            $('#topdisease').closest('.box-body').addClass('loaded');
            $('#topdiseasePercentage').closest('.box-body').addClass('loaded');

            response.rows.forEach(function(arr, index){
                if(arr[0] == 'Total population'){
                    totalPopulation = arr[2]
                    return false
                }
            })

            response.rows.forEach(function(arr, index){
                if(index < 11){ 
                    if(arr[0] != 'Total population'){                   
                        chartData.push({'indicator_name' : arr[0], 'indicator_data' : arr[2]});
                        if(totalPopulation != '0'){
                            percentage = ((arr[2] / totalPopulation ) * 100)
                        }
                        chartDataByPercentage.push({'indicator_name' : arr[0], 'indicator_data' : percentage});
                    }
                }
            })
        
            am4core.ready(function () {
                am4core.useTheme(am4themes_animated);
                
                var chart = am4core.create("topdiseasePercentage", am4charts.XYChart);
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";
                chart.padding(40, 40, 40, 40);
                
                var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "indicator_name";
                categoryAxis.renderer.minGridDistance = 1;
                categoryAxis.renderer.inversed = true;
                categoryAxis.renderer.grid.template.disabled = true;

                var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;

                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryY = "indicator_name";
                series.dataFields.valueX = "indicator_data";
                series.tooltipText = "{valueX.value}"
                series.columns.template.strokeOpacity = 0;
                series.columns.template.column.cornerRadiusBottomRight = 5;
                series.columns.template.column.cornerRadiusTopRight = 5;

                var labelBullet = series.bullets.push(new am4charts.LabelBullet())
                labelBullet.label.horizontalCenter = "left";
                labelBullet.label.dx = 10;
                labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
                labelBullet.locationX = 1;

                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                series.columns.template.adapter.add("fill", function (fill, target) {
                    return chart.colors.getIndex(target.dataItem.index);
                });

                categoryAxis.sortBySeries = series;
                chart.data = chartDataByPercentage; 
            });

            am4core.ready(function () {
                am4core.useTheme(am4themes_animated);
                
                var chart2 = am4core.create("topdisease", am4charts.XYChart);
                chart2.exporting.menu = new am4core.ExportMenu();
                chart2.exporting.menu.align = "right";
                chart2.exporting.menu.verticalAlign = "top";
                chart2.padding(40, 40, 40, 40);
                
                var categoryAxis = chart2.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "indicator_name";
                categoryAxis.renderer.minGridDistance = 1;
                categoryAxis.renderer.inversed = true;
                categoryAxis.renderer.grid.template.disabled = true;

                var valueAxis = chart2.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;

                var series = chart2.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryY = "indicator_name";
                series.dataFields.valueX = "indicator_data";
                series.tooltipText = "{valueX.value}"
                series.columns.template.strokeOpacity = 0;
                series.columns.template.column.cornerRadiusBottomRight = 5;
                series.columns.template.column.cornerRadiusTopRight = 5;

                var labelBullet = series.bullets.push(new am4charts.LabelBullet())
                labelBullet.label.horizontalCenter = "left";
                labelBullet.label.dx = 10;
                labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
                labelBullet.locationX = 1;

                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart2.colors color set
                series.columns.template.adapter.add("fill", function (fill, target) {
                    return chart2.colors.getIndex(target.dataItem.index);
                });

                categoryAxis.sortBySeries = series;
                chart2.data = chartData; 
            });
            
        })
    }
    
    setPopulationByWardChart(orgUnit, fiscalYear){
        var data = [];
        var gender = [];
        var ward = [];
        
        this.getPopulationByWardData(orgUnit, fiscalYear).then(function(response){
            $('#chartgenderward').closest('.box-body').addClass('loaded');

            response.rows.forEach(function(val) {
                data[val[3] + '-' + val[1]]= val;  
                gender.push(val[1]);  
                ward.push(val[3]);  
            })

            am4core.ready(function () {
                am4core.useTheme(am4themes_animated);
                var chart = am4core.create("chartgenderward", am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
                chart.exporting.menu = new am4core.ExportMenu();
                chart.exporting.menu.align = "right";
                chart.exporting.menu.verticalAlign = "top";

                var chartData = [];
                ward.filter(unqiueArrayValue).sort().forEach(function(wardVal){
                    var dataObject = { "category" : removeFirstWord(removeFirstWord(wardVal)), "male" : 0, "female" : 0 };
                    var male = 'FVRBa3Bj5Cx';
                    var femal = 'YgXbPg8EkUW';
                    gender.forEach(function(genderval){
                        if( typeof data[wardVal + '-' + genderval] != 'undefined'){  
                            var key = genderval == "FVRBa3Bj5Cx" ? 'male' : 'female';
                            dataObject[key] = parseInt(data[wardVal + '-' + genderval][4]);
                        }
                    })
                    chartData.push(dataObject);
                })
                chart.data = chartData;

                chart.marginRight = 400;
                chart.colors.list = [
                    am4core.color("#558cc0"), //blue
                    am4core.color("#a9be3b"), //green
                    am4core.color("orange"), //orange
                    am4core.color("#c93250"), //red
                    am4core.color("black"), // light blue
                    am4core.color("#c9deea")
                ];

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            // categoryAxis.title.text = "Local country offices";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;


            var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "Population";

            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "male";
            series.dataFields.categoryX = "category";
            series.name = "Male";
            series.tooltipText = "{name}: [bold]{valueY}[/]";
            series.stacked = true;

            var series2 = chart.series.push(new am4charts.ColumnSeries());
            series2.dataFields.valueY = "female";
            series2.dataFields.categoryX = "category";
            series2.name = "Female";
            series2.tooltipText = "{name}: [bold]{valueY}[/]";
            series2.stacked = true;

            chart.cursor = new am4charts.XYCursor();
            chart.legend = new am4charts.Legend();
            }); 
        });     
    }   
    
    setIndicatorChart(orgUnit, fiscalYear){
        var data = [];
        var program = {};
        var indicator = [];
        var fiscalYear = [];

        var indexOfProgram = 10;
        var indexOfIndicator = 8;
        var indexOfYear = 12;
        var indexOfValue = 13;
        
        this.getIndicatorData(orgUnit, fiscalYear).then(function(response){
            $('#indicator-div').closest('.box-body').addClass('loaded');
            
            response.rows.forEach(function(val) {
                data[val[indexOfProgram] + '-' + val[indexOfIndicator] + '-' + val[indexOfYear]]= val;  
                
                if( !program.hasOwnProperty(val[indexOfProgram])){
                    program[val[indexOfProgram]] = [] ;
                    program[val[indexOfProgram]].push(val[indexOfIndicator]);
                }else{
                    program[val[indexOfProgram]].push(val[indexOfIndicator]);
                }

                program[val[indexOfProgram]] = program[val[indexOfProgram]].filter(unqiueArrayValue);

                fiscalYear.push(val[indexOfYear]);
            })

            fiscalYear = fiscalYear.filter(unqiueArrayValue).sort();
            
            var programKeys = Object.keys(program);

            var fiscalYearTemplate = '';
            fiscalYear.forEach ((year) => {
                var fiscalYearText = parseInt(year);
                fiscalYearText += '/' + (parseInt(parseInt(year).toString().slice(-2)) + 1);
                fiscalYearTemplate += `<th class="text-center"><span>${fiscalYearText}</span></th>`;
            })
            
            var indicatorTemplate = `<table class="table">
            <thead>
                <tr>
                    <th rowspan="2">Indicators</th>
                    ${fiscalYearTemplate}
                </tr>
            </thead>`;
            $('#indicator-div').html(indicatorTemplate);
            
            programKeys.forEach((programKey, index) => {
                indicatorTemplate += `<tbody class="bg-color-${index}">
                <tr>
                    <th scope="row" colspan="7">${programKey}</th>
                </tr>`;

                program[programKey].forEach( (indicator, index) => {
                    indicatorTemplate += `<tr class="table-chart-${index}">
                    <td>${indicator}</td>`;

                    fiscalYear.forEach( (year) => {
                        var value = (typeof data[programKey + '-' + indicator + '-' + year] != 'undefined') ? 
                            data[programKey + '-' + indicator + '-' + year][indexOfValue] : '-' ;

                        indicatorTemplate += `<td class="text-center">${value}</td>`;
                    })

                    indicatorTemplate += `</tr>`;
                })

                indicatorTemplate += `</tbody>`;
            })

            indicatorTemplate += `</table>`;
             
            $('#indicator-div').html(indicatorTemplate);
        });     
    }   
    
    async getIndicatorTrendlinePrograms() {      
        // var url = this.baseUrl + 'api/indicatorGroups.json?paging=false';
        var url = indicatorJsonPath_config ;
        // var url = "http://localhost/dip/api/indicator.json"
        return await ajaxResponse(url);
    }

    async getIndicatorTrendlineProgramIndicators(programId, orgUnit){
        var url = this.baseUrl + 'api/indicatorGroups/' + programId + '.json?fields=id,name,indicators[id,name,displayName]&paging=false';
        // var url = "http://localhost/dip/api/indicatorlists.php"
        return await ajaxResponse(url);
    }

    generateIndicatorTrendlineChart(indicatorId, chartData){
        var  chartDiv = `trendline-chart-div-${indicatorId}`;
        var  chartPlotDiv = `trendline-chart-plot-div-${indicatorId}`;
        if($(document).find('#'+chartPlotDiv).length){
            $(document).find('#'+chartPlotDiv).remove();
        }

            $('#'+chartDiv).append( '<div class="col-lg-12" id="'+ chartPlotDiv +'"></div>');
            $('#'+chartDiv).height('300px');
            //$('#'+chartDiv).css("margin-bottom","100px");
            
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
                label.text = '';
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
    }

    async getIndicatorTrendlineProgramIndicatorData(orgUnit, indicatorString){
        var endpoint = 'api/analytics.json?dimension=dx:' + indicatorString + '&dimension=pe:THIS_FINANCIAL_YEAR;LAST_5_FINANCIAL_YEARS&filter=ou:' 
        + orgUnit + '&displayProperty=NAME&outputIdScheme=UID';
        var url = this.liveUrl + endpoint; //encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/indicatorData.php"

        return await ajaxResponse(url);
    }

    setIndicatorTrendlineChart(orgUnit, fiscalYear){
        var obj = this;
        monitoringChartData = []
        var selectedIndicator = ''
        this.getIndicatorTrendlinePrograms().then(function(resp){
            $('#indicator-trendline').html('');
            if(typeof(resp.indicatorGroups) != 'undefined'){
                resp.indicatorGroups.forEach(function (data) {
                    var selectedIndicator = data.defaultIndicator;
                    var programId = data.id;
                    var template = ''
                    var trendlineSelectDiv = `trendline-select-div-${data.id}`;
                    var programLists = '';
                    var select = `<div class="row">
                                    <div class="col-md-9 col-lg-9 offset-md-1 offset-lg-1">
                                    <select id="trendline-select-div-${data.id}" class="custom-select">
                                    </select> 
                                    </div>
                                </div>`;

                    obj.getIndicatorTrendlineProgramIndicators(data.id, orgUnit).then( function(programIndicatorsResponse)
                    {   
                        if(typeof(programIndicatorsResponse.indicators) != 'undefined'){
                            programIndicatorsResponse.indicators.forEach(function (data) {
                                programLists += '<option value="' + data.id + '">' + data.displayName + '</option>';
                            });
                        }
                        template += `<div class="col-lg-6 mb-3">
                        <div class="box shadow bg-white">
                            <div class="h-header p-2 border-bottom text-custom-primary fw-bold fs-6">
                                <i class="bi-bar-chart-fill"></i> ${data.displayName}
                            </div>
                            ${select}
                            <div class="box-body" id="trendline-chart-div-${data.id}">                                
                            </div>
                        </div>
                        </div>`;
                        console.log(programLists)
                        console.log('programLists')
                        $('#indicator-trendline').append(template).find("#"+trendlineSelectDiv).html(programLists);
                        $('.custom-select').select2({width : '100%'});
                        
                        var indicatorsString = '';
                        programIndicatorsResponse.indicators.forEach(function (data) {
                            indicatorsString += data.id + ';';
                        });
                        console.log(indicatorsString);

                        obj.getIndicatorTrendlineProgramIndicatorData(orgUnit, indicatorsString).then( function(indicatorMonitoringResponse){
                            var indexOfIndicator = 0;
                            var indexOfIndicatorCode = 0;
                            var indexOfYear = 1;
                            var indexOfValue = 2;
            
                            indicatorMonitoringResponse.rows.forEach(function(val) {
                                var chartDataKey = val[indexOfIndicatorCode];
                                
                                var fiscalYearText = parseInt(val[indexOfYear]);
                                fiscalYearText += '/' + (parseInt(fiscalYearText) + 1);
            
                                if( !monitoringChartData.hasOwnProperty(chartDataKey)){
                                    monitoringChartData[chartDataKey] = [] ;
                                    monitoringChartData[chartDataKey].push({year : fiscalYearText, value : parseFloat(val[indexOfValue])});
                                }else{
                                    monitoringChartData[chartDataKey].push({year : fiscalYearText, value : parseFloat(val[indexOfValue])});
                                }
                            })
                            
                            var indicatorId = $('#trendline-select-div-'+programId).val();
                            //obj.generateIndicatorTrendlineChart(programId, selectedIndicator);
                            
                            $('#trendline-select-div-'+programId).change(function(){
                                console.log('ad')
                                console.log(monitoringChartData[$(this).val()])
                                obj.generateIndicatorTrendlineChart(programId, monitoringChartData[$(this).val()]);
                            })

                            $('#trendline-select-div-'+programId).val(selectedIndicator).trigger('change');
                            $('#trendline-chart-div-'+programId).closest('.box-body').addClass('loaded');

                        });
                    });                   
                });

                        
                        // console.log('programIndicatorsResponse')
                        // console.log(programIndicatorsResponse)
                        
                        // $('#'+trendlineDiv).html(programLists);
                        // console.log(trendlineDiv)
                        // console.log(template)
                
            }
        });
        var data = [];
        var program = {};
        var indicator = [];
        var fiscalYear = [];

        var indexOfProgram = 10;
        var indexOfIndicator = 8;
        var indexOfYear = 12;
        var indexOfValue = 13;
        
        // this.getIndicatorData(orgUnit, fiscalYear).then(function(response){
        //     $('#indicator-div').closest('.box-body').addClass('loaded');
            
        //     response.rows.forEach(function(val) {
        //         data[val[indexOfProgram] + '-' + val[indexOfIndicator] + '-' + val[indexOfYear]]= val;  
                
        //         if( !program.hasOwnProperty(val[indexOfProgram])){
        //             program[val[indexOfProgram]] = [] ;
        //             program[val[indexOfProgram]].push(val[indexOfIndicator]);
        //         }else{
        //             program[val[indexOfProgram]].push(val[indexOfIndicator]);
        //         }

        //         program[val[indexOfProgram]] = program[val[indexOfProgram]].filter(unqiueArrayValue);

        //         fiscalYear.push(val[indexOfYear]);
        //     })

        //     fiscalYear = fiscalYear.filter(unqiueArrayValue).sort();
            
        //     var programKeys = Object.keys(program);

        //     var fiscalYearTemplate = '';
        //     fiscalYear.forEach ((year) => {
        //         var fiscalYearText = parseInt(year);
        //         fiscalYearText += '/' + (parseInt(parseInt(year).toString().slice(-2)) + 1);
        //         fiscalYearTemplate += `<th class="text-center"><span>${fiscalYearText}</span></th>`;
        //     })
            
        //     var indicatorTemplate = `<table class="table">
        //     <thead>
        //         <tr>
        //             <th rowspan="2">Indicators</th>
        //             ${fiscalYearTemplate}
        //         </tr>
        //     </thead>`;
        //     $('#indicator-div').html(indicatorTemplate);
            
        //     programKeys.forEach((programKey, index) => {
        //         indicatorTemplate += `<tbody class="bg-color-${index}">
        //         <tr>
        //             <th scope="row" colspan="7">${programKey}</th>
        //         </tr>`;

        //         program[programKey].forEach( (indicator, index) => {
        //             indicatorTemplate += `<tr class="table-chart-${index}">
        //             <td>${indicator}</td>`;

        //             fiscalYear.forEach( (year) => {
        //                 var value = (typeof data[programKey + '-' + indicator + '-' + year] != 'undefined') ? 
        //                     data[programKey + '-' + indicator + '-' + year][indexOfValue] : '-' ;

        //                 indicatorTemplate += `<td class="text-center">${value}</td>`;
        //             })

        //             indicatorTemplate += `</tr>`;
        //         })

        //         indicatorTemplate += `</tbody>`;
        //     })

        //     indicatorTemplate += `</table>`;
             
        //     $('#indicator-div').html(indicatorTemplate);
        // });     
    }   

    async getKeyDemographicData(orgUnit, fiscalYear){
        var year = $('#fiscal-year-select option:selected').text();
        var year = year.split('/')[0];
        
        var endpoint = 'api/29/analytics.json?dimension=dx:U0zgcDnh8XN;i4hlJy2sskY;acrZhvmy3if;w2DFAzBLS6b;Jn2HhoIbfm7;BHSywopnNDI;VrcXKbZBRUp;d2CNJb8edUU;uchRCkTWX64;Ci8xBrFejqh&' + 
        'dimension=pe:'+year+'April&filter=ou:' + orgUnit + 
        '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.liveUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getHealthFacilityData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=EIwENR14wWG:' + fiscalYear + 
        '&dimension=dx:WD5A6WJc7QV;rIhR2Z1l2uo;c6ZWm0UEwq1;gIhakIUOHQF;buUeiE70VsK;fKSV1dS9nxP&filter=ou:' + orgUnit +
        '&filter=pe:2021&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getWardWiseHealthFacilityData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:GCm3kgdk6uI;WD5A6WJc7QV;rIhR2Z1l2uo;c6ZWm0UEwq1;gIhakIUOHQF;buUeiE70VsK;fKSV1dS9nxP&dimension=ou:LEVEL-5;' 
        + orgUnit +
        '&filter=EIwENR14wWG:' 
        + fiscalYear +
        '&filter=pe:2021&displayProperty=SHORTNAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getMunicipalityInfoData(orgUnit, fiscalYear){
        var endpoint = 'api/29/analytics.json?dimension=dx:EBZnzorMbvj&' + 
        'dimension=EIwENR14wWG:' + fiscalYear + '&dimension=pe:2021&filter=ou:' + orgUnit + 
        '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getMapData(orgUnit, fiscalYear){
        var endpoint = 'api/geoFeatures?ou=ou:' + orgUnit +';LEVEL-6&displayProperty=NAME';
        var url = this.liveUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getMapBoundryData(orgUnit){
        var endpoint = 'api/geoFeatures?ou=ou:' + orgUnit +'&displayProperty=NAME';
        var url = this.liveUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getPopulationByGenderData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:yuewqIfGZME;wTPVown6UWB;S4RT4dc7JdC;aRUWSnfYhtp;R7lMBb2VBac;mnScnI7DvoK;JTY4XyEp4xZ;nJ2WsnDgibx;IPPkKoA8SsU;SRFsBdjygkw;T35LZlV0l4B;Uh39fkwFGGb;q1SXj97jKi7;tZ0CtpSHY0X;U9tAow0SWsx;WKX52gMewUi&dimension=EIwENR14wWG:' + 
        fiscalYear + '&dimension=co&dimension=pe:2021&filter=ou:' + orgUnit 
        + '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getPopulationByCasteData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:Ej3ivuw7UHD;HGZdnHZHayl;DqG8LhLpE5F;hLy3KmvXetK;AtWXifdRVrC;ooSWXSEV2Eg&dimension=EIwENR14wWG:' + fiscalYear
        + '&dimension=pe:2021&filter=ou:' + 
        orgUnit + '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/caste.php"
        return await ajaxResponse(url);
    }   
    
    async getPopulationByWardData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:KBYi6rg67Sz&dimension=co&dimension=pe:2021&dimension=ou:LEVEL-5;' + orgUnit +
        '&filter=EIwENR14wWG:' +fiscalYear
        + '&displayProperty=NAME&outputIdScheme=NAME';

        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/ward-population.php"

        return await ajaxResponse(url);
    }   
    
    async getIndicatorData(orgUnit, fiscalYear){
        var endpoint = 'apisss/analytics/events/query/SlesGRHx6wN.json?dimension=pe:2022&dimension=ou:' + orgUnit +
        '&dimension=bLzw0ztPCoR&dimension=TUaGfBWVU24&dimension=iCLT9qVWlQB&dimension=aKlNuarfnWv&dimension=j3zNqRWgIfv&dimension=lMvQhESA7y7&stage=pa0utdLAwZS&displayProperty=NAME&outputType=EVENT&desc=eventdate&pageSize=100&page=1&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        return await ajaxResponse(url);
    }   
    
    async getInsuranceData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:VjHSMc45BCH.HllvX50cXC0;HqpUZbiHuk5.YgXbPg8EkUW;HqpUZbiHuk5.FVRBa3Bj5Cx&dimension=pe:2021&filter=ou:' + 
        orgUnit + 
        '&dimension=EIwENR14wWG:' + 
        fiscalYear +
        '&displayProperty=NAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/insures.php"
        return await ajaxResponse(url);
    }   
    
    async getSecurityData(orgUnit, fiscalYear){
        var endpoint = 'api/analytics.json?dimension=dx:T7QdLBooter;ggKmJFE25ul;v1bnbTIBLKf;tT3VS3br2V1;eZWl1PthcUU;bGEMG62qBau;vJKhwzXAVMl;HxbMdVtcN3m&dimension=pe:2021&filter=ou:' + 
        orgUnit + '&filter=EIwENR14wWG:' + 
        fiscalYear + '&displayProperty=SHORTNAME&outputIdScheme=NAME';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/social.php"

        return await ajaxResponse(url);
    }   
    
    async getDiseaseData(orgUnit, fiscalYear){
        var year = $('#fiscal-year-select option:selected').text();
        var lastyear = 'LAST_YEAR';
        
        year = year.split('/')[0];
        
        if(!isNaN(year)){
            lastyear = year + 'April';
        } 

        var endpoint = 'api/analytics.json?dimension=pe:'+ lastyear +'&dimension=dx:gCBjGGyu3Ob;QrRDFVy1Mjy;hpZ3dxdi8ec;HIS1nrVKXig;bexWnaEedW6;AhFweT7BqD9;mFJzub2Qp4X;N3MRYiUHzil;iURsh4W0Wxp;B5cvXBhXIgG;UcD9xoD0pHx;JpeQ4lNIiQb;d6rbLkuwYOX;HtTcLcPa76T;q8avBkQYnRz;et9kurthKJ4;n0shLXzsRei;PuUh7b5KUMg;gZf4PtuvTuB;HLPy8f80TG9;pGIog18uNHE;zk7V0m3RA7A;qSCo6gFpbA7;GeJACUuNCRP;MkJoAC3k84L;KRfpvHKnT8n;zN880cooTgl;Tc7OOHf9AnE;iNrqjFueJy1;dzEJovRUDc7;f14blP528FG;P4Q4WLZE5Uw;F1uuffMUyFH;cunBHt0wvUr;wwNnQiK9BL5;ndIndgtn4VV;bLwEmxj2RiC;GG6K9THTEw4;tNijzaDiPQq;kRcki0HPrzK;KVMVoWU58Kh;kII60figzgN;YUtWzAMSciZ;HxrrbsAqyeK;gJSwP9t4uVU;iNbL2YKjJt2;a4UjEBXaRAI;rh0J7pvRf7l;SFvtAwxOQzC;sKqfojmFULI;hhF8unbGDvH;RpYKV3jN4eI;mrQlLZbA6wB;lnn6QJPjLq5;EKSttMk1htc;iHtPpjk8dlR;ItL1KGvUFOC;pBfeHDJGUkc;kLzqhClFOUj;ZS5BWPoUc3V;Mz2N95C2GBd;V6jeKfAPnko;PvspE7rlkWK;NOYxO4z4lEY;bWTc0CtkExj;aeNEz2w7vUt;nGRapIBn04F;CAgq78eCGoT;JNDXvvL6e73;qrqs5BcXz4K;S4wji3QBoDj;qtjVLLOPJMq;wYzKSWInjSq;G8wYJTMKN0U;CFfXxPrIx8E;sO9oFKB9IAJ;zcqze4wzYJf;PABYQLhP6kF;VBrz7cTB79f;rHbb3KBlxBU;wmZ2OGp6ukm;NNlu3dspuAb;goDe1kKhJGF;CDE0GWEcSai;LFBNWB6AEAS;r3sO6KWErru;QXFsxDNzIa3;YtPBGWCccw7;hlijidCZeXC;EH7DUl0MrEX;PeTGehwYB0s;STQAKvx4hrd;AfuEmTogPN2;LgjEP3jIXsd;F9nektGalvQ;OD3nX0vpeRk;uuMnXAm0kdm;lm5yM11ZfpT;SdnBnsRltSh;ZK7kbGKuFhH;OqXKbJoicMI;YCXYzdxUeum;jdsiabr6R8B;INV87zUyfus;NM4bzwrsgs0;iiJsrZe0bNk;QxEgmIN7OQM;A6x6SS5Dgds;so2s568hmR9;OJRkVtEJZJA;WEEGs3oAxHz;Wtjpt7S9YQG;y0eNCU4p6nf;ba2N6S0Nqdb;asmWrHpopvG;fi0vtzIViQE;G0FIKc60DcJ;DEtuUddCtlE;ZhUGMCZfdWb;Y5tTcY8S6tG;sOXBvbQfg3k;ctGjkbCRtZn;e37wBcnOczg;Lxyk9qE4YVm;NukRpHU2mcF;zWK9OO0pMaM;pHrDUquZIYm;QDaBpwjmfws;XBZPrqWn6OG;zcypZ3frGDB;gCLElGi3gze;fZsSPCGs3d9;LZYfptKIqkh;cISG3BoGZTm;td2iBmsLero;y3glz39HVvQ;iVcBPvC8Dm4;FJ0pdVWlBbG;w5mNn2EBUmg;LAP6lgcrJi5;te3iSwrdWO7;iZDCnd0VgWy;LAwTvVrfnOB;gwhVCfaS9UN;ZZsL7yaqg4L;cSBNopxh2ZP;ZJPpYiYwPeW;CSRB2H5GLDZ;cI801zaVGau;ZrwTzFTdZhz;BpxwodMjTM4;QQSZDRTD294;EJOh3U60jKx;qkAsR3sHGWM;cVIqiRvVHVE;Y3S9491u1gd;BQhbt7KIEPW;sMRPKqciSdG;xtYZSzBt4j8;Ezc8lbdvcW6;GbSRNVeeY9r;MRSR1vwB7DR;o2Jx5MaLlex;CminYXY6RpV;ek34FewqNAf;a506kRKpXFX;iIHlesXptP0;yFJdnwOrHXf;voyeqQ4VHCX;WTmwO75ijQ0;OJUFnZllsLL;glyCwpl4XX3;p298JZkz6Ta;b1YXlOITj25;SzcyHRm0seg;KBoL28KAp3v;dHT1BRQHShX;Myk6XIoYftg;pLdnHZ6QHyu;jjYff5pdoVS;LPL3KuAFTFb;tnm6bH7SuJ2;mvm8Z3wTFmT;RdpEs3jOLCH;KRiv3u1UVbQ;eVXV442upyV;ZcI2ieytA1s;ldgv9ph2mBj;bQBY0ZM3U1Q;fCv76CsoGVC;b0flJFAByeR;ru2303Sy7nA;oVnNnGHesch;s4WLJ0dumzx;uPijgtgd0jA;A7ZUMi18b2C;BJpAbmeRUVm;wxnuAwt1Hqm;B8CqXFlCBr5;HuGvgg2pOA2;lNtBCvtTxhy;RVhyQYMBoTs;foBSqZVlQqZ;KaHd1xBHBfO;PYQPAx2s3On;cWN72D91wWx;Bj8m5N2pTT4;FvUsjP01G6w;KVZxc94qbg0;sm8t8cvkX0u;g8lF7Um9jQA;wzTTSKR3JgH;KkV2jvCCISU;Tcq1b4uRLTl;rorMnL90qUo;Ls6DBELhucD;CHDJ7eiK26X;qA53nDCEOgt;XeLKZHIMpSb;YZoJchLc66y;wpE1UaVVdRB;HEHjpjSkufl;bPqpAal7GQR;Dj1nN42wiMd;pGgj6Uir7IQ;WVh4R6WYimN;HgbiECMw5b0;qJ4iFmazTlj;XsxNnzlF1BX;pmLQfrfxRGP;Gbnq9hQ8Cdv;m09EZ409OyU;AItZIQeritY;VY580eVaGXw;doJ6CNvMbmw;bp53MgxccqQ;l09HErr6ggw;Qvvn1g4XfZ1;oh9zomy0bdm;EKavdicUQaW;nDWUFmrIPCA;l2WtbkagDEQ;SQNwhuIWZnE;PJklaKiPahr;l9K5FDX0TzP;jdMSjAAFrsr;AR2PUdMddYz;tYjWPArxgfm;DHYZJyfhw1s;kdWPXAMCv2N;tKnSyC5j6yR;x6rCNsx0k94;wOcRtQidQ51;daRv0ld07Hm;klPzarmP4i5;CMTTYvszId4;EELNfz1YCZv;GyGRGTZsRHN;jXZokvGicd1;IriSNYAZb14;OOO9AMFyOuM;nwdHjVGNJXP;FZZdZbgcA47;xoQX7YuYQ8d;PGX59e9bSPx;dFlqpKxwTYh;bEaNbyFhWqE;zCnvG70EbAa;E80SAeiK4KF;eimjIL0RFb8;G2SkThUYe5w;ZCcVuwqAfaG;z1O4M2enpI3;INDKIQBLb3i;e8gE5FvXVnB;C1dYWXuPeBo;uV5LwN8OzCy;qrTjnhUQ195;Bq8dxhxEmcI;IqwX6ARGCF7;axzMcDrcIfU;VAqYKbRvrHe;IihXJC3GzYF;Xfr7s6N5ILP;DuhReYAWpjc;DjYPzxgHx9v;ZfcANR0riP1;tS2cUtWNXpI;lvrJamUsDfR;rwQjknPpoey;mq1lHdw5EZ2;FAaK12zZX3M;ZfULTbeDgRF;tdl64qm6OIo;JNQxHWNvhcf;ZhcOrFM8ho1;txuV68xtrYc;FN5uLuYjGmq;Xzw4N8KPWQS;aoQoJU7AQ9O;K1Vggqh7EZL;S6sNGnudQxv;Ci8xBrFejqh&filter=ou:'+
        orgUnit + '&displayProperty=SHORTNAME&outputIdScheme=NAME&order=DESC';
        
        var url = this.liveUrl + encodeURIComponent(endpoint);
        console.log(url)
        // var url = "http://localhost/dip/api/disease.php"
        return await ajaxResponse(url);
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

        var url = this.url + 'api/me.json?fields=id,name,displayName,organisationUnits[id, name]';
        var response = await ajaxResponse(url, 'GET', {}, callback);
        return response;
    }

    async getFiscalYear(selected = '') {         
        var callback = function(resp){
            var fiscalYearLists = '';

            if(typeof(resp.items) != 'undefined'){
                resp.items.forEach(function (data) {
                    var selectedText = (selected == data.id) ? 'selected' : '';
                    fiscalYearLists += '<option value="' + data.id + '" ' + selectedText + ' >' + data.name + '</option>';
                });
            }
            $('#fiscal-year-select').html(fiscalYearLists);
        }

        var endpoint = 'api/categories/EIwENR14wWG.json?fields=items[id,name,code]';
        var url = this.bridgeUrl + encodeURIComponent(endpoint);
        // var url = "http://localhost/dip/api/fiscal-year.php"
        return await ajaxResponse(url, 'GET', {}, callback);
    }
}


