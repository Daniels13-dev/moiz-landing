import prisma from "@/lib/prisma";

export class CategoryService {
  static async create(name: string) {
    return await prisma.category.create({
      data: { name },
    });
  }

  static async delete(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }

  static async update(id: string, name: string) {
    return await prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  static async toggleActive(id: string, active: boolean) {
    return await prisma.category.update({
      where: { id },
      data: { isActive: active },
    });
  }
}
