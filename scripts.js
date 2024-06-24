const yourWeatherTab = document.querySelector("[data-urWeather]");
const searchWeatherTab = document.querySelector("[data-searchWeath]");
const searchDiv = document.querySelector("[data-searchingBarDiv]");
const detailsDiv = document.querySelector("[data-detailSecDiv]");
const grantDiv = document.querySelector("[data-grantAccessDiv]");
const loadingDiv = document.querySelector("[data-loaderDiv]");
const notFoundDiv = document.querySelector("[data-notFound]");
const searchBarMeinLikha = document.querySelector("[data-searchingBar]");


const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = yourWeatherTab;
currentTab.classList.add("currTabBg");
getSavedCoordinates();


function switchTab(clickedTab){
    if(currentTab == clickedTab){
        return;
    }
    if(clickedTab != searchWeatherTab){
        currentTab = clickedTab;
        notFoundDiv.classList.remove("active");
        searchWeatherTab.classList.remove("currTabBg");
        searchDiv.classList.remove("active");
        detailsDiv.classList.remove("active");
        currentTab.classList.add("currTabBg");

        getSavedCoordinates();
        // detailsDiv.classList.add("active");

    }
    else{
        currentTab = searchWeatherTab;
        grantDiv.classList.remove("active");
        yourWeatherTab.classList.remove("currTabBg");
        detailsDiv.classList.remove("active");
        currentTab.classList.add("currTabBg");
        searchDiv.classList.add("active");
    }
}

yourWeatherTab.addEventListener("click" ,()=>{
    switchTab(yourWeatherTab);
})

searchWeatherTab.addEventListener("click" ,()=>{
    switchTab(searchWeatherTab);
})



function getSavedCoordinates(){
    const coordinates = sessionStorage.getItem("my-Coordinates");
    if(!coordinates){
        grantDiv.classList.add("active");
    }
    else{
        const localCoordinates = JSON.parse(coordinates);
        fetchWeacherByCoordinates(localCoordinates);
    }
}

async function fetchWeacherByCoordinates(localCoordinates){
    const {lat , lon} = localCoordinates;
    loadingDiv.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const weatherData = await response.json();
        loadingDiv.classList.remove("active");
        detailsDiv.classList.add("active");
        putDataOnScreen(weatherData);
    } 
    catch (error) {
        loadingDiv.classList.remove("active");
        notFoundDiv.classList.add("active");
    }
}

function putDataOnScreen(weatherData){

    console.log("isne kaam kia");

    const cityName = document.querySelector("[data-placeName]");
    const countryPhoto = document.querySelector("[data-countryImg]");
    const skyreport = document.querySelector("[data-skyUpdate]");
    const skyPic = document.querySelector("[data-skyUpdatePic]");
    const temperature = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeedPercentage]");
    const humidity = document.querySelector("[data-humidityPercentage]");
    const clouds = document.querySelector("[data-cloudPercentage]");
    
    // console.log(weatherData);

    cityName.innerText = weatherData?.name;
    countryPhoto.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    skyreport.innerText = weatherData?.weather?.[0]?.description;
    skyPic.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherData?.main?.temp} °C`;
    windSpeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    clouds.innerText = `${weatherData?.clouds?.all}%`;
}

function grantAccBtn(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HUM EK ALERT DAALENGE OKK
        //PENDING
    }
}

function showPosition(position){

    const myCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    grantDiv.classList.remove("active");
   
    sessionStorage.setItem("my-Coordinates" , JSON.stringify(myCoordinates));
    fetchWeacherByCoordinates(myCoordinates);

}

function searchKaro(){
    notFoundDiv.classList.remove("active");
    detailsDiv.classList.remove("active");
    const findPlace = searchBarMeinLikha.value;
    if(findPlace === "") return;
    else{
        loadingDiv.classList.add("active");
        fetchWeatherByPlaceName(findPlace);
    }
       
}

async function fetchWeatherByPlaceName(cityy){
    try{
        var response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityy}&appid=${API_KEY}&units=metric`
        );

        console.log("kaam kar rha ah");

        const data = await response.json();
        let check = data?.cod;
        loadingDiv.classList.remove("active");
        if(check === "404"){
            
            notFoundDiv.classList.add("active");
            
        }
        else{
            console.log("kaam kar rha ah abhi bhi");
            putDataOnScreen(data);
            detailsDiv.classList.add("active");
        }
        
    }
    
    catch(err){
        // PENDING HAI LAST MEIN DAALENGE 
    
    }

        

}
