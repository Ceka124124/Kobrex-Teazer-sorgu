"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function AdminLogin() {
  const [adminToken, setAdminToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (adminToken === "admin123") {
      localStorage.setItem("adminToken", adminToken)
      router.push("/admin/dashboard")
    } else {
      alert("Geçersiz admin token!")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
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
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-slate-400">Admin token ile giriş yapın</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Admin Token</label>
              <Input
                type="password"
                placeholder="Admin tokeninizi girin..."
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Admin Girişi"}
            </Button>
          </div>

          <div className="text-center">
            <button onClick={() => router.push("/")} className="text-sm text-slate-400 hover:text-slate-300 underline">
              Ana sayfaya dön
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
