import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const cookie = request.headers.get("cookie")

    const response = await fetch("https://assist-pc-backend-dev.onrender.com/ask-pathway-streamed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { "Cookie": cookie } : {}),
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok || !response.body) {
      return NextResponse.json({ message: "Network response was not ok or body is null" }, { status: 500 })
    }

    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

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

    const responseHeaders: HeadersInit = {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }

    return new NextResponse(readable, {
      status: 200,
      headers: responseHeaders,
    })

  } catch (error) {
    console.error("Error in ask-pathway-streamed:", error)
    return NextResponse.json({ message: "Error during streaming", error }, { status: 500 })
  }
}
