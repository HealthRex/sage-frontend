import {cookies} from "next/headers";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";

export default function ServerComponent() {
    const res = fetchDataFromApi(); // Fetch data from third-party API
    return (
        <div>
            <h2>Data from API</h2>
            <p>{res}</p>
        </div>
    );
}

export async function fetchDataFromApi() {
    const response = await fetch(process.env.BACKEND + '/referral', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            question: 'hi hi hi hi hi',
            clinicalNotes: 'hi hi hi hi hi',
        }),
        credentials: 'include',
    })

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    const cookieStore = await cookies();
    console.log(cookieStore.getAll());

    const completeRes = {
        data: JSON.stringify(jsonResponse),
        cookie: ''
    }

    if (cookieStore.has('connect.sid')) {
        const connectSid = cookieStore.get('connect.sid') as RequestCookie;
        const connectSidStr = connectSid.name + '=' + connectSid.value;
        console.log(connectSidStr);
        const followups = await fetch(process.env.BACKEND + '/followup-questions', {
            headers: {
                Cookie: connectSidStr
            },
            credentials: 'include',
            cache: 'no-cache',
            mode: 'cors',
        })
        const followupsJson = await followups.json();
        console.log(followupsJson)

        completeRes.cookie = connectSid.name + '=' + connectSid.value;
    }

    return JSON.stringify(completeRes.cookie);
}