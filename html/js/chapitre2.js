
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
    }

	ServerUpdate(0, 0);
    ServerUpdate(2, 1);
    ServerUpdate(2, 2);
    ServerUpdate(2, 3);
}

function SetDefault(clctp) {
    if (clctp == 1 || clctp == 0) {
        $("#var_npoints_r").val(1000);
        $("#var_r_min").val(0.05);
        $("#var_r_max").val(20);
        $("#var_mass_1").val(12);
        $("#var_mass_2").val(15.999);
        $("#var_j_to_print").val(3);
        $("#var_v_max").val(4);
        $("#var_j_max").val(30);     
        $("#var_m_p").val(0);
        $("#var_m").val(0);    
        $("#var_T").val(300);
        $("#var_v_p").val(1);
        $("#var_v").val(0);
    }
    if (clctp == 2 ) {
        $("#var_m_p").val(0);
        $("#var_m").val(0);
    }
    if (clctp == 3 ) {
        $("#var_T").val(300);
        $("#var_v_p").val(1);
        $("#var_v").val(0);
    }
}

		
