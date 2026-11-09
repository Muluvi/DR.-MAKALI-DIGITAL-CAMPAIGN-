/**
 * Outbound channels for tasks and broadcasts, behind one clean adapter.
 *
 *   WhatsApp   Firefly's WhatsApp Business API (Cloud API). Configured by WHATSAPP_ACCESS_TOKEN,
 *              WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_TEMPLATE (an approved utility template with
 *              one body parameter). Business-initiated messages need an approved template.
 *   USSD       Firefly's USSD shortcode. USSD is a session the campaigner opens by dialling, so it
 *              carries task acknowledgement and short numeric reports inbound
 *              (app/api/network/ussd/route.ts). An outbound USSD push is sent only where the
 *              gateway offers one: USSD_PUSH_URL and USSD_PUSH_KEY.
 *
 * NEVER FAKE A DELIVERY. A send the provider did not accept is recorded as "failed" with its reason;
 * "sent" means the provider accepted the request, never that a person read it. With no credentials
 * the adapter reports `configured: false` and the service sends nothing on that channel; the tool
 * says so beside every task, and the story's phone journeys are labelled previews.
 *
 * There is no SMS adapter: the network sends no bulk political SMS.
 *
 * Phone numbers are passed to the provider and nowhere else: never logged, never in an error.
 */
export interface SendResult {
  status: "sent" | "failed";
  error: string | null;
  provider_id: string | null;
}

export interface ChannelAdapter {
  id: "whatsapp" | "ussd";
  label: string;
  configured: boolean;
  send(to: string, text: string): Promise<SendResult>;
}

export interface Channels {
  whatsapp: ChannelAdapter;
  ussd: ChannelAdapter;
}

type Fetch = typeof fetch;
type Env = Record<string, string | undefined>;

const failed = (error: string): SendResult => ({ status: "failed", error, provider_id: null });

export function whatsappAdapter(env: Env, fetcher: Fetch = fetch): ChannelAdapter {
  const token = env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
  const template = env.WHATSAPP_TEMPLATE;
  const configured = !!(token && phoneId && template);
  return {
    id: "whatsapp",
    label: "WhatsApp",
    configured,
    async send(to, text) {
      if (!configured) return failed("WhatsApp is not connected on this deployment.");
      try {
        const res = await fetcher(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to.replace(/^\+/, ""),
            type: "template",
            template: { name: template, language: { code: env.WHATSAPP_TEMPLATE_LANG || "en" }, components: [{ type: "body", parameters: [{ type: "text", text: text.slice(0, 1000) }] }] },
          }),
        });
        if (!res.ok) return failed(`WhatsApp refused the message (HTTP ${res.status}).`);
        const body = (await res.json().catch(() => ({}))) as { messages?: { id?: string }[] };
        const id = body.messages?.[0]?.id ?? null;
        return id ? { status: "sent", error: null, provider_id: id } : failed("WhatsApp did not return a message id.");
      } catch {
        return failed("WhatsApp could not be reached.");
      }
    },
  };
}

export function ussdAdapter(env: Env, fetcher: Fetch = fetch): ChannelAdapter {
  const url = env.USSD_PUSH_URL;
  const key = env.USSD_PUSH_KEY;
  const configured = !!(url && key);
  return {
    id: "ussd",
    label: "USSD",
    configured,
    async send(to, text) {
      if (!configured) return failed("USSD push is not connected on this deployment. The campaigner sees the task when they dial in.");
      try {
        const res = await fetcher(url!, {
          method: "POST",
          headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
          body: JSON.stringify({ phoneNumber: to, message: text.slice(0, 182) }),
        });
        if (!res.ok) return failed(`The USSD gateway refused the push (HTTP ${res.status}).`);
        const body = (await res.json().catch(() => ({}))) as { id?: string; sessionId?: string };
        return { status: "sent", error: null, provider_id: body.id ?? body.sessionId ?? null };
      } catch {
        return failed("The USSD gateway could not be reached.");
      }
    },
  };
}

export const channelsFromEnv = (env: Env = process.env, fetcher?: Fetch): Channels => ({
  whatsapp: whatsappAdapter(env, fetcher),
  ussd: ussdAdapter(env, fetcher),
});
