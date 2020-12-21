function getForecast(day) {
    //document.getElementById("forecast").inneroutput = "Forecast for " + day;
    //document.getElementById("forecast").load("dailyforecast.output #" + day);
    jQuery('#forecast').load('dailyforecast.output #' + day);
}

function getDarkSkyForecast(forecast) {
	
	 var output = "<BR>";
	 dailyForecastData = forecast["daily"];
	 forecastSummary = dailyForecastData["summary"];
	 forecastSummaryIcon = dailyForecastData["icon"];
	 forecastArray = dailyForecastData["data"];

	 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	 
     // forecastDataContains an arry of one day forecasts;
     for (const dayForecast of forecastArray) {	
        dateTime = new Date(dayForecast["time"]*1000);
		output += "<HR>";
	    output += "Forecast for: ";
		output += dateTime.toLocaleDateString("en-US",options);
		output += "<BR><BR>";
        summary = dayForecast["summary"];
		output += summary;
		output += "<BR><BR>";
        icon = dayForecast["icon"];
        sunriseTime = new Date(dayForecast["sunriseTime"]*1000);
        sunsetTime = new Date(dayForecast["sunsetTime"]*1000);
        moonPhase = dayForecast["moonPhase"];
        precipIntensity = dayForecast["precipIntensity"];
        precipIntensityMax = dayForecast["precipIntensityMax"];
        precipIntensityMaxTime = new Date(dayForecast["precipIntensityMaxTime"]*1000);
        precipProbability = dayForecast["precipProbability"];
		
        precipType = dayForecast["precipType"];
 
		precipAccumulation = dayForecast["precipAccumulation"];
 
		if (precipIntensity > 0 && precipAccumulation >= 0.01)
		{	
	        precipProbability = precipProbability * 10;
			precipProbability = Math.round(precipProbability);
			precipProbability = precipProbability * 10;
			output += precipType;
			output += "<BR><BR>";
			output += "Chance of Precip: ";
			output += precipProbability;
			output += "<BR><BR>";
		}
		
		
		if (precipAccumulation >= 0.01)
		{	
		    var accumString;
			output += "Accumulation: ";
			
			if (precipAccumulation < 1)
			{
			    accumString = "Less than 1 inch"	
			}
            else
			{  
				var roundedAccum;
				roundedAccum = Math.round(precipAccumulation);
				
				if (roundedAccum == 1)
				{
					accumString = roundedAccum + " inch";
				}
				else
				{
					accumString = roundedAccum + " inches";
				}
			}				
			
			output += accumString;
			output += "<BR><BR>";
		}
		
        temperatureHigh = dayForecast["temperatureHigh"];
		output += "High Temperature: ";
		output += Math.round(temperatureHigh);
		output += "<BR><BR>";
	
        temperatureHighTime = new Date(dayForecast["temperatureHighTime"]*1000);
        temperatureLow = dayForecast["temperatureLow"];
		output += "Low Temperature: ";
		output += Math.round(temperatureLow);
		output += "<BR><BR>";
		
        temperatureLowTime = new Date(dayForecast["temperatureLowTime"]*1000);
        apparentTemperatureHigh = dayForecast["apparentTemperatureHigh"];
        apparentTemperatureHighTime = new Date(dayForecast["apparentTemperatureHighTime"]*1000);
        apparentTemperatureLow = dayForecast["apparentTemperatureLow"];
        apparentTemperatureLowTime = new Date(dayForecast["apparentTemperatureLowTime"]*1000);
        dewPoint = dayForecast["dewPoint"];
        humidity = dayForecast["humidity"];
        pressure = dayForecast["pressure"];
        windSpeed = dayForecast["windSpeed"];
        windGust = dayForecast["windGust"];
        windGustTime = new Date(dayForecast["windGustTime"]*1000);
        windBearing = dayForecast["windBearing"];
        cloudCover = dayForecast["cloudCover"];
        uvIndex = dayForecast["uvIndex"];
        uvIndexTime = new Date(dayForecast["uvIndexTime"]*1000);
        visibility = dayForecast["visibility"];
        ozone = dayForecast["ozone"];
        temperatureMin = dayForecast["temperatureMin"];
        temperatureMinTime = new Date(dayForecast["temperatureMinTime"]*1000);
        temperatureMax = dayForecast["temperatureMax"];
        temperatureMaxTime = new Date(dayForecast["temperatureMaxTime"]*1000);
        apparentTemperatureMin = dayForecast["apparentTemperatureMin"];
        apparentTemperatureMinTime = new Date(dayForecast["apparentTemperatureMinTime"]*1000);
        apparentTemperatureMax = dayForecast["apparentTemperatureMax"];
        apparentTemperatureMaxTime = new Date(dayForecast["apparentTemperatureMaxTime"]*1000);	 
		
	 }	 
     
	 document.getElementById("demo").innerHTML = output;
	 
	 /* dailySummary = data["history"]["dailysummary"][0];
     date = dailySummary["date"]["pretty"];
     maxTemp = dailySummary["maxtempi"];
     minTemp = dailySummary["mintempi"];
     precip = dailySummary["precipi"];
	 peakWind = dailySummary["maxwspdi"];
	 jQuery('#maxtemp').text(maxTemp);
	 jQuery('#mintemp').text(minTemp);
	 jQuery('#date').text(date);
	 jQuery('#precip').text(precip);
	 jQuery('#peakwind').text(peakWind);
	  */
}

function getForecastHeader(){
  jQuery.ajax({url: 'https://api.darksky.net/forecast/7ded21298c6e735931887e68321d5e57/39.989250,-105.445558?exclude=[currently,minutely,hourly]',  dataType: 'jsonp', success: getDarkSkyForecast}).done(function( ) {});
}

jQuery(document).ready(getForecastHeader);