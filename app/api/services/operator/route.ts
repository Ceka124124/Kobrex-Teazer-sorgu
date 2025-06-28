import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gsm = searchParams.get("gsm")

    if (!gsm) {
      return NextResponse.json({ error: "GSM numarası gereklidir" }, { status: 400 })
    }

    // GSM numarası validasyonu
    const cleanGsm = gsm.replace(/\D/g, "")
    if (cleanGsm.length !== 11 || !cleanGsm.startsWith("5")) {
      return NextResponse.json({ error: "Geçerli bir GSM numarası girin (5xxxxxxxxx)" }, { status: 400 })
    }

    const apiUrl = "https://worlds-honolulu-starring-luggage.trycloudflare.com/operator.php"
    const params = new URLSearchParams({ gsm: cleanGsm })

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
    console.error("Operator API Error:", error)
    return NextResponse.json({ error: error.message || "Sorgu sırasında bir hata oluştu" }, { status: 500 })
  }
}
