"use client"
import {FormEvent, useState} from "react";
import {BACKEND} from "@/app/poc/const";

export default function Home() {
    const [data, setData] = useState<Record<string, unknown>>({});
    const [followups, setFollowups] = useState("");

    const fetchData = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch(BACKEND + '/referral-streamed', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                question: formData.get('question'),
                clinicalNotes: formData.get('clinicalNotes'),
            }),
            credentials: "include"
        })
         if (!response.body) {
           throw new Error("Response body is null");
         }
         const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
  
        if (value) {
          buffer += decoder.decode(value, { stream: true })
  
          // Process any complete SSE messages in the buffer
          const parts = buffer.split("\n\n")
          buffer = parts.pop() || ""  // Keep any incomplete chunk in buffer
  
          for (const part of parts) {
            const lines = part.split("\n")
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const jsonStr = line.replace("data:", "").trim()
                try {
                  const parsed = JSON.parse(jsonStr)
                  setData((prev) => ({
                    ...(prev || {}),
                    ...parsed,
                  }))
                } catch (err) {
                  console.warn("Invalid JSON in data:", err)
                }
              }
            }
          }
        }
      }
    };

    const getFollowups = async () => {
        const response = await fetch(BACKEND + '/followup-questions', {credentials: 'include'})

        // Handle response if necessary
        const responseJson = await response.json()
        setFollowups(JSON.stringify(responseJson));
    };

    return (
        <div>
            <form onSubmit={fetchData}>
                <input type="text" name="question" />
                <input type="text" name="clinicalNotes" />
                <button type="submit">Submit</button>
            </form>

            <p>{JSON.stringify(data)}</p>

            <div>
                <button type="button" onClick={getFollowups}>Get followup questions</button>
            </div>

            <p>{followups}</p>
        </div>
    );
}
