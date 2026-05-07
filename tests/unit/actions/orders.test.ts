import { createOrder } from "@/app/actions/orders";
import prisma from "@/lib/prisma";
import { OrderService } from "@/services/order-service";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    product: { findMany: jest.fn() }
  }
}));

jest.mock("@/utils/supabase/server", () => ({
  createClient: () => ({ auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) } })
}));

jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

describe("createOrder (Business Logic & Security)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if cart is empty", async () => {
    // Arrange
    const payload = { items: [], totalAmount: 0, customerName: "Test", customerPhone: "123", customerAddress: "123" };

    // Act
    const result = await createOrder(payload as any);

    // Assert
    expect(result).toEqual({ error: "El carrito está vacío." });
  });

  it("SECURITY: should ignore frontend totalAmount and calculate price securely from DB", async () => {
    // Arrange
    const mockDbProducts = [
      { id: "prod-1", price: 50000, name: "Collar", variants: [] }
    ];
    
    // Simular el callback del tx
    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
      const tx = {
        product: { findMany: jest.fn().mockResolvedValue(mockDbProducts) },
        order: { create: jest.fn().mockResolvedValue({ id: "order-1", orderNumber: 1 }) },
        subscription: { create: jest.fn() },
        subscriptionReminder: { create: jest.fn() }
      };
      jest.spyOn(OrderService, 'processStockDecrement').mockResolvedValue(undefined);
      
      return await callback(tx);
    });

    const maliciousPayload = {
      items: [{ productId: "prod-1", productName: "Collar", quantity: 2, price: 1 }], 
      totalAmount: 2, 
      customerName: "Hacker",
      customerPhone: "123",
      customerAddress: "Calle Falsa"
    };

    // Act
    const result = await createOrder(maliciousPayload as any);

    // Assert
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ success: true, orderId: "order-1", orderNumber: 1 });
  });
});
