import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helpers/stripe";
import config from "../../../config";

const handleStripeWebhooksEvent = catchAsync(async (req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"] as string;
    const webSecret = config.stripeWebHookSecret as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webSecret
        );
    } catch (err: any) {
        console.log("❌ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const result = await PaymentService.handleStripeWebhooksEvent(event);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Webhook request send successfully",
        data: result
    })
});

export const PaymentController = {
    handleStripeWebhooksEvent
}