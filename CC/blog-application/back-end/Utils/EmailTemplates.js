const emailStyles = `
    body {
    background-color: #f0f2f5;
    padding: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.controls {
    max-width: 600px;
    margin: 0 auto 20px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 10px;
}

.controls select, .controls input, .controls button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.controls button {
    background: #4F46E5;
    color: white;
    border: none;
    cursor: pointer;
}

.controls button:hover {
    background: #4338CA;
}

/* Email Template Styles */
:root {
    --primary-color: #4F46E5;
    --secondary-color: #6366F1;
    --success-color: #22C55E;
    --danger-color: #EF4444;
    --text-primary: #1F2937;
    --text-secondary: #4B5563;
    --bg-light: #F9FAFB;
}

.email-container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.brand-header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 32px 20px;
    text-align: center;
}

.brand-title {
    color: white;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 16px;
    letter-spacing: -0.5px;
}

.brand-header h1 {
    color: white;
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    opacity: 0.95;
}

.content {
    padding: 40px 32px;
    background-color: white;
}

.otp-container {
    background: var(--bg-light);
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    margin: 32px 0;
}

.otp-code {
    font-family: 'Courier New', monospace;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 8px;
    color: var(--primary-color);
    background: white;
    padding: 16px 24px;
    border-radius: 6px;
    border: 2px solid #E5E7EB;
    display: inline-block;
    margin: 16px 0;
}

.expiry-text {
    color: var(--text-secondary);
    font-size: 14px;
    margin-top: 16px;
}

.warning-text {
    background-color: #FEF2F2;
    border-left: 4px solid var(--danger-color);
    padding: 12px 16px;
    margin: 24px 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.footer {
    background-color: var(--bg-light);
    padding: 24px;
    text-align: center;
    border-top: 1px solid #E5E7EB;
}

.social-links {
    margin: 16px 0;
}

.social-links a {
    color: var(--text-secondary);
    text-decoration: none;
    margin: 0 12px;
    font-size: 14px;
}

.footer-text {
    color: var(--text-secondary);
    font-size: 12px;
    margin: 8px 0;
}
`;

function generateEmailTemplate(options) {
    const {
        type,
        otp,
        expiryTime = '10 minutes'
    } = options;

    const getTitle = () => {
        switch (type) { 
            case 'verification': return 'Verify Your Email Address';
            case 'password-reset': return 'Reset Your Password';
            case 'delete-account': return 'Account Deletion Request';
            default: return 'Verification Required';
        }
    };

    const getMessage = () => {
        switch (type) {
            case 'verification':
                return 'Thanks for signing up! Please use the following verification code to complete your registration:';
            case 'password-reset':
                return 'We received a request to reset your password. Use this verification code to set up a new password:';
            case 'delete-account':
                return 'We received a request to delete your account. Please use this verification code to confirm the deletion:';
            default:
                return 'Please use the following verification code:';
        }
    };

    return `
        <div class="email-container">
            <div class="brand-header">
                <div class="brand-title">React Blog</div>
                <h1>${getTitle()}</h1>
            </div>
            <div class="content">
                <p>${getMessage()}</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <div class="expiry-text">This code will expire in ${expiryTime}</div>
                </div>

                <div class="warning-text">
                    For security reasons, please never share this code with anyone. Our team will never ask for this code.
                </div>

                <p>If you didn't request this code, please ignore this email or contact our support team if you're concerned about your account's security.</p>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="#">Twitter</a> |
                    <a href="#">Facebook</a> |
                    <a href="#">Instagram</a>
                </div>
                <div class="footer-text">© ${new Date().getFullYear()} React Blog. All rights reserved.</div>
                <div class="footer-text">Questions? Contact us at support@reactblog.com</div>
            </div>
        </div>
    `;
}

function generateEmailVerificationEmail(otp) {
    return generateEmailTemplate({
        type: 'verification',
        otp,
        expiryTime: '10 minutes'
    });
}

function generateForgotPasswordEmail(otp) {
    return generateEmailTemplate({
        type: 'password-reset',
        otp,
        expiryTime: '10 minutes'
    });
}

function generateDeleteAccountEmail(otp) {
    return generateEmailTemplate({
        type: 'delete-account',
        otp,
        expiryTime: '10 minutes'
    });
}
export {
    generateEmailVerificationEmail,
    generateForgotPasswordEmail,
    generateDeleteAccountEmail
};