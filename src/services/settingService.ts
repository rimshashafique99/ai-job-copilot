import api from "./api";

export interface SettingsData {
  email: string;
  fullName: string;
  authProvider: "local" | "google";
  emailNotifications: boolean;
  aiInsights: boolean;
}

export const settingsService = {
  getSettings: async (): Promise<SettingsData> => {
    const { data } = await api.get("/settings");
    return data.data;
  },

  updateAccount: async (payload: { fullName: string; email: string }) => {
    const { data } = await api.patch("/settings/account", payload);
    return data.data;
  },

  updatePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.patch("/settings/password", payload);
    return data.data;
  },

  updatePreferences: async (payload: { emailNotifications: boolean; aiInsights: boolean }) => {
    const { data } = await api.patch("/settings/preferences", payload);
    return data.data;
  },

  deleteAccount: async (password?: string) => {
    const { data } = await api.delete("/settings/account", { data: { password } });
    return data.data;
  },
};