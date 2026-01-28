
import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto glass-card p-10 md:p-16 border-white bg-white/60">
                <h1 className="text-4xl md:text-5xl font-black text-asarum-dark uppercase tracking-tighter mb-10 text-center">Política de Privacidad</h1>

                <div className="space-y-8 text-asarum-slate leading-relaxed text-sm md:text-base">
                    <p className="italic text-asarum-dark font-medium">
                        En ASARUM FLORERIA Y REGALOS, valoramos su privacidad y nos comprometemos a proteger sus datos personales.
                    </p>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">1. Responsable del Tratamiento</h2>
                        <p>
                            <strong>YASODHARA AMPARO ROMERO PANTOJA</strong>, con nombre comercial ASARUM FLORERIA Y REGALOS y domicilio en Cjon. Madero y 6ta, Col. Comercial, CP 83449, San Luis Río Colorado, Sonora, es responsable del uso y protección de sus datos personales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">2. Datos Recabados</h2>
                        <p>
                            Para llevar a cabo las finalidades descritas en el presente aviso, recabamos:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Nombre completo del remitente y destinatario.</li>
                                <li>Teléfono de contacto.</li>
                                <li>Correo electrónico.</li>
                                <li>Dirección de entrega.</li>
                                <li>Datos de pago (procesados externamente por Stripe).</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">3. Finalidad del Uso de Datos</h2>
                        <p>
                            Sus datos personales serán utilizados para:
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Procesar y entregar sus pedidos de flores.</li>
                                <li>Notificar sobre el estatus de su entrega vía WhatsApp o correo.</li>
                                <li>Emitir comprobantes de compra.</li>
                                <li>Atender sugerencias y quejas.</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">4. Transferencia de Datos</h2>
                        <p>
                            Sus datos no son compartidos con terceros ajenos a la transacción, salvo con el procesador de pagos <strong>Stripe</strong> y las autoridades competentes que así lo requieran legalmente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">5. Derechos ARCO</h2>
                        <p>
                            Usted tiene derecho a conocer qué datos tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información (Rectificación), que la eliminemos de nuestros registros (Cancelación) u oponerse al uso de sus datos (Oposición). Para ejercer estos derechos, envíe una solicitud a nuestro contacto oficial.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">6. Uso de Cookies</h2>
                        <p>
                            Este sitio utiliza cookies para mejorar la experiencia de navegación. Puede obtener más información sobre su uso y cómo desactivarlas en la configuración de su navegador.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-asarum-slate">
                        Última actualización: 27 de Enero de 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
