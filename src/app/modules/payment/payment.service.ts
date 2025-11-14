import Stripe from "stripe";

const handleStripeWebhooksEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const appointmentId = session?.metadata?.appointmentId;
            const paymentId = session?.metadata?.paymentId;
            const email = session?.metadata?.email;

            console.log("payment success");
            console.log("payment success", appointmentId);
            console.log("payment success", paymentId);
            console.log("payment success", email);



            break;
        }
        case "payment_intent.payment_failed": {
            const intent = event.data.object as any;
            console.log("payment failed", intent.id);
            break;
        }
        default:
            console.log(`unhandled event type: ${event.type}`);
    }
}

export const PaymentService = {
    handleStripeWebhooksEvent
}