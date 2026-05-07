import { OrderService } from "@/services/order-service";

describe("OrderService - processStockDecrement", () => {
  let mockTx: any;

  beforeEach(() => {
    mockTx = {
      product: { updateMany: jest.fn() },
      productVariant: { updateMany: jest.fn() }
    };
  });

  it("should decrement stock successfully for a standard product", async () => {
    // Arrange
    const items = [{ productId: "prod-1", quantity: 2 }];
    mockTx.product.updateMany.mockResolvedValue({ count: 1 });

    // Act
    await OrderService.processStockDecrement(mockTx, items);

    // Assert
    expect(mockTx.product.updateMany).toHaveBeenCalledWith({
      where: { id: "prod-1", stock: { gte: 2 } },
      data: { stock: { decrement: 2 } }
    });
  });

  it("should decrement stock successfully for a product variant", async () => {
    // Arrange
    const items = [{ productId: "prod-1", variantId: "var-1", quantity: 1 }];
    mockTx.productVariant.updateMany.mockResolvedValue({ count: 1 });

    // Act
    await OrderService.processStockDecrement(mockTx, items);

    // Assert
    expect(mockTx.productVariant.updateMany).toHaveBeenCalledWith({
      where: { id: "var-1", stock: { gte: 1 } },
      data: { stock: { decrement: 1 } }
    });
  });

  it("should throw error and abort transaction if stock is insufficient", async () => {
    // Arrange
    const items = [{ productId: "prod-out", quantity: 5 }];
    mockTx.product.updateMany.mockResolvedValue({ count: 0 }); // Falló el query gte

    // Act & Assert
    await expect(OrderService.processStockDecrement(mockTx, items))
      .rejects
      .toThrow("Stock insuficiente para el producto ID: prod-out");
  });
});
