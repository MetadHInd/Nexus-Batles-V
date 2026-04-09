import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatbotFetch } from '@/api/client';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface ChatbotState {
  isOpen: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  toggle: () => void;
  clearHistory: () => void;
  sendMessage: (text: string) => Promise<void>;
}

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getChatbotUserId(): string {
  const stored = localStorage.getItem('nexusbot-user-id');
  if (stored) return stored;
  const newId = `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem('nexusbot-user-id', newId);
  return newId;
}

function oracleReply(input: string): string {
  const t = input.toLowerCase();
  const isEnglish = /\b(hi|hello|hey|how are you|i am|i'm|english|please)\b/.test(t);

  if (isEnglish) {
    if (t.includes('hero') || t.includes('heroes')) return 'In Nexus there are damage, tank and support heroes. Tell me your preferred playstyle and I will recommend one.';
    if (t.includes('auction')) return 'Auctions are real-time: bids, current price and time limit. Watch the clock and manage your gold.';
    if (t.includes('item') || t.includes('gear')) return 'Items are ranked by rarity. Prioritize synergies with your role and stats: attack/defense/magic.';
    if (t.includes('mission') || t.includes('quest')) return 'Complete missions for gold and XP. Start with EASY/MEDIUM difficulty and level up your gear.';
    if (t.includes('shop') || t.includes('store')) return 'In the shop you can buy packs and items. Tell me your goal (gold, progression, cosmetics) and I will guide you.';
    return 'I hear you, adventurer. Ask me about heroes, auctions, items, missions, or the shop.';
  }

  if (t.includes('héroe') || t.includes('heroes')) return 'En el Nexus hay héroes de daño, tanque y soporte. Dime tu estilo y te recomiendo uno.';
  if (t.includes('subasta')) return 'Las subastas son tiempo real: pujas, precio actual y cierre por tiempo. Vigila el reloj y administra tus monedas.';
  if (t.includes('ítem') || t.includes('item')) return 'Los ítems se clasifican por rareza. Prioriza sinergias con tu rol y stats: ataque/defensa/magia.';
  if (t.includes('misión') || t.includes('mision')) return 'Completa misiones para oro y XP. Empieza por dificultad EASY/MEDIUM y sube cuando tengas equipo.';
  if (t.includes('tienda') || t.includes('shop')) return 'En la tienda puedes comprar paquetes/ítems. Si me dices tu objetivo (oro, progreso, cosmético), te guío.';
  return 'Te escucho, aventurero. Pregúntame sobre héroes, subastas, ítems, misiones o la tienda.';
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isTyping: false,
      messages: [],
      unreadCount: 0,

      toggle: () =>
        set((s) => ({
          isOpen: !s.isOpen,
          unreadCount: !s.isOpen ? 0 : s.unreadCount,
        })),

      clearHistory: () => set({ messages: [], unreadCount: 0, isTyping: false }),

      sendMessage: async (text: string) => {
        const userMsg: ChatMessage = {
          id: nowId(),
          role: 'user',
          content: text,
          timestamp: new Date(),
        };

        set((s) => ({
          messages: [...s.messages, userMsg],
          isTyping: true,
        }));

        let assistantText = oracleReply(text);
        const userId = getChatbotUserId();

        try {
          const response = await chatbotFetch('/chatbot/message', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, message: text }),
          });

          if (response.ok) {
            const data = await response.json();
            if (typeof data.response === 'string' && data.response.trim().length > 0) {
              assistantText = data.response;
            }
          }
        } catch {
          // Si el backend no responde, usamos la respuesta local de emergencia.
        }

        const assistantMsg: ChatMessage = {
          id: nowId(),
          role: 'assistant',
          content: assistantText,
          timestamp: new Date(),
        };

        const isOpen = get().isOpen;
        set((s) => ({
          messages: [...s.messages, assistantMsg],
          isTyping: false,
          unreadCount: isOpen ? 0 : s.unreadCount + 1,
        }));
      },
    }),
    {
      name: 'chatbot-storage',
      partialize: (s) => ({
        isOpen: s.isOpen,
        messages: s.messages,
        unreadCount: s.unreadCount,
      }),
      // Date no se serializa bien; restauramos timestamps.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.messages = (state.messages ?? []).map((m: any) => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        }));
      },
    }
  )
);

