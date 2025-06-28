import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gsm = searchParams.get("gsm")

  if (!gsm) {
    return NextResponse.json({ error: "GSM numarası gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/gsmtc.php?gsm=${gsm}`
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
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
    console.error("GSM-TC Sorgu API Error:", error)
    return NextResponse.json({ error: "API isteği başarısız oldu" }, { status: 500 })
  }
}
