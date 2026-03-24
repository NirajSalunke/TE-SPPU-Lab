import tkinter as tk
from tkinter import scrolledtext
import re

qa_pairs = [
    ("what are your store hours", "Our store is open Monday to Saturday, 9 AM to 8 PM, and Sunday 10 AM to 6 PM."),
    ("when do you open", "We open at 9 AM on weekdays and 10 AM on Sundays."),
    ("when do you close", "We close at 8 PM on weekdays and 6 PM on Sundays."),
    ("are you open on sunday", "Yes, we are open on Sundays from 10 AM to 6 PM."),
    ("are you open on holidays", "We are closed on major public holidays. Please check our website for updates."),
    ("what is your return policy", "You can return any product within 30 days of purchase with a valid receipt."),
    ("can i return a product", "Yes, returns are accepted within 30 days. The product must be unused and in original packaging."),
    ("how do i return an item", "Bring the item to our store with the receipt, or contact us to arrange a pickup."),
    ("do you offer refunds", "Yes, refunds are processed within 5-7 business days after we receive the returned item."),
    ("how long does refund take", "Refunds are typically processed within 5 to 7 business days."),
    ("what payment methods do you accept", "We accept cash, credit cards, debit cards, UPI, and net banking."),
    ("do you accept upi", "Yes, we accept all major UPI payments including GPay, PhonePe, and Paytm."),
    ("do you accept credit card", "Yes, we accept Visa, Mastercard, and RuPay credit cards."),
    ("is cash on delivery available", "Yes, cash on delivery is available for orders within the city."),
    ("do you offer emi", "Yes, EMI options are available on orders above Rs. 2000 through select banks."),
    ("how can i track my order", "You can track your order using the tracking ID sent to your registered email."),
    ("where is my order", "Please share your order ID and we will check the status for you."),
    ("how long does delivery take", "Standard delivery takes 3 to 5 business days. Express delivery is 1 to 2 days."),
    ("do you offer free shipping", "Yes, free shipping is available on orders above Rs. 499."),
    ("what is the shipping charge", "Shipping is free above Rs. 499. Below that, a flat charge of Rs. 49 applies."),
    ("how do i place an order", "You can place an order on our website or visit our store directly."),
    ("can i cancel my order", "Orders can be cancelled within 24 hours of placing them. Contact us immediately."),
    ("how do i cancel my order", "Call or message us within 24 hours and we will cancel your order with a full refund."),
    ("do you have a mobile app", "Yes, download our app from the Google Play Store or Apple App Store."),
    ("how do i create an account", "Click on Sign Up on our website or app and fill in your basic details."),
    ("i forgot my password", "Click on Forgot Password on the login page and follow the steps to reset it."),
    ("how do i change my address", "Log in to your account, go to Settings, and update your delivery address."),
    ("do you have discounts", "Yes, we run seasonal sales and offer special discounts for members."),
    ("is there any offer today", "Check our website or app for today's deals and limited time offers."),
    ("do you have a loyalty program", "Yes, earn reward points on every purchase and redeem them on future orders."),
    ("how do i apply a coupon", "Enter the coupon code at checkout in the Promo Code field to avail the discount."),
    ("what products do you sell", "We sell electronics, clothing, home appliances, groceries, and much more."),
    ("do you sell mobiles", "Yes, we have a wide range of smartphones from top brands."),
    ("do you sell laptops", "Yes, we carry laptops from Dell, HP, Lenovo, Asus, and more."),
    ("do you have clothes", "Yes, we have a full clothing section with men, women, and kids collections."),
    ("do you sell groceries", "Yes, our grocery section is available both in-store and online."),
    ("where are you located", "We are located at MG Road, Pune. You can find us on Google Maps."),
    ("what is your address", "Our store address is MG Road, Near City Mall, Pune, Maharashtra."),
    ("how do i contact you", "You can reach us at support@ourstore.com or call 1800-123-4567."),
    ("what is your phone number", "Our helpline number is 1800-123-4567, available 9 AM to 8 PM."),
    ("what is your email", "You can email us at support@ourstore.com and we will reply within 24 hours."),
    ("do you have customer support", "Yes, our support team is available 9 AM to 8 PM on all working days."),
    ("how do i give feedback", "You can share your feedback on our website under the Contact Us section."),
    ("is the product under warranty", "Most electronics come with a 1-year manufacturer warranty."),
    ("how do i claim warranty", "Visit our store with the product and purchase receipt to initiate a warranty claim."),
    ("do you repair products", "Yes, we have a service center that handles repairs for electronics."),
    ("how do i exchange a product", "Exchanges are allowed within 15 days of purchase for products in original condition."),
    ("do you deliver outside city", "Yes, we deliver across India. International shipping is currently unavailable."),
    ("can i get a gift wrap", "Yes, gift wrapping is available for an additional Rs. 30 per item."),
    ("do you have gift cards", "Yes, we offer gift cards in denominations of Rs. 500, 1000, and 2000."),
]

STOP_WORDS = {"a","an","the","is","are","was","were","do","does","did","i","my",
              "me","we","you","your","our","have","has","can","could","would",
              "should","will","what","when","where","how","why","which","there",
              "this","that","to","of","in","on","for","with","it","be","and","or"}

def tokenize(text):
    words = re.findall(r'\b[a-z]+\b', text.lower())
    return set(w for w in words if w not in STOP_WORDS)

def get_response(user_input):
    user_tokens = tokenize(user_input)

    print("=" * 55)
    print(f"  User Input   : {user_input}")
    print(f"  Tokens Found : {sorted(user_tokens)}")
    print("-" * 55)

    if not user_tokens:
        print("  Result       : No valid tokens found.")
        print("=" * 55)
        return "Please type your question clearly."

    best_score = 0
    best_match = None
    best_answer = None
    best_common = set()

    for question, answer in qa_pairs:
        q_tokens = tokenize(question)
        common = user_tokens & q_tokens
        score = len(common)
        if score > best_score:
            best_score = score
            best_match = question
            best_answer = answer
            best_common = common

    if best_score >= 1:
        print(f"  Matched With : \"{best_match}\"")
        print(f"  Common Words : {sorted(best_common)}")
        print(f"  Match Score  : {best_score}")
        print(f"  Response     : {best_answer[:60]}...")
        print("=" * 55)
        return best_answer
    else:
        print("  Matched With : No match found (score = 0)")
        print("  Result       : Suggesting in-person contact")
        print("=" * 55)
        return ("Sorry, I didn't understand your question. "
                "Please contact us in person at our store or call 1800-123-4567. "
                "We are happy to help you!")

# ── GUI ────────────────────────────────────────────────────────────────────────
root = tk.Tk()
root.title("Customer Support Chatbot")
root.geometry("500x600")
root.resizable(False, False)
root.configure(bg="#f0f0f0")

title_label = tk.Label(root, text="Customer Support Chatbot",
                       font=("Arial", 14, "bold"), bg="#4a90d9", fg="white",
                       pady=10)
title_label.pack(fill=tk.X)

subtitle = tk.Label(root, text="Ask me anything about our store!",
                    font=("Arial", 9), bg="#f0f0f0", fg="#555")
subtitle.pack(pady=(5, 0))

chat_frame = tk.Frame(root, bg="#f0f0f0")
chat_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

chat_box = scrolledtext.ScrolledText(chat_frame, wrap=tk.WORD, state=tk.DISABLED,
                                     font=("Arial", 10), bg="white", fg="#222",
                                     relief=tk.SUNKEN, bd=2, height=25)
chat_box.pack(fill=tk.BOTH, expand=True)

chat_box.tag_config("user", foreground="#1a5276", font=("Arial", 10, "bold"))
chat_box.tag_config("bot",  foreground="#196f3d", font=("Arial", 10))
chat_box.tag_config("info", foreground="#888",    font=("Arial", 9, "italic"))

input_frame = tk.Frame(root, bg="#f0f0f0")
input_frame.pack(padx=10, pady=(0, 10), fill=tk.X)

user_entry = tk.Entry(input_frame, font=("Arial", 11), relief=tk.SUNKEN, bd=2)
user_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=5)

def append_message(tag, prefix, message):
    chat_box.config(state=tk.NORMAL)
    chat_box.insert(tk.END, prefix, tag)
    chat_box.insert(tk.END, message + "\n\n")
    chat_box.config(state=tk.DISABLED)
    chat_box.see(tk.END)

def send_message(event=None):
    user_text = user_entry.get().strip()
    if not user_text:
        return
    user_entry.delete(0, tk.END)
    append_message("user", "You: ", user_text)
    response = get_response(user_text)
    append_message("bot", "Bot: ", response)

send_btn = tk.Button(input_frame, text="Send", font=("Arial", 11, "bold"),
                     bg="#4a90d9", fg="white", relief=tk.FLAT,
                     padx=12, pady=5, command=send_message)
send_btn.pack(side=tk.LEFT, padx=(6, 0))

user_entry.bind("<Return>", send_message)

print("=" * 55)
print("   Chatbot Started - Terminal Debug Log Active")
print("=" * 55)

append_message("info", "", "Welcome! Type your question below and press Send or Enter.")
append_message("info", "", "Example: 'What are your store hours?' or 'How do I return a product?'")

root.mainloop()
