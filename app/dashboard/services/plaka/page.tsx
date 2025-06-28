"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Car, AlertCircle, CheckCircle, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlakaSorguPage() {
  const [plaka, setPlaka] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token) {
      router.push("/")
      return
    }

    // Token'a göre kullanıcı verilerini belirle
    let userData
    if (token === "user123") {
      userData = {
        token,
        isPremium: true,
        premiumExpiry: "2025-07-08",
        username: "Premium Kullanıcı",
      }
    } else if (token === "admin123") {
      userData = {
        token,
        isPremium: true,
        premiumExpiry: "2025-12-31",
        username: "Admin Kullanıcı",
      }
    } else if (token === "free_user") {
      userData = {
        token,
        isPremium: false,
        premiumExpiry: null,
        username: "Ücretsiz Kullanıcı",
      }
    } else {
      // Diğer tokenlar için premium varsayalım
      userData = {
        token,
        isPremium: true,
        premiumExpiry: "2025-12-31",
        username: "Premium Kullanıcı",
      }
    }

    setUser(userData)
  }, [router])

  const validatePlaka = (plakaNo: string) => {
    // Türk plaka formatı: 34 ABC 1234 veya 34 AB 1234
    const plakaRegex = /^[0-9]{2}\s?[A-Z]{2,3}\s?[0-9]{2,4}$/
    return plakaRegex.test(plakaNo.toUpperCase().replace(/\s/g, ""))
  }

  const handleSearch = async () => {
    if (!plaka) {
      setError("Plaka numarası giriniz")
      return
    }

    const cleanPlaka = plaka.toUpperCase().replace(/\s/g, "")
    if (!validatePlaka(cleanPlaka)) {
      setError("Geçersiz plaka formatı (Örnek: 34 ABC 1234)")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`/api/services/plaka?plaka=${encodeURIComponent(cleanPlaka)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API hatası")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "Sorgu sırasında bir hata oluştu")
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
              <Car className="w-6 h-6 text-orange-500" />
              Plaka Sorgu
            </h1>
            <p className="text-slate-400">Araç plakası ile araç ve sahip bilgilerini sorgulayın</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            ÜCRETSİZ
          </Badge>
        </div>

        {/* Search Form */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Plaka Sorgu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Plaka Numarası</label>
              <Input
                type="text"
                placeholder="34 ABC 1234"
                value={plaka}
                onChange={(e) => {
                  setPlaka(e.target.value.toUpperCase())
                  setError("")
                }}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              {plaka && (
                <p className={`text-xs mt-1 ${validatePlaka(plaka) ? "text-green-400" : "text-red-400"}`}>
                  {validatePlaka(plaka) ? "✓ Geçerli plaka format" : "✗ Geçersiz plaka format"}
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={isLoading || !plaka || !validatePlaka(plaka)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
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
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="space-y-4">
                <TabsList className="bg-slate-700">
                  <TabsTrigger value="formatted">Düzenli Görünüm</TabsTrigger>
                  <TabsTrigger value="json">JSON Görünüm</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted">
                  <div className="space-y-4">
                    {typeof result === "object" && result !== null ? (
                      Object.entries(result).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-300 capitalize">{key.replace(/_/g, " ")}:</span>
                          <div className="flex items-center gap-2">
                            <span>{String(value)}</span>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(String(value))}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-700 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">{String(result)}</pre>
                      </div>
                    )}
                  </div>
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
