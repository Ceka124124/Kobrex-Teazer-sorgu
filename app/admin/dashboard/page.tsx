"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, Calendar, Plus, Trash2, Shield, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [newUser, setNewUser] = useState({ token: "", isPremium: false, premiumExpiry: "" })
  const router = useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
      return
    }

    // Load initial users
    const initialUsers = [
      {
        id: "1",
        token: "user123",
        isPremium: true,
        premiumExpiry: "2025-07-08",
        username: "Premium Kullanıcı",
        joinDate: "2024-01-15",
      },
      {
        id: "2",
        token: "user456",
        isPremium: false,
        premiumExpiry: null,
        username: "Normal Kullanıcı",
        joinDate: "2024-03-20",
      },
    ]
    setUsers(initialUsers)
  }, [router])

  const addUser = () => {
    if (!newUser.token) return

    const user = {
      id: Date.now().toString(),
      ...newUser,
      username: `Kullanıcı ${users.length + 1}`,
      joinDate: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, user])
    setNewUser({ token: "", isPremium: false, premiumExpiry: "" })
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const togglePremium = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              isPremium: !user.isPremium,
              premiumExpiry: !user.isPremium ? "2025-12-31" : null,
            }
          : user,
      ),
    )
  }

  const getDaysLeft = (expiry: string) => {
    if (!expiry) return 0
    const today = new Date()
    const expiryDate = new Date(expiry)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-500" />
              Admin Panel
            </h1>
            <p className="text-slate-400">Kullanıcı ve premium yönetimi</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("adminToken")
              router.push("/admin")
            }}
            className="border-slate-600"
          >
            Çıkış Yap
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-slate-400">Toplam Kullanıcı</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter((u) => u.isPremium).length}</p>
                  <p className="text-slate-400">Premium Kullanıcı</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-slate-400">Aktif Hizmet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.isPremium && getDaysLeft(u.premiumExpiry) > 0).length}
                  </p>
                  <p className="text-slate-400">Aktif Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
            <TabsTrigger value="add-user">Kullanıcı Ekle</TabsTrigger>
            <TabsTrigger value="premium">Premium Yönetimi</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Kullanıcı Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{user.username.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-slate-400">Token: {user.token}</p>
                          <p className="text-xs text-slate-500">Katılım: {user.joinDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={user.isPremium ? "default" : "secondary"}>
                          {user.isPremium ? "Premium" : "Normal"}
                        </Badge>

                        {user.isPremium && user.premiumExpiry && (
                          <div className="text-right">
                            <p className="text-sm text-slate-300">{getDaysLeft(user.premiumExpiry)} gün kaldı</p>
                            <p className="text-xs text-slate-500">Bitiş: {user.premiumExpiry}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePremium(user.id)}
                            className="border-slate-600"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-user">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Yeni Kullanıcı Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Token</label>
                  <Input
                    value={newUser.token}
                    onChange={(e) => setNewUser({ ...newUser, token: e.target.value })}
                    placeholder="Kullanıcı token'ı"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={newUser.isPremium}
                    onChange={(e) => setNewUser({ ...newUser, isPremium: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="premium" className="text-sm">
                    Premium üyelik
                  </label>
                </div>

                {newUser.isPremium && (
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Premium Bitiş Tarihi</label>
                    <Input
                      type="date"
                      value={newUser.premiumExpiry}
                      onChange={(e) => setNewUser({ ...newUser, premiumExpiry: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                )}

                <Button onClick={addUser} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Kullanıcı Ekle
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Premium Kullanıcılar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => user.isPremium)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-600/30"
                      >
                        <div className="flex items-center gap-4">
                          <Crown className="w-8 h-8 text-yellow-500" />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-slate-400">Token: {user.token}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-400">
                            {getDaysLeft(user.premiumExpiry)} gün kaldı
                          </p>
                          <p className="text-sm text-slate-400">Bitiş: {user.premiumExpiry}</p>
                        </div>
                      </div>
                    ))}

                  {users.filter((user) => user.isPremium).length === 0 && (
                    <p className="text-center text-slate-400 py-8">Henüz premium kullanıcı bulunmuyor</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
