import React, { useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import './main.css'


const center = { lat: 26.8467, lng: 80.9462 }

function Main() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    })

    const [directionsRespoance, setDirectionsRespoance] = useState(null);
    const [distance, setdistance] = useState(0);

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    function handleClick() {
        setOrigin(originref.current.value.substring(0, originref.current.value.indexOf(',')));
        setDestination(destinationref.current.value.substring(0, destinationref.current.value.indexOf(',')));
    }

    const originref = useRef();

    const destinationref = useRef();


    if (!isLoaded) {
        return <h1>Loading</h1>
    }

    async function calRoute() {
        if (originref.current.value === '' || destinationref.current.value === '') {
            return;
        }
        // eslint-disable-next-line no-undef
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
            origin: originref.current.value,
            destination: destinationref.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING
        })
        setDirectionsRespoance(results);
        setdistance(results.routes[0].legs[0].distance.text);
        clearRoute();
    }

    function clearRoute() {
        originref.current.value = '';
        destinationref.current.value = '';
    }

    function clearRoute2() {
        setdistance(0);
        document.getElementById('resultpara').style.display = "none";
    }


    function showResult() {
        document.getElementById('resultpara').style.display = "block";
    }

    // Autocomplete
    let autocomplete;
    function initAutocomplete() {
        autocomplete = new window.google.maps.places.Autocomplete(originref.current);

        autocomplete.setFields(['address_component', 'geometry']);
        autocomplete.addListener('place_changed', onPlaceChanged);
    }
    function onPlaceChanged() {
        var place = autocomplete.getPlace();
        console.log(place);
        if (!place.address_component) {
            document.getElementById('autocomplete').placeholder = 'Enter a location';
        } else {
            document.getElementById('details').innerHTML = place.name;
        }
    }

    let autocomplete2;
    function initAutocomplete2() {
        autocomplete2 = new window.google.maps.places.Autocomplete(
            document.getElementById('autocomplete2'), {
            type: ['establishment'],
            componentRestrictions: { 'country': ['AU'] },
            fields: ['address_component', 'place_id', 'geometry', 'name']
        }
        );
        autocomplete2.addListener('place_changed', onPlaceChanged2);
    }

    function onPlaceChanged2() {
        var place = autocomplete2.getPlace();
        if (!place.geometry) {
            document.getElementById('autocomplete2').placeholder = 'Enter a location';
        } else {
            document.getElementById('details').innerHTML = place.name;
        }
    }





    const hello = origin && destination;
    return (
        <div className='main'>
            <p className='para1' >Let's Calculate&nbsp;<b> distance </b>&nbsp;from Google Maps</p>
            <div className="container">
                <div className="left"  >
                    <div >
                        <label htmlFor=""  > <small >Origin</small> </label>
                    </div>
                    <div style={{ background: "white", display: 'flex', height: '6.8vh', width: '250px', border: "2px solid rgb(242, 240, 235)" }}>
                        <i class="fa-solid fa-location-dot" style={{ fontSize: '2rem', color: 'red', marginTop: '8px', marginLeft: '8px' }} />
                        <Autocomplete>
                            <input className='userinpt' id='autocomplete' type="text" ref={originref} onChange={initAutocomplete()} onClick={clearRoute2} />
                        </Autocomplete>
                    </div>


                    <button className='btn' type='submit' onClick={() => { calRoute(); showResult(); handleClick(); }}>Calculate</button>
                    <div >
                        <label htmlFor=""  > <small >Destination</small> </label>
                    </div>
                    <div style={{ background: "white", display: 'flex', height: '6.8vh', width: '250px', border: "2px solid rgb(242, 240, 235)" }}>
                        <i class="fa-solid fa-location-dot" style={{ fontSize: '2rem', color: 'red', marginTop: '8px', marginLeft: '8px' }} />
                        <Autocomplete>
                            <input className='userinpt' id='autocomplete' type="text" ref={destinationref} onChange={initAutocomplete2()} onClick={clearRoute2} />
                        </Autocomplete>
                    </div>
                    <div >
                        <div className='result'>
                            <p>
                                Distance
                            </p>
                            <p style={{ color: " rgb(120, 201, 241)", fontSize: '1.8rem', fontWeight: "bold" }}>
                                {distance}
                            </p>
                        </div>
                        <div id="resultpara">

                            {hello && <p className='para2'> The distance between &nbsp;<b>{origin}</b>&nbsp;and&nbsp;<b>{destination}</b>&nbsp;is&nbsp;<b >{distance} </b>&nbsp;</p>}
                        </div>
                    </div>

                </div>
                <div className="right">
                    <GoogleMap center={center} zoom={15} mapContainerStyle={{ width: '100%', height: '100%' }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false
                        }}

                    >
                        <Marker position={center} />
                        {
                            directionsRespoance && <DirectionsRenderer directions={directionsRespoance} />
                        }
                    </GoogleMap>
                </div>

            </div>
        </div>
    )
}

export default Main;