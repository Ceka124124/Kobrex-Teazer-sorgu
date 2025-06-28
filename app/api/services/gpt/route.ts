import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const question = searchParams.get("question")

  if (!question) {
    return NextResponse.json({ error: "Soru gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/gpt.php?question=${encodeURIComponent(question)}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.text()

    try {
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch {
      return NextResponse.json({ result: data })
    }
  } catch (error: any) {
    console.error("GPT API Error:", error)
    return NextResponse.json({ error: "API isteği başarısız oldu" }, { status: 500 })
  }
}
