import {cookies} from "next/headers";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {BACKEND} from "@/app/poc/const";

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
    const response = await fetch(BACKEND + '/referral', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            question: 'hi hi hi hi hi',
            clinicalNotes: 'hi hi hi hi hi',
        }),
        credentials: 'include',
    })

    const jsonResponse = await response.json();

    const cookieStore = await cookies();

    const completeRes = {
        data: JSON.stringify(jsonResponse),
        cookie: ''
    }

    if (cookieStore.has('connect.sid')) {
        const connectSid = cookieStore.get('connect.sid') as RequestCookie;
        const connectSidStr = connectSid.name + '=' + connectSid.value;
        const followups = await fetch(BACKEND + '/followup-questions', {
            headers: {
                Cookie: connectSidStr
            },
            credentials: 'include',
            cache: 'no-cache',
            mode: 'cors',
        })
        const followupsJson = await followups.json();

        completeRes.cookie = connectSid.name + '=' + connectSid.value;
    }

    return JSON.stringify(completeRes.cookie);
}