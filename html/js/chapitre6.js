	/*
	(exercises in quantum mechanics)
	page load function and functions for setting default values
	
	Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
	25/05/2019-30/04/2020
	*/


    function runOnce(llang) {
        is2D=true;
        // $("#txt_Ny").attr("hidden", false);
        // $("#txt_y").attr("hidden", false);
        lang = llang;
        LabelType = 1;
        isTemporal = true;
        if (localStorage.getItem('jsondata')!=null && localStorage.getItem('currentfile')==location.pathname.substring(location.pathname.lastIndexOf("/") + 1)){
            ServerUpdate(-1);
            SetPotentialProfile();
        
            return;
        }else{
            isLoadPrevious = false;
            localStorage.removeItem('jsondata');
            localStorage.setItem('currentfile',location.pathname.substring(location.pathname.lastIndexOf("/") + 1));
        }
        
    $("#typ_isShowAnalyticSolution").attr("hidden", false);
    
        // is2D=true;
    
        document.getElementById("var_Type").value = 0;
        document.getElementById("var_Pot_Type").value = 20;
    //	document.getElementById("var_Pot_Type").value = 31;
    
        SetDefault();
    
        ServerUpdate(2);
            
        SetPotentialProfile();
    }
    
    function SetDefault() {
        $("#var_Nx").val(50);
        $("#var_Ny").val(49);
        $("#var_Nkx").val(25);
        $("#var_Nky").val(26);
        $("#var_Nc_max").val(10000);
        $("#var_Nt").val(100);
        $("#var_x0").val(-50);
        $("#var_xL").val(50);
        $("#var_y0").val(-50);
        $("#var_yL").val(50);
    
        $("#var_dt").val(0.5);
    
        $("#var_xc_WP").val(-25);
        $("#var_yc_WP").val(0);
        $("#var_a0x").val(10);
        $("#var_a0y").val(30);
        $("#var_k0x").val(1);
        $("#var_k0y").val(0);
    
        $("#var_epsilon").val(1e-2);
        $("#var_mu").val(1);
        $("#var_V0").val(100);
        $("#var_l").val(0);
    
        $("#var_amin").val(0.0000005);
    
        $("#var_x_screen").val(20);
    
        $("#var_x_axis").val(0);
    
    
            
    switch ( parseInt($("#var_Pot_Type").val()) ){
    
            case 31: //  1 slit
                $("#var_slit_d").val(5);
                $("#var_slit_ls").val(10);
                break;
            case 32: // 2 slits
                $("#var_slit_d").val(8);
                $("#var_slit_ls").val(4);
                $("#var_slit_ly").val(8);
                break;
            case 33: // n-slits
                $("#var_slit_d").val(8);
                $("#var_slit_ls").val(4);
                $("#var_slit_ly").val(8);
                $("#var_slit_n").val(3);
    
                break;
            case 20: // free particle
            
    
            default: // free particle
        }
            
    }
    
    
    function SetPotentialProfile() {
    jsondata= [];
    $("#typ_delta").attr("hidden", true);
    $("#txt_Analyt").attr("hidden", true);
    $("#typ_barrierwidth").attr("hidden", true);
    Pot_Type0 = parseInt($("#var_Pot_Type").val()); 
    if (Pot_Type0!=null) Pot_Type = Pot_Type0;
    $("[id^=exp_]").attr("hidden", true);
    $("#exp_"+Pot_Type).attr("hidden", false);
    
    switch (Pot_Type){
    
            case 31: //  1 slit
                $("#typ_V0").attr("hidden", false);
                $("#typ_slit_d").attr("hidden", false);
                $("#typ_slit_ls").attr("hidden", false);
                $("#typ_slit_ly").attr("hidden", true);
                $("#typ_slit_n").attr("hidden", true);
                break;
            case 32: // 2 slits
                $("#typ_V0").attr("hidden", false);
                $("#typ_slit_d").attr("hidden", false);
                $("#typ_slit_ls").attr("hidden", false);
                $("#typ_slit_ly").attr("hidden", false);
                $("#typ_slit_n").attr("hidden", true);
                break;
            case 33: // n-slits
                $("#typ_V0").attr("hidden", false);
                $("#typ_slit_d").attr("hidden", false);
                $("#typ_slit_ls").attr("hidden", false);
                $("#typ_slit_ly").attr("hidden", false);
                $("#typ_slit_n").attr("hidden", false);
                break;
            case 20: // free particle
                $("#typ_V0").attr("hidden", true);
                $("#typ_slit_d").attr("hidden", true);
                $("#typ_slit_ls").attr("hidden", true);
                $("#typ_slit_ly").attr("hidden", true);
                $("#typ_slit_n").attr("hidden", true);
            
    
            default: //free particle
        }
            
    change_tmax();
    }
    