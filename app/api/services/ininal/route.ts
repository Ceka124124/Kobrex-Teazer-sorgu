import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ininal_no = searchParams.get("ininal_no")

    if (!ininal_no) {
      return NextResponse.json({ error: "İninal numarası gereklidir" }, { status: 400 })
    }

    const apiUrl = "https://worlds-honolulu-starring-luggage.trycloudflare.com/ininal.php"
    const params = new URLSearchParams({ ininal_no })

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
    console.error("İninal API Error:", error)
    return NextResponse.json({ error: error.message || "Sorgu sırasında bir hata oluştu" }, { status: 500 })
  }
}
