'use server';

// VAPI API helper functions
const VAPI_API_URL = 'https://api.vapi.ai';

interface CreateAssistantPayload {
  name: string;
  model: {
    provider: string;
    model: string;
    temperature?: number;
    messages?: Array<{ role: string; content: string }>;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  firstMessage?: string;
  serverUrl?: string;
}

export async function createVapiAssistant(data: {
  name: string;
  systemPrompt: string;
  firstMessage?: string;
  voiceProvider?: string;
  voiceId?: string;
  model?: string;
  temperature?: number;
}) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  
  if (!apiKey) {
    throw new Error('VAPI_PRIVATE_KEY not configured');
  }

  const payload: CreateAssistantPayload = {
    name: data.name,
    model: {
      provider: 'openai',
      model: data.model || 'gpt-4o-mini',
      temperature: data.temperature || 0.7,
      messages: [
        {
          role: 'system',
          content: data.systemPrompt
        }
      ]
    },
    voice: {
      provider: data.voiceProvider || 'openai',
      voiceId: data.voiceId || 'alloy'
    },
    firstMessage: data.firstMessage
  };

  try {
    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('VAPI API error:', error);
      throw new Error(`Failed to create assistant: ${response.statusText}`);
    }

    const assistant = await response.json();
    return { success: true, data: assistant };
  } catch (error) {
    console.error('Error creating VAPI assistant:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateVapiAssistant(assistantId: string, data: {
  name?: string;
  systemPrompt?: string;
  firstMessage?: string;
  voiceProvider?: string;
  voiceId?: string;
  model?: string;
  temperature?: number;
}) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  
  if (!apiKey) {
    throw new Error('VAPI_PRIVATE_KEY not configured');
  }

  const payload: Partial<CreateAssistantPayload> = {};

  if (data.name) payload.name = data.name;
  if (data.firstMessage) payload.firstMessage = data.firstMessage;
  
  if (data.systemPrompt || data.model || data.temperature) {
    payload.model = {
      provider: 'openai',
      model: data.model || 'gpt-4o-mini',
      temperature: data.temperature || 0.7,
      messages: data.systemPrompt ? [
        {
          role: 'system',
          content: data.systemPrompt
        }
      ] : undefined
    };
  }

  if (data.voiceProvider || data.voiceId) {
    payload.voice = {
      provider: data.voiceProvider || 'openai',
      voiceId: data.voiceId || 'alloy'
    };
  }

  try {
    const response = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('VAPI API error:', error);
      throw new Error(`Failed to update assistant: ${response.statusText}`);
    }

    const assistant = await response.json();
    return { success: true, data: assistant };
  } catch (error) {
    console.error('Error updating VAPI assistant:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteVapiAssistant(assistantId: string) {
  const apiKey = process.env.VAPI_PRIVATE_KEY;
  
  if (!apiKey) {
    throw new Error('VAPI_PRIVATE_KEY not configured');
  }

  try {
    const response = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('VAPI API error:', error);
      throw new Error(`Failed to delete assistant: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting VAPI assistant:', error);
    return { success: false, error: (error as Error).message };
  }
}
