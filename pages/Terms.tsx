
import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto glass-card p-10 md:p-16 border-white bg-white/60">
                <h1 className="text-4xl md:text-5xl font-black text-asarum-dark uppercase tracking-tighter mb-10 text-center">Términos y Condiciones</h1>

                <div className="space-y-8 text-asarum-slate leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">1. Identificación del Titular</h2>
                        <p>
                            El presente sitio web asarumfloreria.com es operado por <strong>YASODHARA AMPARO ROMERO PANTOJA</strong> (en lo sucesivo "ASARUM FLORERIA Y REGALOS"), con domicilio en Av. Libertad y Calle 12 #1200, Col. Cuauhtémoc, CP 83400, San Luis Río Colorado, Sonora.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">2. Uso del Sitio</h2>
                        <p>
                            Al acceder y utilizar este sitio web, usted acepta cumplir con estos términos y condiciones. El uso de este sitio para fines ilícitos o no autorizados está estrictamente prohibido. Nos reservamos el derecho de denegar el servicio a cualquier persona por cualquier motivo en cualquier momento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">3. Productos y Precios</h2>
                        <p>
                            Todos los productos mostrados en nuestro catálogo están sujetos a disponibilidad. Los precios están expresados en Pesos Mexicanos (MXN) e incluyen los impuestos aplicables. Nos reservamos el derecho de modificar los precios sin previo aviso. Debido a la naturaleza de las flores, las imágenes son ilustrativas; la variedad exacta o color de las flores puede variar según la temporada y disponibilidad, manteniendo siempre la calidad y valor del diseño.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">4. Políticas de Envío</h2>
                        <p>
                            Realizamos entregas locales en Hermosillo y San Luis Río Colorado. Es responsabilidad del cliente proporcionar la dirección correcta y completa. En fechas de alta demanda como el 14 de Febrero o el 10 de Mayo, NO se garantizan horarios específicos de entrega, realizándose éstas en el transcurso del día seleccionado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">5. Pagos y seguridad</h2>
                        <p>
                            Las transacciones se procesan de forma segura a través de <strong>Stripe</strong>. No almacenamos los datos de su tarjeta en nuestros servidores. Una vez confirmado el pago, se procederá con la elaboración y envío de su pedido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">6. Cancelaciones y Devoluciones</h2>
                        <p>
                            Dada la naturaleza perecedera de nuestros productos, las devoluciones no son aplicables. Las cancelaciones se aceptarán con al menos 24 horas de anticipación a la fecha de entrega, sujeto a cargos por procesamiento administrativo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black text-asarum-dark uppercase tracking-wide mb-4">7. Legislación Aplicable</h2>
                        <p>
                            Estos términos se rigen por las leyes vigentes en México. Cualquier controversia será resuelta ante los tribunales competentes en el estado de Sonora.
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

export default Terms;
