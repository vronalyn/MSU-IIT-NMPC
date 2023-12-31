
const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress-wrap");
const formSteps = document.querySelectorAll(".tabpanel");
const progressSteps = document.querySelectorAll(".step");
const tryAgainButton = document.querySelector(".btn-prev");

let formStepsNum = 0;

nextBtns.forEach((btn) => {

  btn.addEventListener("click", () => {

    if (formStepsNum === 2) {
      if (isVideoCompleted()) {
        formStepsNum++;
        updateFormSteps();
        updateProgressbar();
        scrollToTop(); 
      } else {
        // alert("Error: Please finish watching the video before proceeding.");
        var alertElement = document.getElementById('videoAlert');
        alertElement.style.display = 'block';
        alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
      }
    } else {
      if (validateCurrentStep()) {
        formStepsNum++;
        updateFormSteps();
        updateProgressbar();
        scrollToTop(); 
        initializeMap()

      } else {
        // Scroll to the first unfilled field
        scrollToFirstInvalidField();
      }
    }
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
      formStepsNum--;
      updateFormSteps();
      updateProgressbar();
  });
});

// Add this function to check whether the video is completed
function isVideoCompleted() {
  const video = document.getElementById("seminarVideo");
  console.log("Video paused:", video.paused);
  console.log("Current time:", video.currentTime);
  console.log("Duration:", video.duration);
  
   const hasVideoCompleted = video.currentTime >= video.duration;
   if (hasVideoCompleted) {
    // Save a flag in localStorage to indicate that the video has been completed
    localStorage.setItem("videoCompleted", "true");

  }

  return hasVideoCompleted;
}


function validateCurrentStep() {
  
  const currentFormStep = document.querySelector(".show");
  const requiredFields = currentFormStep.querySelectorAll("input[required], select[required], [type='checkbox'][required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    // const fieldMessage = field.nextElementSibling; // Assuming fieldMessage is a sibling of the input field
    const fieldMessage = field.closest('.form-checks').querySelector('.invalid-feedback');

    if (field.type === "checkbox") {
      if (!field.checked) {
        isValid = false;
        fieldMessage.style.display = "block";
      } else {
        fieldMessage.style.display = "none";
      }
    } else if (field.tagName === "SELECT" ) {
      if (field.value === "") {
        isValid = false;
        field.classList.add("error");
        fieldMessage.style.display = "block";
      } else {
        field.classList.remove("error");
        fieldMessage.style.display = "none";
      }
    } 
    else if (field.hidden) {
      if (field.value === "") {
        isValid = false;
        var alertElement = document.getElementById('Alert');
        alertElement.style.display = 'block';
          
      } else {
       console.log("none");
      }     
    }
    else if (!field.value) {
      isValid = false;
      field.classList.add("error");
      fieldMessage.style.display = "block";
    } else {
      field.classList.remove("error");
      fieldMessage.style.display = "none";
    }
      
  });

  
  return isValid;
}

// not validate

function scrollToFirstInvalidField() {
  const currentFormStep = document.querySelector(".show");
  const requiredFields = currentFormStep.querySelectorAll("input[required], select[required], [type='checkbox'][required]");

  let firstInvalidField = null;

  requiredFields.forEach((field) => {
    const fieldMessage = field.closest('.form-checks').querySelector('.invalid-feedback');

    if (field.type === "checkbox") {
      if (!field.checked && !firstInvalidField) {
        firstInvalidField = field;
      }
    } else if (field.tagName === "SELECT") {
      if (field.value === "" && !firstInvalidField) {
        firstInvalidField = field;
      }
    } else if (!field.value && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  if (firstInvalidField) {
    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("show") &&
      formStep.classList.remove("show");
  });

  formSteps[formStepsNum].classList.add("show");
}



function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
  
    if (idx != formStepsNum) {
      progressStep.classList.remove("active-prog");
      progressStep.classList.remove("active-prog-first");
      progressStep.classList.remove("active-prog-last");

    } else if (formStepsNum === 0) {
      if (formStepsNum === 0) {
        progressStep.classList.add("active-prog-first") 

      } else {
        progressStep.classList.remove("active-prog");
      }

    } else if (formStepsNum === 3) {
      if (formStepsNum === 3) {
        progressStep.classList.add("active-prog-last") 

      } else {
        progressStep.classList.remove("active-prog");
      }
    } else {
        progressStep.classList.add("active-prog") 
    }


  });

}

// Function to scroll the view to the top
function scrollToTop() {
  window.scrollTo({
    top: 200,
    behavior: 'smooth'
  });
}

function initializeMap() {
  console.log('Initializing the map...');

  mapboxgl.accessToken = 'pk.eyJ1IjoidnJvbmFseW4iLCJhIjoiY2xjMDJnNWhtMWJxYzN1bXFjZmdnNDR3dSJ9.LkEnrvW8i-KTy-8lVyZs-g';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [124.240967, 8.231000],
    zoom: 15
  });

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
  );

  map.addControl(new mapboxgl.NavigationControl());

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    })
  );

  let currentMarker;

  map.on('click', (e) => {
    const coordinates = e.lngLat;

    if (currentMarker) {
      currentMarker.remove();
    }

    const marker = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat(coordinates)
      .addTo(map);

    document.getElementById('longitude').value = coordinates.lng.toFixed(6);
    document.getElementById('latitude').value = coordinates.lat.toFixed(6);

    currentMarker = marker;

    console.log('Longitude:', coordinates.lng);
    console.log('Latitude:', coordinates.lat);
  });
}


