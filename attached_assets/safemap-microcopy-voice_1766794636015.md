# SafeMap – Microcopy & Brand Voice Guide

## Tone of Voice

### Core Principles
- **Sex-positive**: We don't shy away from sex. Users come here to meet, hook up, and have fun. Celebrate that.
- **Affirming**: Validate queer identities, relationships, and bodies. No shame. No judgment.
- **Safety-forward**: Frame privacy and security as empowerment, not paranoia.
- **Direct**: Be clear and honest. Avoid corporate jargon and euphemisms.
- **Conversational**: Write like you're talking to a friend, not a brand.

### What NOT to Do
- ❌ Avoid heteronormative language: "Find a girl/guy," "soulmate," "dating."
- ❌ Don't use euphemisms: "Hang out," "spend time," "meet up" (unless appropriate context).
- ❌ No fear-based messaging: "Protect yourself from predators," "Dangerous strangers."
- ❌ Don't patronize: "We'll keep you safe" → "You're in control."
- ❌ Avoid gendered defaults: Always offer options (he/him, she/her, they/them, not specified).

---

## Homepage & Hero

### Hero Headline
**Primary:**
> "Map. Connect. Stay Private."

**Secondary Tagline:**
> "Real-time hookup discovery with the privacy you deserve. 2FA mandatory. Messages encrypted. Location blurred. Ghost mode built-in. No data harvesting, no bullshit—just safe, discreet connections."

### Trust Markers (Below Hero)
```
✅ End-to-end encrypted messaging
✅ 2FA mandatory on every account
✅ Location blurred by default (~200m)
✅ You control who sees you
✅ No data collection or resale
✅ Ghost mode: Hide from map, stay chatting
✅ Disappearing messages: 1h to never
```

### CTA Button Text
- **Primary**: "Start Safely" (gold background, onyx text, pill-shaped)
- **Secondary**: "Learn How We Protect You" (teal text, no background)

---

## Onboarding Flow

### Screen 1: Welcome
**Headline:**
> "Welcome to SafeMap"

**Copy:**
> "Connect with guys near you. Hook up without surveillance. Your privacy is our priority—and it's non-negotiable."

**CTA**: "Let's Go" (gold)

### Screen 2: Sign Up
**Headline:**
> "Create Your Account"

**Form Labels:**
- Email: "Your email" (with hint: "We'll never share or sell this.")
- Password: "Create a password" (with hint: "Min 8 characters, numbers & symbols recommended.")

**Copy Below Form:**
> "By signing up, you agree to our Privacy Policy and Terms. We mean it—read them."

**CTA**: "Next: Verify 2FA" (gold)

### Screen 3: 2FA Setup (CRITICAL)
**Headline:**
> "Verify Your Identity. It's Mandatory."

**Copy:**
> "Two-factor authentication (2FA) protects your account and keeps your hookups private. If your email is ever compromised, 2FA keeps you safe.
> 
> Choose your method:"

**Option A: TOTP (Recommended)**
> "Use an authenticator app (Google Authenticator, Authy, Microsoft Authenticator). Scan this QR code:"

**Option B: Email**
> "We'll send you a 6-digit code every time you log in."

**After Setup:**
**Headline:**
> "Save Your Backup Codes"

**Copy:**
> "If you lose your phone, these codes are your only way back in. Save them somewhere safe. Don't share them with anyone."

[Display 8 codes in monospace]

**CTA**: "I've saved them" (disabled until acknowledged)

### Screen 4: Profile Basics
**Headline:**
> "Tell Us About You"

**Form Fields:**
- Age range: "How old are you?" (18-25, 26-35, 36-45, 46-55, 56+)
- Gender: "How do you identify?" (Masculine, Feminine, Androgynous, Not specified, Custom)
- Headline: "One-liner about yourself" (e.g., "Discreet top, here for fun")
- Bio: "Tell guys more about you" (150 char limit, optional)
- Photos: "Add a clear photo of your face" (required for visibility)
- Tags: "What are you into?" (checkboxes: Vers, Top, Bottom, Hung, Fit, Beard, Smooth, etc.)

**Copy Below:**
> "Your profile is visible to other users. You control what you share—change it anytime."

**CTA**: "You're In. Let's Meet Someone." (gold)

### Screen 5: Success
**Headline:**
> "You're Ready."

**Copy:**
> "Your account is secure. Your location is blurred. Your messages are encrypted. Go find someone."

**CTA**: "See the Map" (gold)

---

## Main App Microcopy

### Map View
**Filter Label:**
> "Show me:" [Dropdown or toggle]
- Online only
- 2FA verified only
- Within X km (slider)

**Ghost Mode Toggle:**
> 🔻 Ghost Mode OFF  /  🔵 Ghost Mode ON
> 
> "Invisible to everyone but still chatting."

**Location Precision:**
> "Your location accuracy: ~200m" [Edit]
> 
> "We blur your exact location for safety. Choose how much detail to show:"
- ~100m (most accurate)
- ~200m (default, recommended)
- ~1km (vague, discreet)

**Map Pin Interaction:**
- Tap pin → Sheet slides up
- Copy on sheet: "[Name], [Age] • [Distance] away"
- Tags below: "Vers, Top, Hung, Hosting"
- Bio: "[User's headline]"

**Empty State (No Users Nearby):**
> "No one nearby right now."
> "Try expanding your search radius or come back later. SafeMap is growing every day."

---

## Profile Sheet

### Header Section
```
[Avatar - tappable for gallery]

[Name] [Blue checkmark if 2FA]
[Age] • [Distance] away • [Timezone]
```

### Status Chips
```
✅ 2FA Verified          🔒 Encrypted Chats
```

### Badges (if applicable)
- "Real Photo" (blue check)
- "Recently Active" (green dot)
- "New User" (gold star)

### Bio Section
```
[Headline]
[Full bio up to 500 chars]

[Tags displayed as pills: Vers, Top, Bottom, Hung, etc.]
```

### CTA Section
```
[Gold Button] Message
[Teal Link] Block This User
[Gray Link] Report
```

### Sheet Bottom Actions
- Swipe to dismiss (or "← Back")

---

## Chat View

### Conversation Header
```
[Avatar] [Name]
Online [green dot] • 2FA Verified [blue check] • 🔒 Encrypted
```

**Yellow Warning (if applicable):**
> "⚠️ [Name] hasn't enabled 2FA yet. It's not your job to convince them, but know they're less protected."

### First Message (System Message)
```
🔒 Your messages are end-to-end encrypted.
Only you and [Name] can read this conversation.
```

### Message Input Area
```
[Text input] [Emoji icon] [Attach photo icon]

[Disappearing messages toggle] ⏱️ Messages disappear after:
- Never (default)
- 1 hour
- 24 hours
- 7 days
```

### Send Button
> "Send" (gold)

### Typing Indicator
> "User is typing..."

### Message Timestamps
> "Today at 2:34 PM"

---

## Chat Messages (Example Conversations)

### Greeting (User A → User B)
**User A**: "Hey, your profile is hot"
**User B**: "Thanks! You look fun. What are you into?"
**User A**: "Vers, love a good top"

### Safety Check-in
**User A**: "You're verified? [blue check]"
**User B**: "Yeah, got 2FA set up. You?"
**User A**: "Just did. Makes me feel safer."

### Privacy Question
**User B**: "Can I take a pic?"
**User A**: "Better ask first 😘 But yeah, just for us"
**System**: 💬 This message will disappear in 1 hour.

---

## Chat List

### Conversation Row
```
[Avatar] [Name]
"Hey, your profile is hot" [Last message, truncated]
2:34 PM [Unread badge if applicable]

[Swipe left to delete/archive]
```

### Empty State
> "No conversations yet. Tap a profile on the map to message someone."

---

## Settings & Privacy

### Privacy Dashboard Title
> "Your Privacy. Your Control."

### Location Section
**Heading**: "Where Are You?"

**Blur Setting:**
> "Your location is blurred to ~200m for safety."
> 
> "Adjust how accurately guys can find you:"
- 100m (very specific)
- 200m (default, good balance)
- 1km (vague, discreet)

**Explanation Copy:**
> "Smaller radius = easier to find but less private. Larger radius = more privacy but harder to meet. Choose what feels right."

### Ghost Mode
**Toggle Label:**
> 🔵 Ghost Mode (ON/OFF)

**Copy:**
> "You won't appear on the map, but you can still message and receive messages. Useful when you want to lurk or lay low."

### Photo Visibility
**Toggle Label:**
> "Blur Photos by Default"

**Copy:**
> "Your photos will be blurred until someone taps to reveal them. Reduces screenshots and forwards."

### 2FA Management
**Status Indicator:**
> ✅ 2FA is enabled via TOTP (Google Authenticator)

**CTA:** "Regenerate Backup Codes" (teal)

**Copy Below:**
> "Lost your phone? Backup codes are your only way to log back in."

### Active Sessions
**Heading:**
> "Where You're Logged In"

**Session Row:**
```
iPhone 13 Pro
San Francisco, CA [blurred]
Last active: Today at 2:30 PM

[Gray link] Sign Out of This Device
```

**Copy:**
> "Review your devices. Sign out anywhere you don't recognize."

### Account Deletion
**CTA:** "Delete My Account" (red text, teal button with warning)

**Confirmation Modal:**
> "Delete Your Account?"
> 
> "This is permanent. All your data will be erased in 30 days. You can cancel anytime before then."

**Buttons:**
- "Cancel" (teal)
- "Yes, Delete My Account" (red)

---

## Error & Success States

### Success Toast
> "✅ 2FA enabled! You're now more secure."
> "✅ Message sent!"
> "✅ Profile updated."

### Error Toast
> "❌ Email already in use. Try logging in instead."
> "❌ Invalid TOTP code. Check your device's time."
> "❌ Network error. Try again in a moment."

### Validation Error (Form)
> "❌ Password must be at least 8 characters."
> "❌ Email is invalid."
> "❌ Passwords don't match."

### Empty States
> "No messages yet. Say hi to someone!"
> "No devices logged in besides this one."
> "No backup codes generated yet. Generate one to be safe."

---

## Accessibility Notes

- **All buttons have clear labels**, not just icons.
- **Color + text**: Never rely on color alone to convey meaning.
- **Contrast**: All text meets WCAG AA (4.5:1).
- **Focus states**: Keyboard users see visible focus rings (gold).
- **Form fields**: Always paired with labels, error messages are explicit.
- **Mobile**: Touch targets are 44px minimum (44x44 or larger).

---

## Voice Guidelines Summary

| Scenario | ✅ Do | ❌ Don't |
|----------|-------|---------|
| Talking about hookups | "Connect. Meet. Hook up." | "Get to know each other." |
| Describing users | "Masculine, Feminine, Androgynous" | "Masc/Fem guys" |
| Privacy features | "Your privacy is protected." | "We keep you safe." |
| 2FA | "2FA keeps your business yours." | "Protect yourself from danger." |
| Errors | "Email is already in use." | "Error code 401." |
| Empty states | "No one nearby right now." | "Search failed." |
| CTAs | "Message," "Connect," "Go Invisible" | "Contact," "Match," "Hide" |

---

**Remember: Every word reinforces that SafeMap is by queer people, for queer people. We're sex-positive, safety-aware, and unapologetically focused on user agency.**
