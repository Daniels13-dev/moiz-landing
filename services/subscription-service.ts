import prisma from "@/lib/prisma";

export class SubscriptionService {
  static async completeReminder(reminderId: string) {
    const reminder = await prisma.subscriptionReminder.findUnique({
      where: { id: reminderId },
      include: { subscription: true },
    });

    if (!reminder) throw new Error("Recordatorio no encontrado");
    if (reminder.status === "completado") throw new Error("Ya está completado");

    return await prisma.$transaction(async (tx) => {
      // Mark current reminder as completed
      await tx.subscriptionReminder.update({
        where: { id: reminderId },
        data: { status: "completado" },
      });

      // If there's an associated subscription, update it and create next reminder
      if (reminder.subscriptionId && reminder.subscription) {
        if (reminder.subscription.status !== "activa") {
          throw new Error(`No se puede completar: La suscripción está ${reminder.subscription.status}`);
        }

        const frequency = reminder.subscription.frequencyDays || 30;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + frequency);

        await tx.subscription.update({
          where: { id: reminder.subscriptionId },
          data: {
            deliveryCount: { increment: 1 },
            lastBillingDate: new Date(),
            nextBillingDate: nextDate,
          },
        });

        // Schedule NEXT reminder
        await tx.subscriptionReminder.create({
          data: {
            userId: reminder.userId,
            productId: reminder.productId,
            subscriptionId: reminder.subscriptionId,
            reminderDate: nextDate,
            status: "pendiente",
          },
        });
      }
    });
  }
}
