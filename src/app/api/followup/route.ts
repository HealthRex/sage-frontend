import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Extract cookie from client request headers
    const cookie = request.headers.get("cookie")

    const response = await fetch("https://api-dev.sageconsult.ai/followup-questions", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { "Cookie": cookie } : {}),
      },
    })

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch follow-up questions" }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json(data, {
      status: 200,
    })

  } catch (error) {
    console.error("Error fetching follow-up suggestions:", error)
    return NextResponse.json({ message: "Error fetching suggestions", error }, { status: 500 })
  }
}
