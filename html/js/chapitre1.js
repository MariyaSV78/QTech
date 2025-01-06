
	/*
	(exercises in quantum mechanics)
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
        ServerUpdate(2, 2);
        ServerUpdate(2, 3);



		return;
	}else{
		isLoadPrevious = false;
		localStorage.removeItem('jsondata');
		localStorage.setItem('currentfile',location.pathname.substring(location.pathname.lastIndexOf("/") + 1));
		ServerUpdate(0, 0);

    }
	ServerUpdate(0, 0);
    ServerUpdate(2, 1);
    ServerUpdate(2, 2);
    ServerUpdate(2, 3);
}

function SetDefault(clctp) {
    if (clctp == 1 || clctp == 0) {
        $("#var_energy_i").val(-0.2);
        $("#var_l_partial_i").val(0);
        $("#var_npoints_i").val(1000);
        $("#var_r_min_i").val(0.01);
        $("#var_r_max_i").val(10);
        // $("#var_delta_i").val(0.8);
        // $("#var_mu_i").val(0);
        // $("#var_n_i").val(3);
    }
    if (clctp == 2 || clctp == 0) {
        // $("#var_Atom_Type").val(0);
        $("#var_l_partial_f").val(1);
        $("#var_npoints_f").val(1000);
        $("#var_r_min_f").val(0.01);
        $("#var_r_max_f").val(10);
        $("#var_energy_f").val(0.5);

    }
    if (clctp == 3 || clctp == 0) {	
        $("#var_n_i").val(3);
        // $("#var_n_f").val(3);
        $("#var_l_partial_i_ph").val(1);
        $("#var_l_partial_f_ph").val(2);
       
        $("#var_m_i").val(0);
        $("#var_npoints_ph").val(100);
        $("#var_r_min_ph").val(0.5);
        $("#var_r_max_ph").val(25);

        $("#var_mu_i").val(0.8);
        $("#var_mu_f").val(0.0148972);
        
        $("#var_N_E").val(50);

        $("#var_Atom_Type").val(0);
        $("#var_Initial_State_atom").val(0);
        $("#var_Final_State_atom").val(0);

        $("#SelectedAtom").show();
        $("#Your_atom").hide();


        Atom_Type = parseInt($("#var_Atom_Type").val());

        StateI = parseInt($("#var_Initial_State_atom").val());
    
        StateF = parseInt($("#var_Final_State_atom").val());
   
    }
}

		
// function setDefaultAtomType() {
//     // Get the select element by its ID
//     var selectElement = document.getElementById("var_Atom_Type");
//     // Set the default value (for example, selecting "1" which corresponds to "Rb")
//     selectElement.value = "1";
//     // Trigger the onchange event if needed
//     selectElement.onchange();
// }