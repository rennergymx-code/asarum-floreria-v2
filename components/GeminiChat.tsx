
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
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
    { role: 'model', text: '¡Hola! Soy tu asistente de Asarum Florería. ¿Buscas algo especial para hoy? Recuerda que para este 14 de Febrero no contamos con horario fijo de entrega por la alta demanda.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const productsContext = products.map(p => `- ${p.name}: ${p.description} (Desde $${p.basePrice})`).join('\n');
      
      const systemInstruction = `
        Eres un asistente de ventas experto para "Asarum Florería y Regalos".
        Información de la empresa:
        - Sucursal Hermosillo: Desde 2015.
        - Sucursal San Luis Río Colorado: Desde 1994.
        - Temporada actual: ${currentSeason}.
        - IMPORTANTE: Para el 14 de Febrero (San Valentín), NO se garantizan horarios de entrega específicos debido a la alta demanda. Debes mencionar esto si te preguntan sobre entregas o si el usuario está interesado en comprar para esa fecha.
        - Tu objetivo es ayudar al usuario a elegir un arreglo y cerrar la venta.
        - Sé amable, profesional y romántico/detallista.
        - Catálogo actual disponible:
        ${productsContext}
        
        Si el usuario está listo para comprar, indícale que puede agregar el producto al carrito o ir a la sección de catálogo.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          parts: [{ text: m.text }],
          role: m.role
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const modelText = response.text || 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.';
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, no puedo responder en este momento. Por favor contactanos por WhatsApp.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-asarum-red p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <p className="text-sm font-bold">Asesor Asarum AI</p>
                <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-asarum-red text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input 
              type="text" 
              placeholder="Escribe tu duda..."
              className="flex-grow px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 ring-asarum-red/20"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-asarum-red text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-800 transition-colors shadow-lg active:scale-95"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-asarum-red hover:bg-red-800 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 group relative"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} transition-transform duration-300`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
