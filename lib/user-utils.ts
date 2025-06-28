export interface UserData {
  token: string
  isPremium: boolean
  premiumExpiry: string | null
  username: string
  daysLeft: number
}

export function getUserData(token: string): UserData {
  // Davet sistemi kontrolü - 3 kişi davet etmişse premium yap
  const inviteKey = `invites_${token}`
  const inviteData = localStorage.getItem(inviteKey)
  let earnedPremiumFromInvites = false

  if (inviteData) {
    const parsed = JSON.parse(inviteData)
    earnedPremiumFromInvites = parsed.invited >= 3
  }

  // Token'a göre kullanıcı verilerini belirle
  if (token === "user123") {
    return {
      token,
      isPremium: true,
      premiumExpiry: "2025-07-08",
      username: "Premium Kullanıcı",
      daysLeft: 11,
    }
  } else if (token === "admin123") {
    return {
      token,
      isPremium: true,
      premiumExpiry: "2025-12-31",
      username: "Admin Kullanıcı",
      daysLeft: 365,
    }
  } else if (token === "free_user") {
    return {
      token,
      isPremium: earnedPremiumFromInvites,
      premiumExpiry: earnedPremiumFromInvites ? "2025-12-31" : null,
      username: earnedPremiumFromInvites ? "Premium Kullanıcı (Davet)" : "Ücretsiz Kullanıcı",
      daysLeft: earnedPremiumFromInvites ? 365 : 0,
    }
  } else if (token.startsWith("premium_")) {
    return {
      token,
      isPremium: true,
      premiumExpiry: "2025-12-31",
      username: "Premium Kullanıcı",
      daysLeft: 365,
    }
  } else if (token.startsWith("normal_")) {
    return {
      token,
      isPremium: earnedPremiumFromInvites,
      premiumExpiry: earnedPremiumFromInvites ? "2025-12-31" : null,
      username: earnedPremiumFromInvites ? "Premium Kullanıcı (Davet)" : "Normal Kullanıcı",
      daysLeft: earnedPremiumFromInvites ? 365 : 0,
    }
  } else {
    // Diğer tüm tokenlar için davet sistemine göre premium belirle
    return {
      token,
      isPremium: earnedPremiumFromInvites || true, // Varsayılan olarak premium
      premiumExpiry: "2025-12-31",
      username: earnedPremiumFromInvites ? "Premium Kullanıcı (Davet)" : "Premium Kullanıcı",
      daysLeft: 365,
    }
  }
}

export function calculateDaysLeft(expiryDate: string | null): number {
  if (!expiryDate) return 0

  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}
