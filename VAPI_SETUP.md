# 🎤 VAPI Voice Assistant Setup Guide

## Quick Setup (5 minutes)

### 1. Get VAPI API Keys

1. Go to [vapi.ai](https://vapi.ai) and create an account
2. Navigate to your dashboard
3. Get your **Public Key** and **Private Key**

### 2. Set Environment Variables

Add these to your `.env.local` file:

```bash
# VAPI Keys
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VAPI_PRIVATE_KEY=your_vapi_private_key_here
```

### 3. Restart Dev Server

```bash
npm run dev
```

## How It Works

### For Users:

1. **Start Trial**: Users go to `/ai-management` and click "Start 7-Day Free Trial"
2. **Configure Assistant**: Customize voice, model, system prompt
3. **Sync Portfolio**: Click "Sync Portfolio Data" to train AI on their profile
4. **Public Profile**: Voice button appears on their public profile (`/[username]`)

### For Visitors:

1. Visit any public profile (e.g., `/john-doe`)
2. Click "Talk to AI Assistant" button
3. Have natural voice conversations about the developer's skills, projects, and experience

## Features Implemented

### ✅ Database Tables
- `ai_voice_assistants` - VAPI assistant configs
- `ai_voice_conversations` - Usage tracking
- `ai_subscriptions` - 7-day trials + premium
- `ai_training_data` - Portfolio data for AI context

### ✅ Pages
- `/ai-management` - Complete AI assistant dashboard
- Voice button on public profiles

### ✅ Server Actions
- `checkVoiceAssistantAccess()` - Check trial/premium status
- `startVoiceAssistantTrial()` - Start 7-day free trial (50 conversations)
- `getVoiceAssistant()` - Auto-creates VAPI assistant
- `updateVoiceAssistant()` - Syncs with VAPI API
- `trackConversation()` - Track usage & costs
- `generateTrainingData()` - Sync portfolio to AI

### ✅ Components
- `VapiVoiceButton` - Beautiful voice call UI with real-time status
- Visual indicators (listening/speaking)
- Call duration timer
- Waveform animations

### ✅ VAPI Integration
- Automatic assistant creation via VAPI API
- Real-time voice conversations
- Event handling (call-start, call-end, speech-start, speech-end)
- Error handling & fallbacks

## Trial System

- **Free Trial**: 7 days, 50 conversations
- **Premium**: Unlimited conversations
- **Automatic Tracking**: Conversations counted automatically
- **Status Display**: Shows days left, usage stats

## Voice Configuration Options

### Voice Providers
- OpenAI (default)
- ElevenLabs
- Deepgram

### Voice IDs (OpenAI)
- Alloy (Neutral)
- Echo (Male)
- Shimmer (Female)
- Nova (Female)
- Fable (British Male)
- Onyx (Deep Male)

### AI Models
- GPT-4O Mini (Fast & Cheap) - Default
- GPT-4O (Best Quality)
- GPT-3.5 Turbo (Budget)

## Customization

Users can customize:
- **Assistant Name**
- **Voice Provider & ID**
- **AI Model**
- **First Message**
- **System Prompt** (How AI responds)
- **Temperature** (Creativity level)

## Analytics

Track:
- Total conversations
- Duration per conversation
- Cost per conversation
- Visitor IDs
- Transcripts (optional)

## Premium Features (Future)

- Unlimited conversations
- Voice cloning
- Custom voice training
- Advanced analytics
- Interview practice mode
- Resume generation from voice

## Support

If you encounter issues:
1. Check VAPI dashboard for assistant status
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure trial is active in `/ai-management`

## Production Deployment

1. Add environment variables to Vercel/hosting platform
2. VAPI assistants auto-create on first use
3. Monitor usage in VAPI dashboard
4. Set up billing for production usage

---

**🎉 You're all set! Users can now start 7-day free trials and add voice assistants to their portfolios!**
