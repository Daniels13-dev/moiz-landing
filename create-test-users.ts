import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Config Prisma with Adapter as done before
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Faltan las variables de entorno.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupUsers() {
  const usersToCreate = [
    {
      email: "daniel.ds.1302@gmail.com",
      password: "1234567890",
      role: "USER",
      phone: "3105940065",
    },
    {
      email: "moizpets@gmail.com",
      password: "123456",
      role: "ADMIN",
      phone: "3105940065",
    },
    {
      email: "contacto@moizpets.com",
      password: "123456",
      role: "USER",
      phone: "3126928258",
    },
  ];

  for (const item of usersToCreate) {
    console.log(`Buscando/Configurando usuario: ${item.email}...`);

    // First check if user exists in auth.users
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers();
    let authUser = users.find((u) => u.email === item.email);

    if (!authUser) {
      console.log(`Creando ${item.email} en Auth...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: item.email,
        password: item.password,
        email_confirm: true,
        user_metadata: {
          full_name: item.email.split("@")[0], // Placeholder name
          phone: item.phone,
        },
      });
      if (error) {
        console.error(`Error en Auth para ${item.email}: ${error.message}`);
        continue;
      }
      authUser = data.user;
    } else {
      // Sync metadata for existing user
      await supabase.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          full_name:
            authUser.user_metadata?.full_name || item.email.split("@")[0],
          phone: item.phone,
        },
      });
    }

    if (authUser) {
      // Now ensure profile exists with the correct role
      console.log(
        `Sincronizando perfil para ${item.email} con rol: ${item.role}...`,
      );
      await prisma.profile.upsert({
        where: { id: authUser.id },
        update: {
          role: item.role,
          phone: item.phone,
          fullName:
            authUser.user_metadata?.full_name || item.email.split("@")[0],
        },
        create: {
          id: authUser.id,
          email: item.email,
          role: item.role,
          phone: item.phone,
          fullName: item.email.split("@")[0],
        },
      });
    }
  }

  console.log("Operación completada con éxito.");
  await prisma.$disconnect();
  await pool.end();
}

setupUsers();
