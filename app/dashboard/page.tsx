"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Users,
  MapPin,
  Home,
  Phone,
  Car,
  Shield,
  Building,
  CreditCard,
  MessageSquare,
  Globe,
  School,
  Smile,
  Crown,
  Heart,
  Search,
} from "lucide-react"
import { getUserData } from "@/lib/user-utils"

const services = [
  // Temel Sorgular
  {
    id: "tc",
    name: "TC Sorgu",
    description: "TC kimlik numarası ile temel bilgi sorgusu",
    icon: User,
    category: "Temel",
    premium: true,
    path: "/dashboard/services/tc",
  },
  {
    id: "tc-pro",
    name: "TC PRO",
    description: "TC kimlik numarası ile detaylı bilgi sorgusu",
    icon: Shield,
    category: "Temel",
    premium: true,
    path: "/dashboard/services/tc-pro",
  },
  {
    id: "ad-soyad",
    name: "Ad Soyad",
    description: "Ad ve soyad ile kişi bilgisi sorgusu",
    icon: Users,
    category: "Temel",
    premium: true,
    path: "/dashboard/services/ad-soyad",
  },

  // Adres Sorguları
  {
    id: "adres",
    name: "Adres",
    description: "TC ile adres bilgisi sorgusu",
    icon: MapPin,
    category: "Adres",
    premium: true,
    path: "/dashboard/services/adres",
  },
  {
    id: "hane",
    name: "Hane",
    description: "TC ile hane halkı bilgisi sorgusu",
    icon: Home,
    category: "Adres",
    premium: true,
    path: "/dashboard/services/hane",
  },
  {
    id: "ad-soyad-il",
    name: "Ad Soyad İl",
    description: "Ad, soyad ve il ile sorgu",
    icon: Users,
    category: "Adres",
    premium: true,
    path: "/dashboard/services/ad-soyad-il",
  },
  // Aile Sorguları
  {
    id: "aile",
    name: "Aile",
    description: "TC ile aile bilgisi sorgusu",
    icon: Heart,
    category: "Aile",
    premium: true,
    path: "/dashboard/services/aile",
  },
  {
    id: "sulale",
    name: "Sülale",
    description: "TC ile sülale bilgisi sorgusu",
    icon: Crown,
    category: "Aile",
    premium: true,
    path: "/dashboard/services/sulale",
  },

  // GSM Sorguları
  {
    id: "gsm-tc",
    name: "GSM-TC",
    description: "GSM numarası ile TC sorgusu",
    icon: Phone,
    category: "GSM",
    premium: true,
    path: "/dashboard/services/gsm-tc",
  },
  {
    id: "tc-gsm",
    name: "TC-GSM",
    description: "TC ile GSM numarası sorgusu",
    icon: Phone,
    category: "GSM",
    premium: true,
    path: "/dashboard/services/tc-gsm",
  },
  {
    id: "operator",
    name: "Operatör",
    description: "GSM operatör bilgisi sorgusu",
    icon: Phone,
    category: "GSM",
    premium: false,
    path: "/dashboard/services/operator",
  },

  // Resmi Sorgular
  {
    id: "tapu",
    name: "Tapu",
    description: "TC ile tapu bilgisi sorgusu",
    icon: Building,
    category: "Resmi",
    premium: true,
    path: "/dashboard/services/tapu",
  },
  {
    id: "sgk",
    name: "SGK",
    description: "TC ile SGK bilgisi sorgusu",
    icon: Building,
    category: "Resmi",
    premium: true,
    path: "/dashboard/services/sgk",
  },
  {
    id: "plaka",
    name: "Plaka",
    description: "Plaka ile araç bilgisi sorgusu",
    icon: Car,
    category: "Resmi",
    premium: false,
    path: "/dashboard/services/plaka",
  },

  // Finans Sorguları
  {
    id: "ininal",
    name: "İninal",
    description: "İninal numarası ile bilgi sorgusu",
    icon: CreditCard,
    category: "Finans",
    premium: true,
    path: "/dashboard/services/ininal",
  },

  // Özel Sorgular
  {
    id: "okulno",
    name: "Okul No",
    description: "TC ile okul numarası sorgusu",
    icon: School,
    category: "Özel",
    premium: true,
    path: "/dashboard/services/okulno",
  },
  {
    id: "log",
    name: "Log",
    description: "Website log bilgisi sorgusu",
    icon: Globe,
    category: "Özel",
    premium: true,
    path: "/dashboard/services/log",
  },

  // Eğlence
  {
    id: "gpt",
    name: "Chat GPT",
    description: "AI ile sohbet",
    icon: MessageSquare,
    category: "Eğlence",
    premium: false,
    path: "/dashboard/services/gpt",
  }
]

const categories = ["Temel", "Adres", "Aile", "GSM", "Resmi", "Finans", "Özel", "Eğlence"]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token) {
      router.push("/")
      return
    }

    const userData = getUserData(token)
    if (!userData) {
      router.push("/")
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Teazer-Kobrex Panel
              </h1>
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                v2.0
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">Hoş geldin,</p>
                <p className="font-semibold">{user?.username || "Kullanıcı"}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-purple-600">
                  {(user?.username || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge variant={user?.isPremium ? "default" : "secondary"}>
                {user?.isPremium ? "PREMIUM" : "ÜCRETSİZ"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Search className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{services.length}</p>
                  <p className="text-slate-400 text-sm">Toplam Servis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{services.filter((s) => s.premium).length}</p>
                  <p className="text-slate-400 text-sm">Premium Servis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{services.filter((s) => !s.premium).length}</p>
                  <p className="text-slate-400 text-sm">Ücretsiz Servis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Heart className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-slate-400 text-sm">Kategori</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services by Category */}
        {categories.map((category) => {
          const categoryServices = services.filter((service) => service.category === category)

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <Badge variant="outline" className="border-slate-600">
                  {categoryServices.length} servis
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryServices.map((service) => {
                  const Icon = service.icon
                  const canAccess = !service.premium || user?.isPremium

                  return (
                    <Card
                      key={service.id}
                      className={`bg-slate-800 border-slate-700 transition-all duration-200 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 ${
                        !canAccess ? "opacity-60" : "cursor-pointer"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${service.premium ? "bg-purple-500/20" : "bg-green-500/20"}`}
                            >
                              <Icon className={`w-5 h-5 ${service.premium ? "text-purple-400" : "text-green-400"}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                            </div>
                          </div>
                          <Badge variant={service.premium ? "default" : "secondary"} className="text-xs">
                            {service.premium ? "💎" : "🆓"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                          disabled={!canAccess}
                          onClick={() => canAccess && router.push(service.path)}
                        >
                          {canAccess ? "Kullan" : "Premium Gerekli"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
