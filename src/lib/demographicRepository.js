class DemographicRepository {
    constructor() {
        this.url = url_config;
        this.baseUrl = baseUrl_config;
        this.bridgeUrl = bridgeUrl_config;
        this.liveUrl = liveUrl_config;
        this.bridgePlainUrl = bridgePlainUrl_config;     
    }

    setDemographicForm(orgUnit, fiscalYear){
        var demographyPostData = [];
        var obj = this;
        formBlockUi();
        obj.getDemographicForm(orgUnit, fiscalYear).then( 
        function(){},
        function(demographicResponse)
        {
            obj.getDemographyPostData(orgUnit, fiscalYear).then( function(demographicPostResponse){
                if(demographicPostResponse !== null ){
                    demographicPostResponse.dataValues.forEach(function (data) {
                        demographyPostData[data.id + '-val'] = data.val;
                    });
                }

                $(document).find('input, textarea').each(function(){
                    var inputId = $(this).attr("id");
                    if( typeof(demographyPostData[inputId]) != 'undefined'){
                        $(this).val(demographyPostData[inputId]);
                    }                        
                })

                removeBlockUi();               
            })       
        })
    }
    
    setWardForm(orgUnit, fiscalYear){
        var wardPostData = [];
        var obj = this;
        formBlockUi();
        obj.getWardForm(orgUnit, fiscalYear).then( 
        function(success){
            obj.getWardPostData(orgUnit, fiscalYear).then( function(wardPostResponse){
                if(wardPostResponse !== null ){
                    wardPostResponse.dataValues.forEach(function (data) {
                        wardPostData[data.id + '-val'] = data.val;
                    });
                }

                $(document).find('input').each(function(){
                    var inputId = $(this).attr("id");
                    if( typeof(wardPostData[inputId]) != 'undefined'){
                        $(this).val(wardPostData[inputId]);
                    }                        
                })
                removeBlockUi();               
            })            
        },
        function(error)
        {
            obj.getWardPostData(orgUnit, fiscalYear).then( function(wardPostResponse){
                if(wardPostResponse !== null ){
                    wardPostResponse.dataValues.forEach(function (data) {
                        wardPostData[data.id + '-val'] = data.val;
                    });
                }
                
                $(document).find('input').each(function(){
                    var inputId = $(this).attr("id");
                    if( typeof(wardPostData[inputId]) != 'undefined'){
                        $(this).val(wardPostData[inputId]);
                    }                        
                })
                removeBlockUi();               
            })
       
        })
    }

    async getDemographicForm(orgUnit, fiscalYear){
        var url = this.bridgePlainUrl + 'dhis-web-dataentry/loadForm.action?dataSetId=Zq2xcC2d6Ee'; 
        var bridgePlainUrl = this.bridgePlainUrl;

        var callback = function(resp){
            $('#demography-data-div').html(resp);
        }
        var errorcallback = function(resp){
            var div = '<div class="card"><div class="card-body">' +resp.responseText + '</div></div>';
            $('#demography-data-div').html(div).find('input, textarea').change(function(){
                var inputId = $(this).attr("id");
                console.log(inputId);
                var value = $(this).val();
                var de = inputId.split('-')[0];
                var co = inputId.split('-')[1];
                var ds = "Zq2xcC2d6Ee";
                var ou = $("#organization-unit-select").val();
                var pe = "2021";
                var cc = "dTYA3kgsKxz";
                var cp = $('#fiscal-year-select').val();
                
                var dataValuesUrl = bridgePlainUrl + "api/dataValues";
                var formData = "de="+de+"&co="+co+"&ds="+ds+"&ou="+ou+"&pe="+pe+"&value="+value+"&cc="+cc+"&cp="+cp;
                $.ajax({
                    type: "POST",
                    url: dataValuesUrl,
                    data: formData,
                    dataType: 'json',
                    beforeSend: function( xhr ) {
                        $("#"+inputId).css('background','yellow');
                    }, success: function(data){
                        $("#loading").hide();
                        $("#"+inputId).css('background','#86ff17');
                        if(data == null || data.status != 'ERROR'){
                            console.log("Success");
                        }else{
                            console.log(data.message);
                        }
                    }, failure: function(errMsg) {
                        console.log(errMsg);
                        $("#"+inputId).css('background','red');
                    }
                });
            });;
        }

        return await ajaxResponse(url, 'GET', {}, callback, errorcallback);
    }
    
    async getWardForm(orgUnit, fiscalYear){
        var url = this.bridgePlainUrl + 
        encodeURIComponent('dhis-web-dataentry/loadForm.action?dataSetId=X11vQ4FYyoE&multiOrganisationUnit=' +
        orgUnit );  
        
        var bridgePlainUrl = this.bridgePlainUrl;
        
        var callback = function(resp){
            console.log('sresp');
            console.log(resp);
            $('#demography-data-div').html(resp);

        }
        var errorcallback = function(resp){
            console.log('eresp');
            console.log(resp);
            var div = '<div class="card"><div class="card-body">' +resp.responseText + '</div></div>';
            $('#demography-data-div').html(div).find('input').change(function(){
                var inputId = $(this).attr("id");
                var value = $(this).val();
                var de = inputId.split('-')[1];
                var co = inputId.split('-')[2];
                var ds = "X11vQ4FYyoE";
                var ou = inputId.split('-')[0];;
                var pe = "2021";
                var cc = "dTYA3kgsKxz";
                var cp = $('#fiscal-year-select').val();
                
                var dataValuesUrl = bridgePlainUrl + 'api/dataValues';
                var formData = "de="+de+"&co="+co+"&ds="+ds+"&ou="+ou+"&pe="+pe+"&value="+value+"&cc="+cc+"&cp="+cp;
                $.ajax({
                    type: "POST",
                    url: dataValuesUrl,
                    data: formData,
                    dataType: 'json',
                    beforeSend: function( xhr ) {
                        $("#"+inputId).css('background','yellow');
                    }, success: function(data){
                        $("#loading").hide();
                        $("#"+inputId).css('background','#86ff17');
                        if(data == null || data.status != 'ERROR'){
                            console.log("Success");
                        }else{
                            console.log(data.message);
                        }
                    }, failure: function(errMsg) {
                        console.log(errMsg);
                        $("#"+inputId).css('background','red');
                    }
                });
            });
        }

        return await ajaxResponse(url, 'GET', {}, callback, errorcallback);
    }

    getFiscalYear() {         
        var callback = function(resp){
            var fiscalYearLists = '<option value="">Select Fiscal year </option>';

            if(typeof(resp.items) != 'undefined'){
                resp.items.forEach(function (data) {
                    fiscalYearLists += '<option value="' + data.id + '">' + data.name + '</option>';
                });
            }
            $('#fiscal-year-select').html(fiscalYearLists);
        }
        var url = this.bridgeUrl + 'api/categories/EIwENR14wWG.json?fields=items[id,name,code]';
        return ajaxResponse(url, 'GET', {}, callback);
    }

    async getDemographyPostData(orgUnit, fiscalYear){
        var url = this.bridgeUrl +
        encodeURIComponent('dhis-web-dataentry/getDataValues.action?periodId=2021&dataSetId=Zq2xcC2d6Ee&organisationUnitId=' + orgUnit
        + '&multiOrganisationUnit=false&cc=dTYA3kgsKxz&cp=' + fiscalYear);
        
        var response = await ajaxResponse(url);
        return response;
    }
    
    async getWardPostData(orgUnit, fiscalYear){
        var url = this.bridgeUrl  +
        encodeURIComponent('dhis-web-dataentry/getDataValues.action?periodId=2021&dataSetId=X11vQ4FYyoE&organisationUnitId=' + orgUnit
        + '&multiOrganisationUnit=true&cc=dTYA3kgsKxz&cp=' + fiscalYear);
        
        var response = await ajaxResponse(url);
        return response;
    }
}