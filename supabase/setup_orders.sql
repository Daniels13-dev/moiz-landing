-- Habilitar RLS para las nuevas tablas de pedidos
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderStatusHistory" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS PARA LA TABLA "Order"
-- ==========================================

-- Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Users can view their own orders" ON "Order"
  FOR SELECT USING (auth.uid()::text = "userId");

-- Los administradores pueden ver y gestionar todos los pedidos
CREATE POLICY "Admins can manage all orders" ON "Order"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile"
      WHERE "Profile".id = auth.uid()::text
      AND "Profile".role = 'ADMIN'
    )
  );

-- ==========================================
-- POLÍTICAS PARA LA TABLA "OrderItem"
-- ==========================================

-- Los usuarios pueden ver los items de sus propios pedidos
CREATE POLICY "Users can view their own order items" ON "OrderItem"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Order"
      WHERE "Order".id = "OrderItem"."orderId"
      AND "Order"."userId" = auth.uid()::text
    )
  );

-- Los administradores pueden ver todos lo items
CREATE POLICY "Admins can view all order items" ON "OrderItem"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile"
      WHERE "Profile".id = auth.uid()::text
      AND "Profile".role = 'ADMIN'
    )
  );

-- ==========================================
-- POLÍTICAS PARA LA TABLA "OrderStatusHistory"
-- ==========================================

-- Los usuarios pueden ver el historial de sus propios pedidos
CREATE POLICY "Users can view their own order history" ON "OrderStatusHistory"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Order"
      WHERE "Order".id = "OrderStatusHistory"."orderId"
      AND "Order"."userId" = auth.uid()::text
    )
  );

-- Los administradores pueden gestionar el historial
CREATE POLICY "Admins can manage order history" ON "OrderStatusHistory"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Profile"
      WHERE "Profile".id = auth.uid()::text
      AND "Profile".role = 'ADMIN'
    )
  );
