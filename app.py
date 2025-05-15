from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

common_passwords = ['123456', 'password', '12345678', 'qwerty']

def evaluate_password(password):
    score = 0
    suggestions = []

    if len(password) >= 8:
        score += 1
    else:
        suggestions.append("Use at least 8 characters")

    if re.search(r'[a-z]', password):
        score += 1
    else:
        suggestions.append("Include lowercase letters")

    if re.search(r'[A-Z]', password):
        score += 1
    else:
        suggestions.append("Include uppercase letters")

    if re.search(r'\d', password):
        score += 1
    else:
        suggestions.append("Include numbers")

    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        suggestions.append("Include special characters")

    if password.lower() not in common_passwords:
        score += 1
    else:
        suggestions.append("Avoid common passwords")

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Moderate"
    else:
        strength = "Strong"

    return strength, suggestions

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/check", methods=["POST"])
def check():
    password = request.json.get("password", "")
    strength, suggestions = evaluate_password(password)
    return jsonify({"strength": strength, "suggestions": suggestions})

if __name__ == "__main__":
    app.run(debug=True)
