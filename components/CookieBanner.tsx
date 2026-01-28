
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner: React.FC = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('asarum_cookie_consent');
        if (!consent) {
            setTimeout(() => setShow(true), 2000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('asarum_cookie_consent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[200] max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="glass-morphism bg-asarum-dark/95 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-asarum-red text-3xl shrink-0">
                    <i className="fa-solid fa-cookie-bite"></i>
                </div>

                <div className="flex-grow text-center md:text-left">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Aviso de Privacidad y Cookies</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-medium">
                        Utilizamos cookies propias y de terceros para mejorar la experiencia del usuario a través de su navegación. Si continúas navegando, consideramos que aceptas su uso. Puedes leer nuestra <Link to="/politica-de-privacidad" className="text-white font-black underline decoration-asarum-red underline-offset-4">Política de Privacidad</Link> para más información.
                    </p>
                </div>

                <button
                    onClick={handleAccept}
                    className="bg-asarum-red text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-asarum-red transition-all shadow-xl active:scale-95 shrink-0 whitespace-nowrap"
                >
                    ENTENDIDO
                </button>
            </div>
        </div>
    );
};

export default CookieBanner;
