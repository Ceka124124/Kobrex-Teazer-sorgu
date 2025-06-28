import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tc = searchParams.get("tc")

  if (!tc) {
    return NextResponse.json({ error: "TC kimlik numarası gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/tc.php?tc=${tc}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      mode: "cors",
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
    console.error("TC Sorgu API Error:", error)
    return NextResponse.json({ error: "API isteği başarısız oldu" }, { status: 500 })
  }
}
