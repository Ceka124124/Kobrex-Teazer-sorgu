import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tc = searchParams.get("tc")

    if (!tc) {
      return NextResponse.json({ error: "TC kimlik numarası gereklidir" }, { status: 400 })
    }

    if (tc.length !== 11 || !/^\d+$/.test(tc)) {
      return NextResponse.json({ error: "Geçerli bir TC kimlik numarası girin (11 haneli)" }, { status: 400 })
    }

    const apiUrl = "https://worlds-honolulu-starring-luggage.trycloudflare.com/okulno.php"
    const params = new URLSearchParams({ tc })

    const response = await fetch(`${apiUrl}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`)
    }

    const data = await response.text()

    try {
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch {
      return NextResponse.json({ result: data })
    }
  } catch (error: any) {
    console.error("Okul No API Error:", error)
    return NextResponse.json({ error: error.message || "Sorgu sırasında bir hata oluştu" }, { status: 500 })
  }
}
