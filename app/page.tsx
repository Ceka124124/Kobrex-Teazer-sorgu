"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Zap, Gift, UserPlus } from "lucide-react"

export default function LoginPage() {
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // URL'den referral kodunu al
    const ref = searchParams.get("ref")
    if (ref) {
      setReferralCode(ref)
    }
  }, [searchParams])

  const handleLogin = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (token) {
      // Eğer referral kodu varsa, davet eden kişinin istatistiklerini güncelle
      if (referralCode && referralCode !== token) {
        const inviteKey = `invites_${referralCode}`
        const existingInvites = localStorage.getItem(inviteKey)

        if (existingInvites) {
          const inviteData = JSON.parse(existingInvites)
          const updatedInviteData = {
            ...inviteData,
            invited: inviteData.invited + 1,
          }
          localStorage.setItem(inviteKey, JSON.stringify(updatedInviteData))
        } else {
          // İlk davet
          localStorage.setItem(inviteKey, JSON.stringify({ invited: 1, premiumEarned: false }))
        }

        // Davet edilen kullanıcının referral bilgisini kaydet
        localStorage.setItem(`referred_by_${token}`, referralCode)
      }

      localStorage.setItem("userToken", token)
      router.push("/dashboard")
    }

    setIsLoading(false)
  }

  const handleFreeAccess = () => {
    const freeToken = "free_user"

    // Eğer referral kodu varsa, davet eden kişinin istatistiklerini güncelle
    if (referralCode && referralCode !== freeToken) {
      const inviteKey = `invites_${referralCode}`
      const existingInvites = localStorage.getItem(inviteKey)

      if (existingInvites) {
        const inviteData = JSON.parse(existingInvites)
        const updatedInviteData = {
          ...inviteData,
          invited: inviteData.invited + 1,
        }
        localStorage.setItem(inviteKey, JSON.stringify(updatedInviteData))
      } else {
        // İlk davet
        localStorage.setItem(inviteKey, JSON.stringify({ invited: 1, premiumEarned: false }))
      }

      // Davet edilen kullanıcının referral bilgisini kaydet
      localStorage.setItem(`referred_by_${freeToken}`, referralCode)
    }

    localStorage.setItem("userToken", freeToken)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm relative z-10">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Teazer-Kobrex Panel</h1>
              <p className="text-slate-400">Token ile giriş yapın</p>
            </div>
          </div>

          {/* Referral Notification */}
          {referralCode && (
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Davet Edildiniz!</span>
              </div>
              <p className="text-sm text-slate-300">
                Bir arkadaşınız sizi Teazer-Kobrex Panel'e davet etti. Kayıt olduğunuzda arkadaşınız Premium üyeliğe bir adım
                daha yaklaşacak!
              </p>
              <Badge variant="outline" className="border-purple-500 text-purple-400 mt-2">
                Referral: {referralCode}
              </Badge>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Access Token</label>
              <Input
                type="text"
                placeholder="Tokeninizi girin..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">VEYA</span>
              </div>
            </div>

            <Button
              onClick={handleFreeAccess}
              variant="outline"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-medium py-3"
            >
              <Zap className="w-4 h-4 mr-2" />
              Ücretsiz Giriş
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              Admin paneli için{" "}
              <button onClick={() => router.push("/admin")} className="text-cyan-400 hover:text-cyan-300 underline">
                tıklayın
              </button>
            </p>

            {!referralCode && (
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">Arkadaşlarını Davet Et!</span>
                </div>
                <p className="text-xs text-slate-400">3 arkadaşını davet et, ücretsiz Premium üyelik kazan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
