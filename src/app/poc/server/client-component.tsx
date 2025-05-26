'use client';
import {useState} from 'react';

export default function ClientComponent() {
    const [followups, setFollowups] = useState("");
    const getFollowups = async () => {
        const response = await fetch(process.env.BACKEND + '/followup-questions', {
            credentials: 'include'
        })

        // Handle response if necessary
        const responseJson = await response.json();
        console.log(responseJson);
        setFollowups(JSON.stringify(responseJson));
    };

    return (
        <div>
            <div>
                <button type="button" onClick={getFollowups}>Get followup questions</button>
            </div>

            <p>{followups}</p>
        </div>
    );
}