import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ad = searchParams.get("ad")
  const soyad = searchParams.get("soyad")
  const il = searchParams.get("il") || ""
  const ilce = searchParams.get("ilce") || ""

  if (!ad || !soyad) {
    return NextResponse.json({ error: "Ad ve soyad gerekli" }, { status: 400 })
  }

  try {
    const apiUrl = `https://worlds-honolulu-starring-luggage.trycloudflare.com/adsoyadsorgu.php`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error ${response.status}:`, errorText)

      const mockData = {
        success: true,
        results: [
          {
            tc: "12345678901",
            ad: ad,
            soyad: soyad,
            dogum_tarihi: "1985-03-15",
            dogum_yeri: il || "İSTANBUL",
            il: il || "İSTANBUL",
            ilce: ilce || "KADIKÖY",
            anne_adi: "ANNE ADI",
            baba_adi: "BABA ADI",
          },
          {
            tc: "12345678902",
            ad: ad,
            soyad: soyad,
            dogum_tarihi: "1990-07-22",
            dogum_yeri: il || "ANKARA",
            il: il || "ANKARA",
            ilce: ilce || "ÇANKAYA",
            anne_adi: "ANNE ADI 2",
            baba_adi: "BABA ADI 2",
          },
        ],
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
    console.error("Ad Soyad Sorgu API Error:", error)

    const mockData = {
      success: true,
      results: [
        {
          tc: "12345678901",
          ad: ad,
          soyad: soyad,
          dogum_tarihi: "1985-03-15",
          dogum_yeri: il || "İSTANBUL",
          il: il || "İSTANBUL",
          ilce: ilce || "KADIKÖY",
          anne_adi: "ANNE ADI",
          baba_adi: "BABA ADI",
        },
      ],
      error_note: "API bağlantı hatası, örnek veri gösteriliyor",
      original_error: error.message,
    }
    return NextResponse.json(mockData)
  }
}
