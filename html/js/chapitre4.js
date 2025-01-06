
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
            ServerUpdate(2, 0);

            return;
        }else{
            isLoadPrevious = false;
            localStorage.removeItem('jsondata');
            localStorage.setItem('currentfile',location.pathname.substring(location.pathname.lastIndexOf("/") + 1));
        }
        // document.getElementById("var_Ej_Ec").value = 0.1;
     
        ServerUpdate(0, 0);
        ServerUpdate(2, 0);


    }
    
    function SetDefault() {
            $("#var_N").val(20);
            $("#var_Ej_Ec").val(0.1);
    }
    