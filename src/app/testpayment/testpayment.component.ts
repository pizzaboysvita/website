import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-testpayment',
  imports: [],
  templateUrl: './testpayment.component.html',
  styleUrl: './testpayment.component.scss'
})
export class TestpaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  cardElement: any;
  cardMounted: boolean = false;

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51SA8B8FsDhDFlLCrBjaVv2m4IorCHSr4FGajgw1YUCuZcaQWBQCFBGrtXVhCN9hSI7il1VXVZRULksLLZfejDVoN00Sonb87J4');

    // Mount card element after Stripe is loaded
    if (this.stripe && !this.cardMounted) {
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount('#card-element');
      this.cardMounted = true;
    }
  }

  async handlePayment() {
    if (!this.stripe) return;

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 5000, currency: "inr" }) // ₹50
  });

  const data = await response.json();
  const clientSecret = data.clientSecret;

    // Normally you get clientSecret from your backend
    // const clientSecret = "replace_with_backend_generated_client_secret";

    const { paymentIntent, error } = await this.stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: this.cardElement,
        }
      }
    );

    if (error) {
      console.error('Payment failed:', error.message);
      alert('Payment failed: ' + error.message);
    } else if (paymentIntent) {
      console.log('Payment successful:', paymentIntent);
      alert('Payment successful! ✅');
    }
  }
}
