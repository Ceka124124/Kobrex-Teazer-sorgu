"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Phone, AlertCircle, CheckCircle, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GSMSorguPage() {
  const [phone, setPhone] = useState("")
  const [tc, setTc] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceType = searchParams.get("type") || "gsm-tc"

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token) {
      router.push("/")
      return
    }

    const userData = {
      token,
      isPremium: token === "user123",
      premiumExpiry: "2025-07-08",
      username: token === "user123" ? "Premium Kullanıcı" : "Normal Kullanıcı",
    }
    setUser(userData)
  }, [router])

  const validatePhone = (phoneNo: string) => {
    const cleaned = phoneNo.replace(/\D/g, "")
    return cleaned.length === 11 && cleaned.startsWith("0")
  }

  const validateTC = (tcNo: string) => {
    if (tcNo.length !== 11) return false
    if (!/^\d+$/.test(tcNo)) return false
    if (tcNo[0] === "0") return false

    const digits = tcNo.split("").map(Number)
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7]
    const check1 = (sum1 * 7 - sum2) % 10
    const check2 = (sum1 + sum2 + digits[9]) % 10

    return check1 === digits[9] && check2 === digits[10]
  }

  const handleSearch = async () => {
    if (serviceType === "gsm-tc" && !phone) {
      setError("Telefon numarası giriniz")
      return
    }

    if (serviceType === "tc-gsm" && !tc) {
      setError("TC Kimlik numarası giriniz")
      return
    }

    if (serviceType === "gsm-tc" && !validatePhone(phone)) {
      setError("Geçersiz telefon numarası")
      return
    }

    if (serviceType === "tc-gsm" && !validateTC(tc)) {
      setError("Geçersiz TC Kimlik numarası")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      // API isteği
      const queryParam = serviceType === "gsm-tc" ? phone : tc
      const apiUrl =
        serviceType === "gsm-tc"
          ? `https://worlds-honolulu-starring-luggage.trycloudflare.com/gsmtc.php?gsm=${queryParam}`
          : `https://worlds-honolulu-starring-luggage.trycloudflare.com/tcgsm.php?tc=${queryParam}`

      // Simulated API response
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult = {
        success: true,
        data:
          serviceType === "gsm-tc"
            ? {
                phone: phone,
                tc: "12345678901",
                ad: "AHMET",
                soyad: "KAYA",
                operator: "TURKCELL",
                il: "ANKARA",
                ilce: "ÇANKAYA",
                kayitTarihi: "2020-05-15",
                durum: "AKTİF",
              }
            : {
                tc: tc,
                phones: [
                  { number: "05321234567", operator: "TURKCELL", durum: "AKTİF" },
                  { number: "05421234567", operator: "VODAFONE", durum: "AKTİF" },
                  { number: "05051234567", operator: "TÜRK TELEKOM", durum: "PASİF" },
                ],
                ad: "MEHMET",
                soyad: "YILMAZ",
              },
        timestamp: new Date().toISOString(),
      }

      setResult(mockResult)
    } catch (err) {
      setError("Sorgu sırasında bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="border-slate-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Phone className="w-6 h-6 text-green-500" />
              {serviceType === "gsm-tc" ? "GSM - TC Sorgu" : "TC - GSM Sorgu"}
            </h1>
            <p className="text-slate-400">
              {serviceType === "gsm-tc"
                ? "Telefon numarası ile kişi bilgilerini sorgulayın"
                : "TC ile telefon numaralarını sorgulayın"}
            </p>
          </div>
          <Badge variant="default" className="ml-auto bg-green-600">
            PREMIUM
          </Badge>
        </div>

        {/* Search Form */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {serviceType === "gsm-tc" ? "Telefon Numarası Sorgu" : "TC ile Telefon Sorgu"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceType === "gsm-tc" ? (
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Telefon Numarası</label>
                <Input
                  type="text"
                  placeholder="05xxxxxxxxx"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                    setPhone(value)
                    setError("")
                  }}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  maxLength={11}
                />
                {phone && phone.length === 11 && (
                  <p className={`text-xs mt-1 ${validatePhone(phone) ? "text-green-400" : "text-red-400"}`}>
                    {validatePhone(phone) ? "✓ Geçerli telefon format" : "✗ Geçersiz telefon format"}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="text-sm text-slate-300 mb-2 block">TC Kimlik Numarası</label>
                <Input
                  type="text"
                  placeholder="11 haneli TC kimlik numaranızı girin"
                  value={tc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
                    setTc(value)
                    setError("")
                  }}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  maxLength={11}
                />
                {tc && tc.length === 11 && (
                  <p className={`text-xs mt-1 ${validateTC(tc) ? "text-green-400" : "text-red-400"}`}>
                    {validateTC(tc) ? "✓ Geçerli TC format" : "✗ Geçersiz TC format"}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={
                isLoading || (serviceType === "gsm-tc" ? !phone || !validatePhone(phone) : !tc || !validateTC(tc))
              }
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sorgulanıyor...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Sorgu Başlat
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                Sorgu Sonucu
              </CardTitle>
              <p className="text-sm text-slate-400">
                Sorgu Zamanı: {new Date(result.timestamp).toLocaleString("tr-TR")}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="space-y-4">
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="formatted">Düzenli Görünüm</TabsTrigger>
                  <TabsTrigger value="json">JSON Görünüm</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted">
                  {serviceType === "gsm-tc" ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-400 border-b border-slate-600 pb-2">
                        Telefon Bilgileri
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Telefon:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{result.data.phone}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.data.phone)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">TC:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{result.data.tc}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(result.data.tc)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Ad Soyad:</span>
                          <span className="font-semibold">
                            {result.data.ad} {result.data.soyad}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Operatör:</span>
                          <Badge variant="outline">{result.data.operator}</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">İl:</span>
                          <span>{result.data.il}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">İlçe:</span>
                          <span>{result.data.ilce}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Kayıt Tarihi:</span>
                          <span>{new Date(result.data.kayitTarihi).toLocaleDateString("tr-TR")}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Durum:</span>
                          <Badge variant={result.data.durum === "AKTİF" ? "default" : "secondary"}>
                            {result.data.durum}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-400 border-b border-slate-600 pb-2">
                        Kişi Bilgileri
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">TC:</span>
                          <span className="font-mono">{result.data.tc}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300">Ad Soyad:</span>
                          <span className="font-semibold">
                            {result.data.ad} {result.data.soyad}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-green-400 border-b border-slate-600 pb-2">
                        Telefon Numaraları ({result.data.phones.length})
                      </h3>

                      <div className="space-y-3">
                        {result.data.phones.map((phoneData: any, index: number) => (
                          <div key={index} className="p-4 bg-slate-700 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-green-400" />
                                <span className="font-mono text-lg">{phoneData.number}</span>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(phoneData.number)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{phoneData.operator}</Badge>
                                <Badge variant={phoneData.durum === "AKTİF" ? "default" : "secondary"}>
                                  {phoneData.durum}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="json">
                  <div className="bg-slate-900 rounded-lg p-4 relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 border-slate-600 bg-transparent"
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Kopyala
                    </Button>
                    <pre className="text-sm text-green-400 overflow-x-auto pt-8">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
