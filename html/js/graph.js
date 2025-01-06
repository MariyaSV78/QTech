var jsonfile = {
	"jsonarray": [{
		"name": "Joe",
		"age": 12
	}, {
		"name": "Tom",
		"age": 14
	}]
};

var labels = jsonfile.jsonarray.map(function(e) {
	return e.name;
});
var data = jsonfile.jsonarray.map(function(e) {
	return e.age;
});;

var ctx1 = canvas1.getContext('2d');
var config1 = {
	type: 'line',
	data: {
		labels: labels,
		datasets: [{
			label: 'Graph Line',
			data: data,
			backgroundColor: 'rgba(0, 119, 204, 0.3)'
		}]
	}
};



/*
	var myWindow = window.open("newFile.html","newWindow","width=700,height=500");  
	let content = "<button class='btn btn-primary' onclick='window.print();'>Confirm</button>";

	myWindow.document.getElementById('mainBody').innerHTML = content;
	myWindow.document.write(content);
	setTimeout(myWindow.window.close(), 2000); 
*/
