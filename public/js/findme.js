"use strict";
const username = document.querySelector('#username');
const autoupdate = document.querySelector('#autoupdate');
const statusEl = document.querySelector('#status');
const submit = document.querySelector('#submit');
const finding = document.querySelector('#finding');
const mapcanvas = document.querySelector('#mapcanvas');
const { geolocation } = navigator;
function success(position) {
    const user = username.value;
    const { maps } = google;
    const { latitude, longitude, accuracy } = position.coords;
    if (statusEl.className === 'success') {
        return;
    }
    statusEl.textContent = 'found you!';
    statusEl.className = 'success';
    mapcanvas.style.display = 'block';
    const latlng = new maps.LatLng(latitude, longitude);
    const mapOptions = {
        zoom: 15,
        center: latlng,
        mapTypeControl: false,
        //navigationControlOptions: { style: maps.NavigationControlStyle.SMALL },
        mapTypeId: maps.MapTypeId.ROADMAP
    };
    const map = new maps.Map(mapcanvas, mapOptions);
    const marker = new maps.Marker({
        position: latlng,
        title: `You are here! (within a ${accuracy} meter radius)`,
        label: user
    });
    marker.setMap(map);
    fetch('/coords', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            lat: latitude,
            lng: longitude,
            user: user
        })
    })
        .then(o => o.text())
        .then(o => console.log('Server says ', o))
        .catch(console.error);
}
function error(msg) {
    statusEl.innerHTML = msg;
    statusEl.className = 'fail';
}
function getLocation() {
    finding.style.display = 'block';
    submit.style.display = 'none';
    statusEl.textContent = 'checking...';
    statusEl.className = '';
    if (geolocation) {
        geolocation.getCurrentPosition(success, (err) => error(err.message));
    }
    else {
        error('not supported');
    }
}
function findme() {
    username.value = localStorage.getItem('geoslack-username') || '';
    autoupdate.checked = localStorage.getItem('geoslack-autoupdate') === 'true';
    username.addEventListener('change', () => {
        localStorage.setItem('geoslack-username', username.value);
    });
    autoupdate.addEventListener('change', () => {
        localStorage.setItem('geoslack-autoupdate', autoupdate.checked.toString());
    });
    submit.addEventListener('click', () => {
        getLocation();
        setInterval(() => {
            if (autoupdate.checked) {
                getLocation();
            }
        }, 1000 * 60 * 10); // 10 minutes
    });
}
findme();
