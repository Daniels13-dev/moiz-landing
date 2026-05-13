"use client";

import { useState } from "react";
import { updateUserRole, updateUserProfile, adminUpdateUserPassword } from "../actions";
import { toast } from "sonner";

// Components
import UserFilters from "./components/UserFilters";
import UsersTableContent from "./components/UsersTableContent";
import EditUserModal from "./components/EditUserModal";
import PasswordResetModal from "./components/PasswordResetModal";

// Types
import { UserProfile } from "./types";

interface UserTableProps {
  initialUsers: UserProfile[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    if (!confirm(`¿Estás seguro de cambiar el rol de este usuario a ${newRole}?`)) return;

    setUpdating(userId);
    const result = await updateUserRole(userId, newRole);
    setUpdating(null);

    if (result.success) {
      toast.success(`Rol actualizado a ${newRole} correctamente`);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } else {
      toast.error(result.error || "Error al actualizar rol");
    }
  };

  const handleEditClick = (user: UserProfile) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    setIsSaving(true);
    const result = await updateUserProfile(editingUser.id, formData);
    setIsSaving(false);

    if (result.success) {
      toast.success("Usuario actualizado correctamente");
      const updatedUser = {
        ...editingUser,
        full_name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        role: formData.get("role") as string,
        idNumber: formData.get("idNumber") as string,
        idType: formData.get("idType") as string,
      };
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
      setIsModalOpen(false);
      setEditingUser(null);
    } else {
      toast.error(result.error || "Error al actualizar usuario");
    }
  };

  const handlePasswordResetClick = (user: UserProfile) => {
    setEditingUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleUpdatePassword = async (newPassword: string) => {
    if (!editingUser || !newPassword) return;

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsChangingPassword(true);
    const result = await adminUpdateUserPassword(editingUser.id, newPassword);
    setIsChangingPassword(false);

    if (result.success) {
      toast.success("Contraseña actualizada correctamente");
      setIsPasswordModalOpen(false);
      setEditingUser(null);
    } else {
      toast.error(result.error || "Error al actualizar contraseña");
    }
  };

  return (
    <div className="space-y-6">
      <UserFilters 
        search={search} 
        setSearch={setSearch} 
        roleFilter={roleFilter} 
        setRoleFilter={setRoleFilter} 
      />

      <UsersTableContent 
        users={filteredUsers} 
        updating={updating} 
        onEdit={handleEditClick} 
        onPasswordReset={handlePasswordResetClick} 
        onRoleToggle={handleRoleToggle} 
      />

      {editingUser && (
        <>
          <EditUserModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            user={editingUser} 
            isSaving={isSaving} 
            onUpdate={handleUpdateUser} 
          />
          <PasswordResetModal 
            isOpen={isPasswordModalOpen} 
            onClose={() => setIsPasswordModalOpen(false)} 
            user={editingUser} 
            isChangingPassword={isChangingPassword} 
            onUpdate={handleUpdatePassword} 
          />
        </>
      )}
    </div>
  );
}

