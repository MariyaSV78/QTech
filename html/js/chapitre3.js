
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
            return;
        }else{
            isLoadPrevious = false;
            localStorage.removeItem('jsondata');
            localStorage.setItem('currentfile',location.pathname.substring(location.pathname.lastIndexOf("/") + 1));
        }
    
        // ServerUpdate(0, 0); old code

        document.getElementById("var_Pot_Type").value = 0;

        SetDefault();   
        // ServerUpdate(2, 0);            
        SetPotentialProfile();
        ServerUpdate(0, 0);

    }
    
    function SetDefault(clctp) {
            $("#var_x_min").val(-8);
            $("#var_x_max").val(8);
            $("#var_n_state").val(1);
            $("#var_n").val(200);
            $("#var_n_samples").val(5000);
            $("#var_n_samples_print").val(5);
            $("#var_k").val(5);
            $("#var_lerning_rate").val(0.0005);
            $("#var_training_iter").val(100);
            $("#var_batch_size").val(64);
    
    }
    
    function SetPotentialProfile() {
        // jsondata = [];
        Pot_Type0 = parseInt($("#var_Pot_Type").val());
        if (Pot_Type0 != null) Pot_Type = Pot_Type0;
    
        // Hide all potential type-specific divs
        $("#polynomialPotential, #harmonicOscillator, #morsePotential").hide();
    
        // Show the div corresponding to the selected potential type
        switch (Pot_Type) {
            case 0:
                $("#polynomialPotential").show();
                break;
            case 1:
                $("#harmonicOscillator").show();
                break;
            case 2:
                $("#morsePotential").show();
                break;
            default:
                break;
        }
        Add_Nsampl_selection();
        update_Equation();
    }

    function SetNsample() {

        N_sample0 = parseInt($("#N_sampl").val());
console.log('N sample Set', N_sample0 )
        if (N_sample0 != null) N_sample = N_sample0;
        set_Omega();
        update_Equation();
        print_table('table_alpha2');
    }
