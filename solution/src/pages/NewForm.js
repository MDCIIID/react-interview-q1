import React, {useState, useEffect, useRef} from 'react';
import LocationSelect from '../components/LocationSelect'
import RosterTable from '../components/RosterTable';
import { getLocations, isNameValid } from '../mock-api/apis';
import { messages, formActions, formFields } from '../util/constants';

export default function NewForm(props) {
    const name = useRef(null);
    const location = useRef(null);
    const newRoster = useRef([]);
    const [roster, setRosterData] = useState([]);
    const [validName, setValidity] = useState(true);

    function handleClick(e) {
        const { id } = e.target;
        console.log('target: ', name);

        switch (id) {
            case formActions.addMember:
                console.log('clicked to add member!');
                const newMember = [name.current.value, location.current.value];
                roster.push(newMember)
                break;
            case formActions.clearMembers:
                console.log('clearing members!');
                while (roster.length > 0) {roster.pop()}
                break;
        }
    }

    async function handleChange(e) {
        const { id, value } = e.target;
        console.log("change happened");

        switch (id) {
            case 'name':
                setValidity(await isNameValid(name.current.value));
                break;
            case 'location':
                console.log("location updated");
                break;
        }  
        console.log('name: ', name.current.value, "\nlocation: ", location.current.value)
    }

    return (
    <div className="formContainer">
        <form action='/mock-endpoint'>
            <ul className="fields">
                <div className="nameInput">
                    <label htmlFor="name">Name </label>
                    <input 
                        type="text"
                        id="name"
                        name="nameInput"
                        ref={name}
                        key="name"
                        onChange={handleChange}
                    />
                    {!validName && (<div className="invalidName">{messages.nameTaken}</div>)}
                </div>
                <div className="location">
                    <LocationSelect locationRef={location} onChange={handleChange}/>
                    <div className="buttonRow">
                        <button
                            className={formActions.addMember}
                            id={formActions.addMember}
                            onClick={handleClick}
                        >
                        Add
                        </button>

                        <button
                            className={formActions.clearMembers}
                            id={formActions.clearMembers}
                            onClick={handleClick}
                        >
                        Clear
                        </button>
                    </div>
                </div>
                <RosterTable roster={roster} onClick={handleClick} />
            </ul>
        </form>
    </div>
    );
}
