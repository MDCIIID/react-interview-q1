import React, {useEffect} from 'react';

export default function RosterTable(props) {
    const { roster } = props;

    useEffect(()=>{

    },[roster])

    return (
        <div className="roster" key="roster">
            <table id="roster" name="rosterTable">
                    <thead><tr><th>Name</th><th>Location</th></tr></thead>
                    <tbody>
                    {roster.map((member, i) => {
                        console.log('member:', member);
                        const [name, location] = member
                        return (<tr key={i}>
                            <><td>{name}</td><td>{location}</td></>
                        </tr>)
                    })}
                    </tbody>
            </table>
        </div>
    )
}
