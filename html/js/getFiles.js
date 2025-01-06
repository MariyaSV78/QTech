/*
(exercises in quantum mechanics)
reading of file list on the server
(AJAX request and resulting data treatment)

Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
25/02/2020-30/04/2020
*/

function getFiles(folder,nex,htmlregion){
	console.log('getFiles');

	json_inputdata = {
		'folder':	folder,
		'nex':	nex,
	};

// 	$.blockUI({ 
// 		message: 'Getting file list...',
// 		css: { 
// 	animation: 'blinker 1s linear infinite',
// 			border:				'none', 
// 			padding:			'15px', 
// 			backgroundColor:	'#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', 
// 			opacity:			'.5', 
// 			color:				'#fff',
// 			fontSize:			'18px',
// 			fontFamily:			'Verdana,Arial',
// 			fontWeight:			200,
// 		}
// 	});
	

	$.ajax({
		url: "http://prd-mecaqu.centralesupelec.fr/cgi-bin/getFileList.cgi",
		type: "POST",
		data: JSON.stringify(json_inputdata),
		dataType: 'json',
		success: function(response){

			jsondata = response;


			if (jsondata.Error!=null){
				alert(jsondata.Error);
				jsondata.Error=null;
				return;
			}

			if (jsondata.filenames.length==0){
				str = 'No files at this moment!';
			}else{
				str = '';
				for(var i=0;i<jsondata.filenames.length;i++){
					fn = jsondata.filenames[i];
					str += '<a href="../'+folder+'/'+nex+'/'+fn+'" target="_blank">Download '+fn+'</a>'
					str += '<br>';
				}
			}
			document.getElementById(htmlregion).innerHTML = str;

		}
	})


}

