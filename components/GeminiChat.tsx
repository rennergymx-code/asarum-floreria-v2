
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product, Season } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiChatProps {
  products: Product[];
  currentSeason: Season;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ products, currentSeason }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente inteligente de Asarum. ¿Te gustaría que te ayude a encontrar el regalo perfecto para este San Valentín?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY || '';
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    if (!genAI) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', text: "Lo siento, el servicio de asesoría no está configurado correctamente (falta API Key). Por favor contacta al administrador." }]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
        Eres el "Asesor IA" oficial de Asarum Florería y Regalos. Tu objetivo es ayudar a los clientes a elegir el mejor arreglo floral.
        Información importante:
        - Temporada Actual: ${currentSeason}.
        - Si es San Valentín: El 14 de Febrero NO hay horario de entrega garantizado. Las entregas son en el transcurso del día.
        - Catálogo de productos: ${JSON.stringify(products.map(p => ({
        name: p.name,
        desc: p.description,
        price: p.variants ? p.variants[0].price : p.basePrice,
        category: p.category
      })))}

        Reglas de comportamiento:
        1. Sé amable, elegante y servicial.
        2. Si el usuario pregunta por un presupuesto (ej. "menos de 1000 pesos"), busca en el catálogo productos cuyo precio inicial sea menor o igual a esa cantidad y recomiéndalos por su nombre.
        3. Siempre menciona que somos expertos en Hermosillo y SLRC.
        4. No inventes productos que no estén en la lista.
        5. Mantén tus respuestas concisas y enfocadas en la venta.
      `;

      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      // We send the combined prompt for context
      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: `Pregunta del cliente: ${userMessage}` }
      ]);

      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hubo un pequeño error al procesar tu solicitud. Por favor, intenta de nuevo o contáctanos por WhatsApp." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-96 h-[550px] glass-card flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500 pointer-events-auto shadow-asarum-red/10 border-white/60">
          {/* Header */}
          <div className="bg-asarum-dark p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-asarum-red/20 rounded-bl-full -z-0"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl glass-morphism border-white/20 flex items-center justify-center text-asarum-red bg-white/10">
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Asesor AI</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">En Línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/30 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'user'
                  ? 'bg-asarum-dark text-white rounded-tr-none shadow-xl'
                  : 'bg-white text-asarum-dark border border-white rounded-tl-none font-medium'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none border border-white">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-asarum-red/40 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-asarum-red/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-asarum-red/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/40">
            <div className="flex gap-3 glass-morphism p-2 rounded-3xl bg-white/50 border border-white">
              <input
                type="text"
                placeholder="Escribe tu duda..."
                className="flex-grow px-4 bg-transparent text-sm font-bold text-asarum-dark placeholder:text-asarum-slate outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-asarum-red text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-asarum-dark transition-all shadow-lg shadow-asarum-red/20 active:scale-90"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2rem] bg-asarum-dark hover:bg-asarum-red text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-90 pointer-events-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-wand-magic-sparkles'} transition-transform duration-500`}></i>
        {!isOpen && (
          <span className="absolute top-4 right-4 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asarum-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-asarum-red"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
