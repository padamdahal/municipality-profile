$(function() {      
    const dataRepository =  new DataRepository();  
    
    var defaultFiscalYear = 'fxD7JcCO9jD'; 
    
    // $('#municipality-name').text(defaultOrgName);
    // $('#organization-unit-select').val(defaultOrgUnit);

    dataRepository.getOganizationUnits().then(function(res){
        dataRepository.getFiscalYear(defaultFiscalYear).then(function(response){
            var defaultOrgUnit = $('#organization-unit-select').val();
            defaultOrgUnit = decodeURIComponent(GetParameterValues('id')) != 'undefined' ? decodeURIComponent(GetParameterValues('id')) : defaultOrgUnit;
            var defaultOrgName = decodeURIComponent(GetParameterValues('name')) != 'undefined' ? decodeURIComponent(GetParameterValues('name')) : '';
            $('#municipality-name').text($('#organization-unit-select option:selected').text());
            console.log(response);
            init(defaultOrgUnit, defaultFiscalYear);
        });
    });
    
    
    function init(orgUnit, fiscalYear){
        
        $(document).find('.loaded').each(function(){
            $(this).removeClass('loaded');
        });

        dataRepository.setMunicipalityInfo(orgUnit, fiscalYear);    
        dataRepository.setMap(orgUnit, fiscalYear);    
        dataRepository.setKeyDemographicChart(orgUnit, fiscalYear);    
        dataRepository.setHealthFacilityChart(orgUnit, fiscalYear);    
        dataRepository.setPopulationByGenderChart(orgUnit, fiscalYear);    
        dataRepository.setPopulationByCasteChart(orgUnit, fiscalYear);    
        dataRepository.setPopulationByWardChart(orgUnit, fiscalYear);    
        dataRepository.setInsuranceChart(orgUnit, fiscalYear);  
        dataRepository.setSecurityChart(orgUnit, fiscalYear);  
        dataRepository.setIndicatorChart(orgUnit, fiscalYear);  
        dataRepository.setDiseaseChart(orgUnit, fiscalYear);  
        dataRepository.setWardWiseHealthFacilityChart(orgUnit, fiscalYear);  
    }
    
    $('#organization-unit-select').change(function(){
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();
        $('#municipality-name').text($('#organization-unit-select option:selected').text());
        init(orgUnit, fiscalYear);
    })
    
    $('#fiscal-year-select').change(function(){
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();
        $('#municipality-name').text($('#organization-unit-select option:selected').text());
        init(orgUnit, fiscalYear);
    })
})

