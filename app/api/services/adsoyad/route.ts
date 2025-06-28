import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ad = searchParams.get("ad")
  const soyad = searchParams.get("soyad")

  if (!ad || !soyad) {
    return NextResponse.json({ error: "Ad ve soyad gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/adsoyad.php?ad=${encodeURIComponent(ad)}&soyad=${encodeURIComponent(soyad)}`

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
    console.error("Ad Soyad API Error:", error)
    return NextResponse.json({ error: "API isteği başarısız oldu" }, { status: 500 })
  }
}
