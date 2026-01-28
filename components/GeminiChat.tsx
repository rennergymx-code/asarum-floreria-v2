
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
    { role: 'model', text: '¡Hola! Soy Elena de Asarum. ¿En qué puedo ayudarte hoy para encontrar el detalle perfecto?' }
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
        setMessages(prev => [...prev, { role: 'model', text: "Lo siento, Elena no puede responder en este momento (falta configuración). Por favor contacta al administrador." }]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
        Eres "Elena", la asesora experta de Asarum Florería y Regalos. Tu objetivo es ayudar a los clientes a elegir el mejor arreglo floral.
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
        1. Sé amable, elegante y servicial. Tu tono debe ser cálido y profesional.
        2. IMPORTANTE: Siempre pregunta por el presupuesto del cliente de manera sutil si aún no lo ha mencionado, para poder recomendarle la mejor opción.
        3. Si el usuario menciona un presupuesto o rango, busca en el catálogo productos que se ajusten y recomiéndalos con entusiasmo.
        4. Siempre menciona que somos expertos en Hermosillo y SLRC. Tenemos más de 30 años de experiencia.
        5. Nuestra filosofía: "NOSOTROS NO SOLO ELABORAMOS DETALLES, NOSOTROS CREAMOS EMOCIONES".
        6. No inventes productos.
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

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: `Pregunta del cliente: ${userMessage}` }
      ]);

      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hubo un pequeño error. Por favor, intenta de nuevo o contáctanos por WhatsApp." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-80 h-[480px] glass-card flex flex-col mb-4 overflow-hidden animate-in fade-in zoom-in duration-300 pointer-events-auto shadow-2xl border-white/40">
          {/* Header */}
          <div className="bg-asarum-dark p-5 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#AEED5D]/10 rounded-bl-full -z-0 pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-asarum-red/10 border border-white/10 flex items-center justify-center text-asarum-red">
                <i className="fa-solid fa-leaf text-lg"></i>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#AEED5D]">Elena</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[8px] opacity-60 uppercase font-black tracking-widest">Asesora Experta</span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all opacity-60 hover:opacity-100 relative z-10"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-5 bg-white/40 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${m.role === 'user'
                  ? 'bg-asarum-dark text-white rounded-tr-none shadow-lg'
                  : 'bg-white text-asarum-dark border border-gray-100 rounded-tl-none font-medium'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/60 p-3 rounded-2xl rounded-tl-none border border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-asarum-red/30 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-asarum-red/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-asarum-red/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white/80 border-t border-gray-100">
            <div className="flex gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
              <input
                type="text"
                placeholder="Pregunta a Elena..."
                className="flex-grow px-3 bg-transparent text-xs font-bold text-asarum-dark placeholder:text-asarum-slate outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-asarum-red text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-asarum-dark transition-all active:scale-95 shadow-lg shadow-asarum-red/10"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button - Small, Subtle, Elegant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-asarum-dark hover:bg-asarum-red text-white shadow-2xl flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95 pointer-events-auto group relative border border-white/20"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} transition-all duration-300`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-asarum-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-asarum-red border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
