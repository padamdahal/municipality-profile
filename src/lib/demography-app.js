$(function() {    
    const dataRepository =  new DataRepository();
    const demographicRepository =  new DemographicRepository();

    dataRepository.getOganizationUnits();
    demographicRepository.getFiscalYear();

    $('#organization-unit-select').change(function(){        
        if($('#fiscal-year-select').val()){
            $('#fiscal-year-select').trigger('change');
        }
    })

    $('#fiscal-year-select').change(function(){
        showDemographicForm();
    })
    
    function showDemographicForm(){
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();

        if(!orgUnit ||  !fiscalYear){
            toastMessageError('Please Select Organization Unit and Fiscal year');
            return;
        }

        $('#demography-data-div').html('');
        demographicRepository.setDemographicForm(orgUnit, fiscalYear);
        
    };
});