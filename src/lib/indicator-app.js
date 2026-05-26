$(function() { 
    const dataRepository =  new DataRepository();

    dataRepository.getOganizationUnits();
    dataRepository.getFiscalYear();
    dataRepository.getPrograms();
    
    let insertJsonArray = [];

    $('#fiscal-year-select , #organization-unit-select').change(function(){
        
        if($('#program-select').val()){
            $('#program-select').trigger('change');
        }
    })

    $('#program-select').change(function() {
        insertJsonArray = [];
        var programId = $(this).val();
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();

        if(!orgUnit ||  !fiscalYear){
            toastMessageError('Please Select Organization Unit and Fiscal year');
            return;
        }

        $('#indicator-data-div').html('');
        if($(this).val()){
            dataRepository.getIndicatorFiscalYearSettingData(programId, orgUnit, fiscalYear);
        }
    });

    $(document).on('change', '.indicator-data-value', function() {
        var program = $('#program-select').val();
        var orgUnit = $('#organization-unit-select').val();
        var fiscalYear = $('#fiscal-year-select').val();
        var indicatorName = $(this).data('indicatorname');
        var indicatorId = $(this).data('indicatorid');
        var programName =  $('#program-select option:selected').text();
        var method = $(this).data('method');
        var event = $(this).data('event');
        var value = $(this).val();

        insertJsonArray[indicatorId] = {
            'program' : program,
            'orgUnit' : orgUnit,
            'indicatorName' : indicatorName,
            'programName' : programName,
            'indicatorId' : indicatorId,
            'method' : method,
            'event' : event,
            'value' : value,
            'fiscalYear' : fiscalYear
        };
        
        console.log('insert array list');
        console.log(insertJsonArray);
    });

    $(document).on('click', '#save', function() {
        for (const data in insertJsonArray) {
            var object = insertJsonArray[data];
            var program = object.program;
            var orgUnit = object.orgUnit;
            
            var indicatorName = object.indicatorName;
            var indicatorId = object.indicatorId;
            var value = object.value;
            var fiscalYear = object.fiscalYear;
            var method = object.method;
            var event = object.event;
            var programName = object.programName;

            dataRepository.saveIndicatorFiscalYearData(orgUnit, program, indicatorName, indicatorId, programName,fiscalYear, value, method, event).then(
                function(success){
                    delete(insertJsonArray[indicatorId]);
                    console.log('insertJsonArray data');
                    console.log(insertJsonArray);

                },
                function(fail){
                    console.log('insertJsonArray fail data');
                    console.log(insertJsonArray);
                }
            );
        };
        $('#program-select').trigger('change');
    })

    $(document).on('click', '#masterCopy', function() {
        $('.master-data-value').each(function(){
            if($(this).val()){
                var inputElement = $(this).closest('tr').find('.indicator-data-value');
                if(!inputElement.val()){
                    inputElement.val($(this).val()).trigger('change');
                }
            }
        })
    })
});