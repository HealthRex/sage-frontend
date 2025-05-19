import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()

    const response = await fetch("https://assist-pc-backend-dev.onrender.com/referral-streamed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok || !response.body) {
      return NextResponse.json({ message: "Network response was not ok or body is null" }, { status: 500 })
    }

    // Setup a TransformStream to forward chunks to client
    const { readable, writable } = new TransformStream()

    const writer = writable.getWriter()
    const reader = response.body.getReader()

    const decoder = new TextDecoder()

    // Stream chunks from backend to frontend
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        await writer.write(new TextEncoder().encode(text))
      }
      await writer.close()
    }

    pump()

    return new NextResponse(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error during streaming:", error)
    return NextResponse.json({ message: "Error during streaming", error }, { status: 500 })
  }
}