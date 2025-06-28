import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const plaka = searchParams.get("plaka")

  if (!plaka) {
    return NextResponse.json({ error: "Plaka numarası gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/plaka.php?plaka=${encodeURIComponent(plaka)}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "ngrok-skip-browser-warning": "true",
      },
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error ${response.status}:`, errorText)

      const mockData = {
        success: true,
        plaka: plaka,
        marka: "TOYOTA",
        model: "COROLLA",
        yil: "2018",
        renk: "BEYAZ",
        motor_no: "1NR***",
        sasi_no: "NMT***",
        sahip_adi: "ÖRNEK KİŞİ",
        sahip_tc: "12345***901",
        il: "İSTANBUL",
        ilce: "KADIKÖY",
        note: "API'ye erişim sağlanamadı, örnek veri gösteriliyor",
      }
      return NextResponse.json(mockData)
    }

    const data = await response.text()

    try {
      const jsonData = JSON.parse(data)
      return NextResponse.json(jsonData)
    } catch {
      return NextResponse.json({
        success: true,
        result: data,
        raw_response: true,
      })
    }
  } catch (error: any) {
    console.error("Plaka Sorgu API Error:", error)

    const mockData = {
      success: true,
      plaka: plaka,
      marka: "TOYOTA",
      model: "COROLLA",
      yil: "2018",
      renk: "BEYAZ",
      motor_no: "1NR***",
      sasi_no: "NMT***",
      sahip_adi: "ÖRNEK KİŞİ",
      sahip_tc: "12345***901",
      il: "İSTANBUL",
      ilce: "KADIKÖY",
      error_note: "API bağlantı hatası, örnek veri gösteriliyor",
      original_error: error.message,
    }
    return NextResponse.json(mockData)
  }
}
