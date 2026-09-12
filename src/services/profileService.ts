import api from "./api";

export interface ProfileUser {
  id: string;
  email: string;
  full_name: string;
  target_role: string | null;
  created_at: string;
}
export interface ProfileRecord {
  id: string;
  user_id: string;
  cv_text: string | null;
  cv_file_url: string | null;
  cv_file_name: string | null;
  summary: string | null;
  updated_at: string;
}
export interface ProfileData {
  user: ProfileUser;
  profile: ProfileRecord | null;
}

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const { data } = await api.get("/profile");
    return data.data;
  },

updateProfile: async (payload: {
  fullName: string;
  targetRole: string;
  summary?: string;
}): Promise<{ user: ProfileUser; profile: ProfileRecord | null }> => {
  const { data } = await api.put("/profile", payload);
  return data.data;
},
  uploadCv: async (file: File): Promise<{ profile: ProfileRecord }> => {
    const formData = new FormData();
    formData.append("cv", file);
    const { data } = await api.post("/profile/cv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },
   deleteCv: async (): Promise<{ profile: ProfileRecord }> => {
    const { data } = await api.delete("/profile/cv");
    return data.data;
  },
};