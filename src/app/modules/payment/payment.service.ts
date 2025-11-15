import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleStripeWebhooksEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const appointmentId = session?.metadata?.appointmentId;
            const paymentId = session?.metadata?.paymentId;
            const email = session?.customer_email?.email;

            // console.log("payment success");
            // console.log("payment success", appointmentId);
            // console.log("payment success", paymentId);
            // console.log("payment success", email);

            await prisma.appointment.update({
                where: {
                    id: appointmentId
                },
                data: {
                    paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                }
            })

            await prisma.payment.update({
                where: {
                    id: paymentId
                },
                data: {
                    status: PaymentStatus.UNPAID,
                }
            })


            break;
        }

        default:
            console.log(`unhandled event type: ${event.type}`);
    }
}

export const PaymentService = {
    handleStripeWebhooksEvent
}