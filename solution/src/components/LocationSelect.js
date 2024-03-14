import React, {useEffect, useState} from 'react';
import { getLocations } from '../mock-api/apis';

export default function LocationSelect(props) {
    const [locations, setLocations] = useState([]);
    const { onChange, locationRef } = props;

    useEffect(() => {
        async function fetchLocations() {
            try {
                console.log('fetch beginning')
                const data = await getLocations();
                console.log('data: ', data);
                setLocations(data);
            } catch (error) {
                console.error(error);
            }

        }

        fetchLocations();
    }, []);

    return (
        <div key="location">
            <label htmlFor="location">Location </label>
            <select
                className="optionsDropdown"
                id="location"
                onChange={onChange}
                ref={locationRef}
            >
            <option id="option-default" value="default">Select location...</option>
            {locations.map((loc, i) => {
                return <option key={i} value={loc}>{loc}</option>
            })}

            </select>
        </div>
    )
}
