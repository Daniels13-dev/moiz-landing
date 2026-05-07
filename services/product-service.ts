import prisma from "@/lib/prisma";

export class ProductService {
  static async create(data: any) {
    return await prisma.product.create({
      data: {
        ...data,
        rating: 5.0,
      },
    });
  }

  static async update(id: string, data: any) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    // Check if product has order history
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      throw new Error(`Este producto tiene ${orderItemCount} pedido(s) asociado(s) y no puede eliminarse. Desactívalo.`);
    }

    return await prisma.$transaction([
      prisma.subscriptionReminder.deleteMany({ where: { productId: id } }),
      prisma.subscription.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
  }

  static async toggleActive(id: string, active: boolean) {
    return await prisma.product.update({
      where: { id },
      data: { isActive: active },
    });
  }

  // --- VARIANTS ---

  static async createVariant(productId: string, data: any) {
    return await prisma.productVariant.create({
      data: {
        productId,
        ...data,
      },
    });
  }

  static async createVariantBatch(productId: string, data: any) {
    return await prisma.productVariant.createMany({
      data: data.sizes.map((s: any) => ({
        productId,
        name: data.name,
        image: data.image,
        color: data.color,
        price: s.price,
        size: s.size,
        stock: s.stock,
      })),
    });
  }

  static async updateVariant(id: string, data: any) {
    return await prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  static async deleteVariant(id: string) {
    return await prisma.productVariant.delete({
      where: { id },
    });
  }
}
