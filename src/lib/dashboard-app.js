$(function() {      

    $('.disease-custom-select').select2();
    const dataRepository =  new DataRepository();  
    
    var defaultFiscalYear = 'fxD7JcCO9jD'; 

    monitoringChartData = [];

    dataRepository.getOganizationUnits().then(function(res){
        dataRepository.getFiscalYear(defaultFiscalYear).then(function(response){
            var defaultOrgName = decodeURIComponent(GetParameterValues('name')) != 'undefined' ? decodeURIComponent(GetParameterValues('name')) : '';
            
            var defaultOrgUnit = $('#organization-unit-select').val();
            defaultOrgUnit = decodeURIComponent(GetParameterValues('id')) != 'undefined' ? decodeURIComponent(GetParameterValues('id')) : defaultOrgUnit;
            
            $('#municipality-name').text($('#organization-unit-select option:selected').text());
            
            init(defaultOrgUnit, defaultFiscalYear);
        });
    });    
    
    function init(orgUnit, fiscalYear){
        
        loadCensusDashboard('src', 'https://censusnepal.cbs.gov.np/results/population?province=7&district=75&municipality=1');
        
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
        // dataRepository.setIndicatorChart(orgUnit, fiscalYear);  
        dataRepository.setIndicatorTrendlineChart(orgUnit, fiscalYear);  
        dataRepository.setDiseaseChart(orgUnit, fiscalYear);  
        dataRepository.setWardWiseHealthFacilityChart(orgUnit, fiscalYear);  
    }

    function loadCensusDashboard(url) {
      const iframe = document.getElementById('censusdata');
      const loader = document.getElementById('loadingcensusdata');

      // 1. Show the loader
      loader.style.display = 'flex';
      // 2. Set up the trigger to hide it when finished
      iframe.onload = function() {
        loader.style.display = 'none';
      };
      // 3. Change the source to trigger the load
      iframe.src = url;
    }

    $('#organization-unit-select').change(function(){
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();
        $('#municipality-name').text($('#organization-unit-select option:selected').text());
        init(orgUnit, fiscalYear);
        loadCensusDashboard('https://censusnepal.cbs.gov.np/results/population?province=7&district=75&municipality=2');
        
        //$('#censusdata').attr('src', 'https://censusnepal.cbs.gov.np/results/population?province=7&district=75&municipality=2');
    })
    
    $('#fiscal-year-select').change(function(){
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();
        $('#municipality-name').text($('#organization-unit-select option:selected').text());
        init(orgUnit, fiscalYear);
    })

    $('#disease-select').change(function(){
        if($(this).val() == '2'){
            $('#topdiseasePercentage-row').show();
            $('#topdisease-row').hide();
        }else{
            $('#topdiseasePercentage-row').hide();
            $('#topdisease-row').show();
        }
    })
})

