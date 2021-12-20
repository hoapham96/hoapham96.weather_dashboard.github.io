// import { google } from 'google-maps';


// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  let checkedElelement = document.getElementById('checked')
  console.log("look at me: "+ev.target.getAttribute("value"));
  if (ev.target.tagName === 'LI') {
    console.log("important: "+ev.target.value);
    checkedElelement.removeAttribute('id');
    ev.target.setAttribute("id", "checked");
    checkedElelement = document.getElementById('checked')
    console.log(checkedElelement.getAttribute("value")); 
    
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}  
var button = document.querySelector('.buttom')





// // Autocomplete Options
// var findLocation= () => {
//   var geocoder = new google.maps.Geocoder();
//   // var address = document.getElementById('textboxid').value;

//   geocoder.geocode({
//     'address': 'Austin'
//   }, function(results, status) {

//     if (status == google.maps.GeocoderStatus.OK) {
//       var latitude = results[0].geometry.location.lat();
//       var longitude = results[0].geometry.location.lng();
//       console.log(latitude);
//     }
//   });
// }
// findLocation()

function getLatandLongbyCity () {
  let res = fetch('https://maps.googleapis.com/maps/api/geocode/json?address=Austin&key=AIzaSyCFVvYHINQ3vKjfx9ooOSgh23Rk4yKmPtU')
  .then(res => res.json()).then(data=> console.log(data.results.geometry.location.lat))
  
}

getLatandLongbyCity()


const dateEl = document.getElementById('city-date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const API_KEY ='1901f77fa17d1458bb24b8b1640ff569';
 
getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
      console.log(success);
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

setInterval(() => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();

    dateEl.innerHTML =  (month+1 + '/' + date + '/' + year)

}, 1000);


function showWeatherData (data){
    let {humidity, feels_like, uvi, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `
    <div class="weather-item">
        <div>Temp: ${feels_like*9/5+32}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed: ${wind_speed} MPH</div>
    </div>
    <div class="weather-item">
        <div>Humidity: ${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>UV Index: ${uvi}</div>
    </div>
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
      if(idx==0){

        weatherForecastEl.innerHTML =
         `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="tempCard">Temp: ${day.feels_like.day*9/5+32}</div>
                <div class="windCard">Wind Speed: ${wind_speed} MPH</div>
                <div class="himidityCard">Humidity: ${humidity}%</div>
            </div>
            `
        }else{
          otherDayForcast += `
          <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="tempCard">Temp: ${day.feels_like.day*9/5+32}</div>
                <div class="windCard">Wind Speed: ${day.wind_speed} MPH</div>
                <div class="himidityCard">Humidity: ${day.humidity}%</div>
            </div>
          `
        }
    }
      )


    weatherForecastEl.innerHTML = otherDayForcast;
}