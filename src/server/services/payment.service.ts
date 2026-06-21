"use server";

import { getStripe, STRIPE_CONFIG } from "@/server/config/stripe";
import { createClient } from "@/server/lib/supabase";
import { revalidatePath } from "next/cache";

function db() {
  return createClient() as Promise<any>;
}

export interface CreatePaymentIntentParams {
  contractId: string;
  amount: number;
  description: string;
}

export interface CreatePaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  paymentId?: string;
  error?: string;
}

/**
 * Create a Stripe Payment Intent for escrow
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<CreatePaymentIntentResult> {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify contract and get freelancer
    const { data: contract } = await supabase
      .from("contracts")
      .select("*, freelancer_profile_id")
      .eq("id", params.contractId)
      .eq("client_id", user.id)
      .single();

    if (!contract) {
      return { success: false, error: "Contract not found" };
    }

    // Calculate fees
    const clientFee = Math.round(params.amount * (STRIPE_CONFIG.clientFeePercent / 100));
    const totalAmount = params.amount + clientFee;

    // Create Stripe Payment Intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: STRIPE_CONFIG.currency,
      metadata: {
        contractId: params.contractId,
        userId: user.id,
        freelancerProfileId: contract.freelancer_profile_id,
        originalAmount: params.amount.toString(),
      },
      description: params.description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    const { data: payment } = await supabase
      .from("payments")
      .insert({
        contract_id: params.contractId,
        client_id: user.id,
        freelancer_profile_id: contract.freelancer_profile_id,
        project_title: contract.project_title,
        freelancer_name: contract.freelancer_name,
        amount: params.amount,
        status: "pending",
        provider: "stripe",
        provider_reference: paymentIntent.id,
      })
      .select()
      .single();

    revalidatePath("/dashboard/client");

    return {
      success: true,
      clientSecret: paymentIntent.client_secret!,
      paymentId: payment?.id,
    };
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}

/**
 * Release payment from escrow to freelancer
 */
export async function releasePayment(paymentId: string) {
  try {
    const supabase = await db();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: payment } = await supabase
      .from("payments")
      .select("*, contract_id")
      .eq("id", paymentId)
      .eq("client_id", user.id)
      .eq("status", "escrow")
      .single();

    if (!payment) {
      return { success: false, error: "Payment not found or not in escrow" };
    }

    // Update payment status
    await supabase
      .from("payments")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", paymentId);

    // Update contract if linked
    if (payment.contract_id) {
      await supabase
        .from("contracts")
        .update({ status: "completed", progress: 100 })
        .eq("id", payment.contract_id);
    }

    revalidatePath("/dashboard/client");
    revalidatePath("/dashboard/freelancer");

    return { success: true };
  } catch (error) {
    console.error("Release payment failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  event: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await db();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const { contractId } = paymentIntent.metadata;

        // Update payment to escrow
        await supabase
          .from("payments")
          .update({ status: "escrow" })
          .eq("provider_reference", paymentIntent.id);

        // Update contract status
        if (contractId) {
          await supabase
            .from("contracts")
            .update({ status: "active" })
            .eq("id", contractId);
        }

        revalidatePath("/dashboard");
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("provider_reference", paymentIntent.id);

        break;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Webhook handling failed:", error);
    return { success: false, error: String(error) };
  }
}
