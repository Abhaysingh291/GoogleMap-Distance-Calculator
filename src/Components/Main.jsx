import React, { useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import './main.css'


const center = { lat:26.8467, lng: 80.9462 }

function Main() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    })

    const [map, setMap] = useState(null);
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
    function showResult() {
        document.getElementById('resultpara').style.display = "block";
    }
    const hello = origin && destination;
    return (
        <div className='main'>
            <p className='para1' >Let's Calculate&nbsp;<b> distance </b>&nbsp;from Google Maps</p>
            <div className="container">
                <div className="left"  >
                    <label htmlFor=""> <small>Origin</small> </label>
                    <Autocomplete>
                        <input className='userinpt' type="text" ref={originref} />
                    </Autocomplete>

                    <button className='btn' type='submit' onClick={() => { calRoute(); showResult(); handleClick(); }}>Calculate</button>

                    <label htmlFor=""> <small> Destination</small></label>
                    <Autocomplete>
                        <input className='userinpt' type="text" ref={destinationref} />
                    </Autocomplete>
                    <div >
                        <div className='result'>
                            <p>
                                Distance
                            </p>
                            <p style={{ color: "blue", fontSize: '2rem', fontWeight: "bold" }}>
                                {distance}
                            </p>
                        </div>
                        <div id="resultpara">

                            {hello && <p className='para2'> The distance between &nbsp;<b> {origin}</b>&nbsp; and &nbsp;<b> {destination}</b>&nbsp; is &nbsp;<b >{distance} </b>&nbsp;</p>}
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
                        onLoad={(map) => setMap(map)}
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