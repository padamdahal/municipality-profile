$(function() {
    const dataRepository =  new DataRepository();
    
    dataRepository.getOganizationUnits();
    dataRepository.getPrograms();
    
    let insertJsonArray = [];

    $('#organization-unit-select').change(function(){        
        if($('#program-select').val()){
            $('#program-select').trigger('change');
        }
    })

    $('#program-select').change(function() {
        insertJsonArray = [];
        var programId = $(this).val();
        var orgUnit = $('#organization-unit-select').val();
        
        if(!orgUnit){
            toastMessageError('Please Select Organization Unit');
            return;
        }

        $('#indicator-div').html('');   
        if($(this).val()){     
            dataRepository.getIndicatorSettingDataByProgram(programId, orgUnit);
        }
    });

    $(document).on('click', '.indicator-selected', function() {
        var program = $('#program-select').val();
        var orgUnit = $('#organization-unit-select').val();
        var indicatorName = $(this).data('indicatorname');
        var indicatorId = $(this).data('indicatorid');
        var programName = $(this).data('programname');
        var method = $(this).data('method');
        var event = $(this).data('event');

        insertJsonArray[indicatorId] = {
            'program' : program,
            'orgUnit' : orgUnit,
            'indicatorName' : indicatorName,
            'indicatorId' : indicatorId,
            'programName' : programName,
            'method' : method,
            'event' : event,
            'public' : '',
            'selected' : '',
        };
        if($(this).prop('checked')){
            $(this).closest('tr').find('.indicator-public').prop('checked', true);
            insertJsonArray[indicatorId].public = 'true';
            insertJsonArray[indicatorId].selected = 'true';
        }else{         

            $(this).closest('tr').find('.indicator-public').prop('checked', false);
        }
        console.log(insertJsonArray);
    });
    
    $(document).on('click', '.indicator-public', function() {
        var object = $(this).closest('tr').find('.indicator-selected');

        var program = $('#program-select').val();
        var orgUnit = $('#organization-unit-select').val();
        var indicatorName = object.data('indicatorname');
        var indicatorId = object.data('indicatorid');
        var programName = object.data('programname');        
        var method = object.data('method');        
        var event = object.data('event');        

        if($(this).prop('checked')){
            insertJsonArray[indicatorId] = {
                'program' : program,
                'orgUnit' : orgUnit,
                'indicatorName' : indicatorName,
                'indicatorId' : indicatorId,
                'programName' : programName,
                'method' : method,
                'event' : event,
                'public' : 'true',
                'selected' : 'true',
            };
            $(this).closest('tr').find('.indicator-selected').prop('checked', true);
        }else{
            insertJsonArray[indicatorId] = {
                'program' : program,
                'orgUnit' : orgUnit,
                'indicatorName' : indicatorName,
                'indicatorId' : indicatorId,
                'programName' : programName,
                'method' : method,
                'event' : event,
                'public' : '',
                'selected' : 'true',
            };
        }
        console.log(insertJsonArray);
    });
    
    $(document).on('click', '#save', function() {
        for (const data in insertJsonArray) {
            var object = insertJsonArray[data];
            console.log('object');
            console.log(object);
            var program = object.program;
            var orgUnit = object.orgUnit;
            
            var indicatorName = object.indicatorName;
            var indicatorId = object.indicatorId;
            var programName = object.programName;
            var selected = object.selected;
            var public = object.public;
            var method = object.method;
            var event = object.event;

            dataRepository.saveIndicatorData(orgUnit, program, indicatorName, indicatorId, programName, selected, public, method, event).then(
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
})