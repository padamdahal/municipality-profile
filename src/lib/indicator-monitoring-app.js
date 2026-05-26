$(function() {
    const dataRepository =  new DataRepository();

    monitoringChartData = [];
    
    dataRepository.getOganizationUnits().then(function(resp){
        dataRepository.getPrograms();
    })
    
    $('#organization-unit-select').change(function(){        
        if($('#program-select').val()){
            $('#program-select').trigger('change');
        }
    })

    $('#program-select').change(function() {
        monitoringChartData = [];
        var programId = $(this).val();
        var orgUnit = $('#organization-unit-select').val();
        
        if(!orgUnit){
            toastMessageError('Please Select Organization Unit');
            return;
        }

        $('#indicator-chart-div').html('');
        $('#indicator-ul').html('');

        if($(this).val()){     
            dataRepository.setAllIndicartorData(programId, orgUnit);
        }
    });
});