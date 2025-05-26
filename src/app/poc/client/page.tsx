"use client"
import {FormEvent, useState} from "react";

export default function Home() {
    const [data, setData] = useState("");
    const [followups, setFollowups] = useState("");

    const fetchData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch(process.env.BACKEND + '/referral', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                question: formData.get('question'),
                clinicalNotes: formData.get('clinicalNotes'),
            })
        })

        console.log(response.headers.getSetCookie())
        const responseJson = await response.json()
        // Handle response if necessary
        setData(JSON.stringify(responseJson))
    };

    const getFollowups = async () => {
        const response = await fetch(process.env.BACKEND + '/followup-questions', {credentials: 'include'})

        // Handle response if necessary
        const responseJson = await response.json()
        setFollowups(JSON.stringify(responseJson));
    };

    console.log(data);
    return (
        <div>
            <form onSubmit={fetchData}>
                <input type="text" name="question" />
                <input type="text" name="clinicalNotes" />
                <button type="submit">Submit</button>
            </form>

            <p>{data}</p>

            <div>
                <button type="button" onClick={getFollowups}>Get followup questions</button>
            </div>

            <p>{followups}</p>
        </div>
    );
}
