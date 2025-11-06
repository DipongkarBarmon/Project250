# Email Verification Implementation Guide

## Frontend (Already Implemented) ✅

### Features Added:

1. **Login Pages (Patient & Doctor)**
   - Detects unverified email errors from backend
   - Shows yellow warning message for unverified accounts
   - "Resend Verification Email" button appears when needed
   - Calls `/api/auth/resend-verification` endpoint

2. **Email Verification Page** (`/auth/verify-email`)
   - Handles verification token from email link
   - Shows loading, success, or error states
   - Auto-redirects to login after successful verification
   - URL format: `/auth/verify-email?token=ABC123&type=doctor` (or patient)

3. **Sign-up Success Page**
   - Enhanced with email verification reminder
   - Clear instructions to check inbox
   - Spam folder reminder

### API Routes Created (Placeholders):
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/verify-email` - Verify email with token

## Backend Implementation TODO

### 1. Update User Models

Add to both User and Doctor schemas:
```javascript
{
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpiry: {
    type: Date,
    default: null
  }
}
```

### 2. Update Signup Routes

**`/app/api/auth/signup/route.js`:**
```javascript
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

// After creating user:
const verificationToken = crypto.randomBytes(32).toString('hex')
user.verificationToken = verificationToken
user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
await user.save()

// Send verification email
const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email?token=${verificationToken}&type=patient`
await sendVerificationEmail(user.email, user.name, verificationUrl)
```

**`/app/api/auth/signupDoctor/route.js`:**
Same as above but with `type=doctor`

### 3. Update Login Routes

**`/app/api/auth/login/route.js` and `/app/api/auth/loginDoctor/route.js`:**
```javascript
// After password verification, before setting auth cookie:
if (!user.emailVerified) {
  return NextResponse.json(
    { error: "Please verify your email before logging in. Check your inbox or request a new verification email." },
    { status: 403 }
  )
}
```

### 4. Implement Verify Email Route

**`/app/api/auth/verify-email/route.js`:**
```javascript
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import Doctor from "@/lib/mongodb/models/Doctor"

export async function POST(request) {
  try {
    await connectDB()
    const { token, isDoctor } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const Model = isDoctor ? Doctor : User
    const user = await Model.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    user.emailVerified = true
    user.verificationToken = null
    user.verificationTokenExpiry = null
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in."
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
```

### 5. Implement Resend Verification Route

**`/app/api/auth/resend-verification/route.js`:**
```javascript
import crypto from 'crypto'
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import Doctor from "@/lib/mongodb/models/Doctor"
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request) {
  try {
    await connectDB()
    const { email, isDoctor } = await request.json()

    const Model = isDoctor ? Doctor : User
    const user = await Model.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    user.verificationToken = verificationToken
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    // Send email
    const type = isDoctor ? 'doctor' : 'patient'
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/auth/verify-email?token=${verificationToken}&type=${type}`
    await sendVerificationEmail(user.email, user.name, verificationUrl)

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: "Failed to resend email" }, { status: 500 })
  }
}
```

### 6. Create Email Utility

**`/lib/email.js`:**
```javascript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendVerificationEmail(email, name, verificationUrl) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email - HealthCare+',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to HealthCare+!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">HealthCare+ Team</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
```

### 7. Environment Variables

Add to `.env.local`:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="HealthCare+ <noreply@healthcare.com>"

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

## Testing Checklist

- [ ] User signs up → receives verification email
- [ ] Click verification link → email verified → can log in
- [ ] Try to login without verification → shows error + resend button
- [ ] Click resend button → new email sent
- [ ] Token expires after 24 hours
- [ ] Already verified user can't request new token
- [ ] Works for both patients and doctors

## Notes

- nodemailer is already installed (`npm install nodemailer --legacy-peer-deps`)
- For Gmail, use App Passwords (not regular password)
- Consider using email service providers like SendGrid, Mailgun, or AWS SES for production
