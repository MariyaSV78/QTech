/*
(exercises in quantum mechanics)
processing of statistical data on the use of the server
(AJAX request and resulting data visualisation using plotly)

Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
20/03/2020-30/04/2020
*/

function getstat(StatType){
	console.log('getstat');

	json_inputdata = {
		'StatType':	StatType,
		'StatDays':	6,
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
		url: "cgi-bin/getstat.cgi",
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

			switch(StatType){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					document.getElementById('typ_stattables').hidden = false;
					document.getElementById('typ_statfigure').hidden = true;
					document.getElementById('typ_stattables').innerHTML = jsondata.table;
					break;
				case 7:
					document.getElementById('typ_stattables').hidden = true;
					document.getElementById('typ_statfigure').hidden = false;
					plotFigStat('resultFigStat');
					break;
			}


		}
	})


}



function plotFigStat(resultFig) {
	Plotly.purge(resultFig);
	// plotly.js
	console.log('plotFigStat');
	layout_template = {
		xaxis: {
					title: 'Time',
					tickangle: 45,
				},
	};
	
	if (jsondata.Date==null) return;

	// plotly.js
	var trace = [];
	var figType = parseInt($("#sel_statfigure").val());
	switch (figType){
		case 0:
			document.getElementById('typ_map').hidden = true;
			trace.push( {
				x:		jsondata.Date,
				y:		jsondata.users,
				mode: 'markers+lines',
				type:	'scatter',
				name:	'all users',
				line: {
					color: 'rgb(0, 255, 0)',
					width: 2
				},
			});
			trace.push( {
				x:		jsondata.Date,
				y:		jsondata.newusers,
				mode: 'markers+lines',
				type:	'scatter',
				name:	'new users only',
				line: {
					color: 'rgb(255, 0, 0)',
					width: 2
				},
			});
			var layout = {
				template: layout_template,
				title:	'Temporal evolution of users',
				yaxis: {
					title: 'Number of users',
				},
			};
			break;
		case 1:
			document.getElementById('typ_map').hidden = true;
			trace.push( {
				x:		jsondata.Date,
				y:		jsondata.connections,
				mode: 'markers+lines',
				type:	'scatter',
//				cname:	'number of connections',
				line: {
					color: 'rgb(0, 0, 0)',
					width: 2
				},
			});
			var layout = {
				template: layout_template,
				title:	'Temporal evolution of connections',
				yaxis: {
					title: 'Number of connections',
				},
				showlegend: false,
			};
			break;
		case 2:
		case 3:
			document.getElementById('typ_map').hidden = false;
			var users = extractData(jsondata.usersCountries);
			var newusers = extractData(jsondata.newusersCountries);
			if (figType==2){
				x = newusers.x;
				y = newusers.y;
				cname = newusers.cname;
				uniquecname = newusers.uniquecname;
				title = 'Temporal evolution of new users';
			}else{
				x = users.x;
				y = users.y;
				cname = users.cname;
				uniquecname = users.uniquecname;
				title = 'Temporal evolution of users';
			}

			for(var nc=0;nc<uniquecname.length;nc++){
				cname0 = uniquecname[nc];
/*
				var x0 = x.filter(function(x,i){if (cname[i]==cname0) return x;});
				var y0 = y.filter(function(x,i){if (cname[i]==cname0) return x;});
				if (x0.length==1){x0=[x0];y0=[y0];}
				trace.push( {
					x:		x0,
					y:		y0,
					type: 'bar',
					cname:	cname0,
				});
*/
				trace.push( {
					x:		x,
					y:		y.map((x,i)=>(cname[i]==cname0)? x:NaN),
					type: 'bar',
					name:	cname0,
				});
			}
			var layout = {
				template: layout_template,
				title:	title,
				yaxis: {
					title: 'Number of users',
				},
				barmode: 'relative',
			};
			showMap(users.uniquecname, users.sumy);
			break;
	}

	Plotly.newPlot(resultFig, trace, layout);

}

var hbutton,map,heatLegend;
function showMap0(cname,number){
	am4core.useTheme(am4themes_animated);

	map = am4core.create("mapdiv", am4maps.MapChart);
	map.hiddenState.properties.opacity = 0; // this creates initial fade-in

//	map.geodata = am4geodata_worldLow;
	map.geodata = am4geodata_worldHigh;
	map.projection = new am4maps.projections.Miller();

	var title = map.chartContainer.createChild(am4core.Label);
	title.text = "Users in the World";
	title.fontSize = 20;
	title.padding = (30,0,0,30);
	title.align = "center";
	title.zIndex = 100;

	var polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
	var polygonTemplate = polygonSeries.mapPolygons.template;
	polygonTemplate.tooltipText = "{name}: {value.value.formatNumber('#.0')}";
	polygonSeries.heatRules.push({
		property: "fill",
		target: polygonSeries.mapPolygons.template,
		min: am4core.color("#D0D0FF"),
		max: am4core.color("#9c003c")
	});
	polygonSeries.useGeodata = true;


	// add heat legend
//	var 
	heatLegend = map.chartContainer.createChild(am4maps.HeatLegend);
	heatLegend.valign = "bottom";
	heatLegend.align = "left";
	heatLegend.width = am4core.percent(100);
	heatLegend.series = polygonSeries;
	heatLegend.orientation = "horizontal";
	heatLegend.padding(20, 20, 20, 20);
	heatLegend.valueAxis.renderer.labels.template.fontSize = 10;
	heatLegend.valueAxis.renderer.minGridDistance = 40;

	// Add button
	map.zoomControl = new am4maps.ZoomControl();
	map.zoomControl.padding(40, 0, 0, 0);
	map.zoomControl.width = 30;
	map.zoomControl.valign = "right";
	map.zoomControl.marginRight = 15;

	// home button
//	var 
	hbutton = map.chartContainer.createChild(am4core.Button);
	hbutton.padding(6, 6, 6, 6);
	hbutton.width = 30;
	hbutton.align = "right";
	hbutton.marginRight = 15;
	hbutton.marginTop = 15;
	hbutton.events.on("hit", function() {
		map.goHome();
	});

	hbutton.icon = new am4core.Sprite();
	hbutton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";


	polygonSeries.mapPolygons.template.events.on("over", event => {
		handleHover(event.target);
	});

	polygonSeries.mapPolygons.template.events.on("hit", event => {
		handleHover(event.target);
	});

	polygonSeries.mapPolygons.template.strokeOpacity = 0.4;
	polygonSeries.mapPolygons.template.events.on("out", event => {
		heatLegend.valueAxis.hideTooltip();
	});


	polygonSeries.data = []
	var nmax = number.max();
	for(var i=0; i<cname.length;i++){
		var x = map.geodata.features.find(x => x.properties.name==cname[i]);
//		var x = AmCharts.maps.worldHigh.svg.g.path.find(x => x.title==cname[i]);
		if(x!=null) var id = x.id;
		else id = 'None';
		hcolor = (255-Math.floor(number[i]/nmax*255)).toString(16);
		polygonSeries.data.push({
			"id": id,
			"title": cname[i]+": "+number[i]+" user(s)",
			"showAsSelected": true,
//
			"selectedColor": "#"+hcolor+hcolor+"ff",
			"value": number[i],
		},);
	}
	// excludes Antarctica
	polygonSeries.exclude = ["AQ"];

	function handleHover(mapPolygon) {
		if (!isNaN(mapPolygon.dataItem.value)) {
			heatLegend.valueAxis.showTooltipAt(mapPolygon.dataItem.value);
		} else {
			heatLegend.valueAxis.hideTooltip();
		}
	}
}

function showMap(cname,number){
	var areas = [];
	var nmax = number.max();
	for(var i=0; i<cname.length;i++){
		var x = AmCharts.maps.worldHigh.svg.g.path.find(x => x.title==cname[i]);
		if(x!=null) var id = x.id;
		else id = 'None';
		hcolor = (255-100-Math.floor(number[i]/nmax*(255-100))).toString(16);
		hcolor = (hcolor.length==1)? "0"+hcolor : hcolor;
		areas.push({
			"id": id,
			"title": cname[i]+": "+number[i]+" user(s)",
			"showAsSelected": true,
//
			"selectedColor": "#"+hcolor+hcolor+"ff",
			"value": number[i],
		},);
	}

	var map = AmCharts.makeChart("mapdiv",{
		type: "map",
		theme: "dark",
		projection: "mercator",
		panEventsEnabled : true,
		backgroundColor : "lightblue",
		backgroundAlpha : 1,
		zoomControl: {
			zoomControlEnabled : true
		},
		dataProvider : {
			map : "worldHigh",
			getAreasFromMap : true,
			areas : areas,
		},
		areasSettings : {
			autoZoom : true,
			color : "grey",
			//colorSolid : "#84ADE9",
			selectedColor : "#84ADE9",
			outlineColor : "#666666",
			rollOverColor : "#DADDE5",
			rollOverOutlineColor : "#000000"
		}
	});

}

var usersLegend;

/*
	// add legend
	usersLegend = map.chartContainer.createChild(am4maps.HeatLegend);
	usersLegend.valign = "bottom";
	usersLegend.align = "left";
	usersLegend.width = am4core.percent(100);
	usersLegend.series = areas;
	usersLegend.orientation = "horizontal";
	usersLegend.padding(20, 20, 20, 20);
	usersLegend.valueAxis.renderer.labels.template.fontSize = 10;
	usersLegend.valueAxis.renderer.minGridDistance = 40;

	areas.mapPolygons.template.events.on("over", event => {
		handleHover(event.target);
	});
*/
/*
	function handleHover(mapPolygon) {
		if (!isNaN(mapPolygon.dataItem.value)) {
			usersLegend.valueAxis.showTooltipAt(mapPolygon.dataItem.value);
		} else {
			usersLegend.valueAxis.hideTooltip();
		}
	}
*/



function extractData(tmp){
	var x = [],y = [],cname = [];
	for(var nday=0;nday<jsondata.Date.length;nday++){
		var countries = Object.keys(tmp[nday]);
		for(var nc=0;nc<countries.length;nc++){
			x.push(jsondata.Date[nday]);
			y.push(tmp[nday][countries[nc]]);
			cname.push(countries[nc]);
		}
	}

	var uniquecname = cname.filter((x, i, a) => a.indexOf(x) == i).sort();
	// or in es6
	//var uniquecname = [...new Set(cname)].sort();

	sumy = [];
	for(var nc=0;nc<uniquecname.length;nc++){
		cname0 = uniquecname[nc];
		sumy.push(y.filter((x,i)=> (cname[i]==cname0)?x:0).reduce((a,b)=>a+b));
	}
	return {'x':x,'y':y,'cname':cname,'uniquecname':uniquecname,'sumy':sumy};
}