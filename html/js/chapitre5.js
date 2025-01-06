	/*
	page load function and functions for setting default values
	
	Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
                M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
	*/

    function runOnce(llang) {
        lang = llang;
            LabelType = 1;
        if (localStorage.getItem('jsondata')!=null && localStorage.getItem('currentfile')==location.pathname.substring(location.pathname.lastIndexOf("/") + 1)){
            ServerUpdate(-1, 0);
            ServerUpdate(2, 1);

            return;
        }else{
            isLoadPrevious = false;
            localStorage.removeItem('jsondata');
            localStorage.setItem('currentfile',location.pathname.substring(location.pathname.lastIndexOf("/") + 1));
        }
    
        document.getElementById("var_Vrange").value = 0;
        ServerUpdate(0, 0);
        ServerUpdate(2, 1);
    }
    

    function SetDefault(clctp) {
        if (clctp == 1 || clctp == 0) {
            $("#var_U").val(1);
            $("#var_E_0").val(0.5);
            $("#var_dp").val(10);
        }
        if (clctp == 2 || clctp == 0) {
            $("#var_Phi_s").val(4.7);
            $("#var_Phi_t").val(5.3);
            $("#var_d").val(10);
            $("#var_S").val(10);
            $("#var_V").val(7);
            
        }
    }
    

    // Displaying text and figure corresponding to the selected Voltage Range 
    function SetVoltageRange() {
        Voltage_Range0 = parseInt($("#var_Vrange").val());
        if (Voltage_Range0 != null) Voltage_Range = Voltage_Range0;

    
        // Hide all potential type-specific divs
        $("#wholeRange, #lowRange, #intermediateRange, #highRange").hide();
    
        // Show the div corresponding to the selected potential type
        switch (Voltage_Range) {
            case 0:
                $("#wholeRange").show();
                break;
            case 1:
                $("#lowRange").show();
                break;
            case 2:
                $("#intermediateRange").show();
                break;
            case 3:
                $("#highRange").show();
                break;
            default:
                break;
        }
        // Add_Nsampl_selection();
        // update_Equation();
    }
