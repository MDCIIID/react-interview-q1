import React, { useState, useEffect, useRef } from 'react';
import { getLocations, isNameValid } from '../mock-api/apis';
import { messages, formActions } from '../util/constants';

export default function NewForm(props) {
    // Using refs for primitives that don't need to be part of state and can be input refs
    const name = useRef(null);
    const country = useRef(null);

    // Stateful members
    const [roster, setRoster] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [validName, setValidity] = useState(true);
    const [error, setError] = useState(null);

    // Loading country select options
    useEffect(() => {
        async function fetchLocations() {
            try {
                const data = await getLocations();
                setCountryOptions(data);
            } catch (error) {
                setError(error);
            }
        }

        fetchLocations();
    }, []);

    // Handling click via event delegation switch to allow for more actions if needed later
    function handleClick(e) {
        e.preventDefault();
        const { id } = e.target;

        /*
        Expanded user feedback messages for names and duplicate entries in roster to give
        clearer information.
        */
        switch (id) {
            case formActions.addMember:
                // Check there is a name entered
                if (name.current.value == '') {
                    setError(messages.noName)
                    return;
                };

                // Don't allow the addition of an invalid name or roster member
                if (!validName) {
                    return;
                }

                const newMember = {
                    name: name.current.value,
                    country: country.current.value
                }

                setRoster([...roster, newMember]);
                clearFields();
                break;
            case formActions.clearMembers:
                clearFields();
                if (roster.length === 0) {
                    return;
                }
                setRoster([]);
                break;
        }
    }

    // Method to clear entry fields post addition to or clearing of roster
    function clearFields() {
        name.current.value = '';
        country.current.value = '';
        setError('');
        setValidity(true);
        document.getElementById('country').value = 'none selected';
    }

    // Handling change with event delegation switch, which can allow for additional checks if needed
    async function handleChange(e) {
        e.preventDefault();
        const { id, value } = e.target;

        const checkForRosterMemberDuplicates = () => {
            const memberIsDuplicate = (member) => {
                return (
                    member.name == name.current.value &&
                    member.country == country.current.value
                )
            }

            if (roster.some(memberIsDuplicate)) {
                setValidity(false);
                setError(messages.memberDuplicate);
            } else {
                setValidity(true);
            }

        }

        switch (id) {
            case 'name':
                const cName = name.current.value;

                // Instant check for duplicate in ui occurs before async name function
                checkForRosterMemberDuplicates();

                if (!await isNameValid(cName)) {
                    setValidity(false);
                    setError(messages.invalidName);
                }

                break;
            case 'country':
                // Check for duplicate member on country change too
                checkForRosterMemberDuplicates();
                break;
            default:
                break;
        }
    }

    /*
    Kept all of the form fields in the same file to avoid passing props around could easily 
    be changed in the future for added complexity
    */
    return (
        <div className="formContainer">
            <form action='/mock-endpoint'>
                <div className="fields">
                    <div className="nameInput">
                            <label htmlFor="name">Name </label>
                            <input
                                type="text"
                                id="name"
                                name="nameInput"
                                key="name"
                                className="nameField"
                                onChange={handleChange}
                                ref={name}
                            />
                    </div>
                    {!validName && <><div htmlFor="name" className="errorText">{error}</div></>}
                    <div className="country" key="country">
                        <label htmlFor="country">Location </label>
                        <select
                            id="country"
                            onChange={handleChange}
                            ref={country}
                        >
                            {/*Adding default option to fall back to on clear/add completion*/}
                            <option id="option-default" value='none selected'>Select a country</option>
                            {countryOptions.map((country, i) => {
                                return <option key={i} value={country} className='select-content'>{country}</option>
                            })}

                        </select>
                    </div>
                    <div className="buttonRow">
                        <button
                            className={formActions.clearMembers}
                            id={formActions.clearMembers}
                            onClick={handleClick}
                        >
                            Clear
                        </button>
                        <button
                            className={formActions.addMember}
                            id={formActions.addMember}
                            onClick={handleClick}
                        >
                            Add
                        </button>
                    </div>
                    <div className="roster" key="roster">
                        <table id="roster" name="rosterTable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Location </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roster != null && roster.map((member, i) => {
                                    const { name, country } = member
                                    return (<tr key={i}>
                                        <><td>{name}</td><td>{country}</td></>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
        </div>
    );
}
