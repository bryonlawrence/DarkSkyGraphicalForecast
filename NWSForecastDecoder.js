var decoder;

function callbackClosure(i, image, forecastDay, callback) {
  return function() {
    return callback(i, image, forecastDay);
  }
}

var forecastArea = {
    canvas : document.createElement("canvas"),
    draw : function() {
        this.canvas.width = 1500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
		this.context.font = "12px Arial";
        this.offset = this.canvas.width / decoder.decodedForecast.length;		
		
		$('div#weather').append(this.canvas);
		
		var forecastDay;
		var index = 0;
		var image = "";
		
	    for (forecastDay of decoder.decodedForecast) {
			// Add the day
			day = forecastDay.name;
		    this.context.fillStyle = "red";
			this.context.fillText(day, index, 12);
			
			// Add the image
			image = forecastDay.icon;
			var img = new Image;
			var ctx = this.context;

	        img.onload = callbackClosure(index, img, forecastDay, function(index, img, forecastDay) {
		  
		        ctx.drawImage(img,index,20);
			
			   

	         });
            			
            img.src = image;
			
			ctx.fillStyle = "green";
			   
		    var dir = forecastDay.windDirection;
			ctx.fillText(dir, index + 2, 120);
				
			var speed = forecastDay.windSpeed;
			ctx.fillText(speed, index + 2, 135);

			
			// Add the high and low temperatures
			var temperature = forecastDay.temperature;
			var summary = forecastDay.shortForecast;
			var res = summary.split(" ");
		
		    if (forecastDay.isDaytime) {
				this.context.fillStyle = "red";
				this.context.fillText("High: " + temperature, index, 160);				
			} else {
				this.context.fillStyle = "blue";
				this.context.fillText("Low:  " + temperature, index, 160);
			}
			
			var y = 180;
			
			this.context.fillStyle = "black";
			
			for (word of res) {
				this.context.fillText(word, index, y);
				y += 15;
			}

			index += this.offset;
		}
			
    },
	
	clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function getNWSForecast(jsonForecast) {
	decoder = new NWSForecastDecoder(jsonForecast);
	decoder.decode();
	forecastArea.draw(decoder);
};

function NWSForecastDecoder(jsonForecast) {
	
	this.jsonForecast = jsonForecast;
	this.decodedForecast = [];
	
	this.decode = function () {

		this.forecastArray = this.jsonForecast["properties"]["periods"];
 
		// forecastData contains an array of 12-hour forecasts;
		for (const dayForecast of this.forecastArray) {	
		
		    var dailyForecast = {};
			dailyForecast.name = dayForecast["name"];
			dailyForecast.startTime = new Date(dayForecast["startTime"]);
			dailyForecast.endTime = new Date(dayForecast["endTime"]);
			dailyForecast.isDaytime = dayForecast["isDaytime"];
			dailyForecast.temperature = dayForecast["temperature"];
			dailyForecast.temperatureTrend = dayForecast["temperatureTrend"];
			dailyForecast.windSpeed = dayForecast["windSpeed"];
			dailyForecast.windDirection = dayForecast["windDirection"];
			dailyForecast.icon = dayForecast["icon"];
			dailyForecast.shortForecast = dayForecast["shortForecast"];
			dailyForecast.detailedForecast = dayForecast["detailedForecast"];
		
			
			this.decodedForecast.push(dailyForecast);
			
		 }
	};	 
     
}

function getForecastHeader(){
  jQuery.ajax({url: 'https://api.weather.gov/gridpoints/BOU/47,73/forecast',  dataType: 'json', success: getNWSForecast}).done(function( ) {});
}

jQuery(document).ready(getForecastHeader);