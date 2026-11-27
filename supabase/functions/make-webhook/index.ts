declare const EdgeRuntime: {
  waitUntil(promise: Promise<unknown>): void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type EventPayload = Record<string, unknown> & {
  full_name: string;
  email: string;
  phone: string;
  message: string;
  eventType: 'signup' | 'enquiry';
};

function isEventPayload(body: unknown): body is EventPayload {
  return typeof body === 'object' &&
    body !== null &&
    'full_name' in body &&
    typeof body.full_name === 'string' &&
    'email' in body &&
    typeof body.email === 'string' &&
    'phone' in body &&
    typeof body.phone === 'string' &&
    'message' in body &&
    typeof body.message === 'string' &&
    'eventType' in body &&
    (body.eventType === 'signup' || body.eventType === 'enquiry');
}

async function deliverWebhook(payload: EventPayload, webhookUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Make.com returned HTTP ${response.status}.`);
    }
    console.info(`Make.com accepted ${payload.eventType} event with HTTP ${response.status}.`);
  } catch (error) {
    console.error('Make.com webhook delivery failed:', error);
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed.', {
      status: 405,
      headers: corsHeaders
    });
  }

  const webhookUrl = Deno.env.get('MAKE_WEBHOOK_URL');
  if (!webhookUrl) {
    console.error('MAKE_WEBHOOK_URL is not configured.');
    return Response.json({ error: 'Webhook configuration is missing.' }, {
      status: 503,
      headers: corsHeaders
    });
  }

  let payload: EventPayload;
  try {
    const body: unknown = await request.json();
    if (!isEventPayload(body)) {
      return Response.json({ error: 'Unsupported event payload.' }, {
        status: 400,
        headers: corsHeaders
      });
    }
    payload = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      eventType: body.eventType
    };
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, {
      status: 400,
      headers: corsHeaders
    });
  }

  EdgeRuntime.waitUntil(deliverWebhook(payload, webhookUrl));
  return Response.json({ accepted: true }, { headers: corsHeaders });
});
