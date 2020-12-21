
var forecastArea = {
    canvas : document.createElement("canvas"),
    draw : function() {
        this.canvas.width = 700;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
		
		// Draw on the canvas
		$('div#weather').append(this.canvas);
    },
	clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function getDarkSkyForecast(jsonForecast) {
	decoder = new DarkSkyForecastDecoder(jsonForecast);
	decoder.decode();
	forecastArea.draw();
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
 
			if (dailyForecast.precipIntensity > 0 && dailyForecast.precipAccumulation >= 0.01)
			{	
				dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
				dailyForecast.precipProbability = Math.round(dailyForecast.precipProbability);
				dailyForecast.precipProbability = dailyForecast.precipProbability * 10;
			}
		
			if (dailyForecast.precipAccumulation >= 0.01)
			{	
				
				if (dailyForecast.precipAccumulation < 1)
				{
					dailyForecast.accumString = "Less than 1 inch"	
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
			dailyForecast.windGust = dayForecast["windGust"];
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

jQuery(document).ready(getForecastHeader);