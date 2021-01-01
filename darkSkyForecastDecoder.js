var decoder;

var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function callbackClosure(i, image, forecastDay, callback) {
  return function() {
    return callback(i, image, forecastDay);
  }
}

var forecastArea = {
    canvas : document.createElement("canvas"),
    draw : function() {
        this.canvas.width = 1200;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
		this.context.font = "14px Arial";
        this.offset = this.canvas.width / decoder.decodedForecast.length;		
		
		$('div#weather').append(this.canvas);
		
		var forecastDay;
		var index = 0;
		var image = "";
		
	    for (forecastDay of decoder.decodedForecast) {
			// Add the day
			day = daysOfWeek[forecastDay.dateTime.getDay()];
		    this.context.fillStyle = "red";
			this.context.fillText(day, index, 12);
			
			// Add the image
			image = imageFactory(forecastDay.icon);
			var img = new Image;
			var ctx = this.context;

	        img.onload = callbackClosure(index, img, forecastDay, function(index, img, forecastDay) {
		  
		        ctx.drawImage(img,index,20);
			
				ctx.fillStyle = "white";
			   
			    var dir = windDirectionFactory(forecastDay.windBearing);
				ctx.fillText(dir, index + 2, 35);
				
				var speed = forecastDay.windSpeed;
				var gust = forecastDay.windGust;
				ctx.fillText(speed + " G " + gust, index + 2, 50);
				
				
			   
			   	if (forecastDay.precipProbability > 30) {
				

					if (forecastDay.precipType = "snow") {
						ctx.fillText("Snow: " + forecastDay.accumString, index, 145);
					}
					else {
						ctx.fillText("Rain: " + forecastDay.precipAccumulation, index, 145);
					}
				
			}

	         });
            			
            img.src = image;
			
			// Add the high and low temperatures
			var highTemp = forecastDay.temperatureHigh;
			var lowTemp = forecastDay.temperatureLow;
			var summary = forecastDay.summary;
			var res = summary.split(" ");
		
		    this.context.fillStyle = "red";
			this.context.fillText("High: " + highTemp, index, 165);
		    this.context.fillStyle = "blue";
			this.context.fillText("Low:  " + lowTemp, index, 180);
			this.context.fillStyle = "green";
			this.context.fillText("PoP: " + forecastDay.precipProbability, index + 70, 165);

			
			var y = 210;
			
			if (forecastDay.precipProbability > 10) {
				
				this.context.fillStyle = "white";

				if (forecastDay.precipType = "snow") {
					this.context.fillText("Snow: " + forecastDay.accumString, index, 140);
				}
				else {
					this.context.fillText("Rain: " + forecastDay.precipAccumulation, index, 140);
				}
				
			}

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

function getDarkSkyForecast(jsonForecast) {
	decoder = new DarkSkyForecastDecoder(jsonForecast);
	decoder.decode();
	forecastArea.draw(decoder);
};

function DarkSkyForecastDecoder(jsonForecast) {
	
	this.jsonForecast = jsonForecast;
	this.decodedForecast = [];
	
	this.decode = function () {

		this.dailyForecastData = this.jsonForecast["daily"];
		this.forecastSummary = this.dailyForecastData["summary"];
		this.forecastSummaryIcon = this.dailyForecastData["icon"];
		this.forecastArray = this.dailyForecastData["data"];

	    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	 
		// forecastDataContains an array of one day forecasts;
		for (const dayForecast of this.forecastArray) {	
		
		    var dailyForecast = {};
			dailyForecast.dateTime = new Date(dayForecast["time"]*1000);
			dailyForecast.summary = dayForecast["summary"];
			dailyForecast.icon = dayForecast["icon"];
			dailyForecast.sunriseTime = new Date(dayForecast["sunriseTime"]*1000);
			dailyForecast.sunsetTime = new Date(dayForecast["sunsetTime"]*1000);
			dailyForecast.moonPhase = dayForecast["moonPhase"];
			dailyForecast.precipIntensity = dayForecast["precipIntensity"];
			dailyForecast.precipIntensityMax = dayForecast["precipIntensityMax"];
			dailyForecast.precipIntensityMaxTime = new Date(dayForecast["precipIntensityMaxTime"]*1000);
			dailyForecast.precipProbability = dayForecast["precipProbability"];
            dailyForecast.precipType = dayForecast["precipType"];
		    dailyForecast.precipAccumulation = dayForecast["precipAccumulation"];
			
			dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
			dailyForecast.precipProbability = Math.round(dailyForecast.precipProbability);
			dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
 
			if (dailyForecast.precipIntensity > 0 && dailyForecast.precipAccumulation >= 0.01)
			{	
				//dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
				//dailyForecast.precipProbability = Math.round(dailyForecast.precipProbability);
				//dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
			}
		
			if (dailyForecast.precipAccumulation >= 0.01)
			{	
				
				if (dailyForecast.precipAccumulation < 1)
				{
					dailyForecast.accumString = "< 1 inch"	
				}
				else
				{  
					var roundedAccum;
					roundedAccum = Math.round(dailyForecast.precipAccumulation);
					
					if (roundedAccum == 1)
					{
						dailyForecast.accumString = roundedAccum + " inch";
					}
					else
					{
						dailyForecast.accumString = roundedAccum + " inches";
					}
				}				
			}
			
			dailyForecast.temperatureHigh = Math.round(dayForecast["temperatureHigh"]);
			dailyForecast.temperatureHighTime = new Date(dayForecast["temperatureHighTime"]*1000);
			dailyForecast.temperatureLow = Math.round(dayForecast["temperatureLow"]);
			dailyForecast.temperatureLowTime = new Date(dayForecast["temperatureLowTime"]*1000);
			dailyForecast.apparentTemperatureHigh = dayForecast["apparentTemperatureHigh"];
			dailyForecast.apparentTemperatureHighTime = new Date(dayForecast["apparentTemperatureHighTime"]*1000);
			dailyForecast.apparentTemperatureLow = dayForecast["apparentTemperatureLow"];
			dailyForecast.apparentTemperatureLowTime = new Date(dayForecast["apparentTemperatureLowTime"]*1000);
			dailyForecast.dewPoint = dayForecast["dewPoint"];
			dailyForecast.humidity = dayForecast["humidity"];
			dailyForecast.pressure = dayForecast["pressure"];
			dailyForecast.windSpeed = dayForecast["windSpeed"];
			dailyForecast.windSpeed = Math.round(dailyForecast.windSpeed);
			dailyForecast.windGust = dayForecast["windGust"];
            dailyForecast.windGust = Math.round(dailyForecast.windGust);
			dailyForecast.windGustTime = new Date(dayForecast["windGustTime"]*1000);
			dailyForecast.windBearing = dayForecast["windBearing"];
			dailyForecast.cloudCover = dayForecast["cloudCover"];
			dailyForecast.uvIndex = dayForecast["uvIndex"];
			dailyForecast.uvIndexTime = new Date(dayForecast["uvIndexTime"]*1000);
			dailyForecast.visibility = dayForecast["visibility"];
			dailyForecast.ozone = dayForecast["ozone"];
			dailyForecast.temperatureMin = dayForecast["temperatureMin"];
			dailyForecast.temperatureMinTime = new Date(dayForecast["temperatureMinTime"]*1000);
			dailyForecast.temperatureMax = dayForecast["temperatureMax"];
			dailyForecast.temperatureMaxTime = new Date(dayForecast["temperatureMaxTime"]*1000);
			dailyForecast.apparentTemperatureMin = dayForecast["apparentTemperatureMin"];
			dailyForecast.apparentTemperatureMinTime = new Date(dayForecast["apparentTemperatureMinTime"]*1000);
			dailyForecast.apparentTemperatureMax = dayForecast["apparentTemperatureMax"];
			dailyForecast.apparentTemperatureMaxTime = new Date(dayForecast["apparentTemperatureMaxTime"]*1000);	 
			
			this.decodedForecast.push(dailyForecast);
			
		 }
	};	 
     
}

function getForecastHeader(){
  jQuery.ajax({url: 'https://api.darksky.net/forecast/7ded21298c6e735931887e68321d5e57/39.989250,-105.445558?exclude=[currently,minutely,hourly]',  dataType: 'jsonp', success: getDarkSkyForecast}).done(function( ) {});
}

function imageFactory(iconName) {
	
    var image="";
	
	switch (iconName) {
		case "clear-day":
		image = "//localhost/images/clear-day.png";
		break;
		
		case "clear-night":
		image = "//localhost/images/clear-night.png";
		
		break;
		
		case "rain":
		image = "//localhost/images/rain.png";
		
		break;
		
		case "snow":
		image = "//localhost/images/snow.png";
		
		break;
		
		case "sleet":
		image = "//localhost/images/sleet.png";
		
		break;
		
		case "wind":
		image = "//localhost/images/wind.png";
		break;
		
		case "fog":
		image = "//localhost/images/fog.png";
		
		break;
		
		case "cloudy":
		image = "//localhost/images/cloudy.png";
		
		break;
		
		case "partly-cloudy-day":
		image = "//localhost/images/partly-cloudy-day.png";
		
		break;
		
		case "partly-cloudy-night":
		image = "//localhost/images/partly-cloudy-night.png";
		
		break;
		
		default:
		break;
	}
    return image;	
}

function windDirectionFactory(direction) {
	
	var stringDir;
	
	if (direction >= 0 && direction < 20)
	{
		stringDir = "N";
	}
	else if (direction >= 20 && direction < 40)
	{
		stringDir = "NNE";
	}
	else if (direction >= 40 && direction < 60)
	{
		stringDir = "NE";
	}
    else if (direction >= 60 && direction < 80)
	{
        stringDir = "ENE";
	}
    else if (direction >= 60 && direction < 80)
	{
        stringDir = "ENE";
	}
    else if (direction >= 80 && direction < 110)
	{
        stringDir = "E";
	}
    else if (direction >= 110 && direction < 130)
	{
        stringDir = "ESE";
	}
    else if (direction >= 130 && direction < 150)
	{
        stringDir = "SE";
	}
    else if (direction >= 150 && direction < 170)
	{
        stringDir = "SSE";
	}
    else if (direction >= 170 && direction < 200)
	{
        stringDir = "S";
	}
    else if (direction >= 200 && direction < 220)
	{
        stringDir = "SSW";
	}
    else if (direction >= 220 && direction < 240)
	{
        stringDir = "SW";
	}
    else if (direction >= 240 && direction < 260)
	{
        stringDir = "WSW";
	}
    else if (direction >= 260 && direction < 290)
	{
        stringDir = "W";
	}
    else if (direction >= 290 && direction < 310)
	{
        stringDir = "WNW";
	}
    else if (direction >= 310 && direction < 330)
	{
        stringDir = "NW";
	}
    else if (direction >= 330 && direction < 340)
	{
        stringDir = "NNW";
	}
    else
	{
        stringDir = "N";
	}
	
	return stringDir;
}

jQuery(document).ready(getForecastHeader);