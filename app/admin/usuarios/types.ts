export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  idNumber: string | null;
  idType: string | null;
  createdAt: Date;
}
