// lib/store/adminCheck.ts
'use server'
export async function isAdmin(user: string): Promise<boolean> {
    const adminUsers = process.env.ADMIN_USERS?.split(',') || [];
    return adminUsers.includes(user);
}
  