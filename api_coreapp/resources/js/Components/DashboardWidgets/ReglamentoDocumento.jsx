import React, { forwardRef } from "react";

const pageStyle = {
    width: "8.5in",
    height: "11in",
    padding: "1in",
    backgroundColor: "white",
    color: "black",
    fontFamily: "sans-serif",
    lineHeight: "1.5",
    margin: "0 auto",
    boxSizing: "border-box",
    position: "relative",
    pageBreakAfter: "always",
};

const footerStyle = {
    position: "absolute",
    bottom: "0.6in",
    left: "1in",
    right: "1in",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
    fontSize: "9pt",
    textAlign: "center",
    color: "#777",
};

const ReglamentoDocumento = forwardRef((props, ref) => {
    return (
        <div style={{ display: "none" }}>
            <div ref={ref}>
                <style type="text/css" media="print">
                    {`
          @page { size: letter; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; }
        `}
                </style>

                {/* PAGINA 1 */}
                <div style={pageStyle}>
                    <div style={{ textAlign: "center", marginBottom: "30px" }}>
                        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26pt" }}>
                            LIGA SANTIAGO ZAPOTITLÁN
                        </h1>
                        <h2 style={{ fontWeight: "normal", color: "#555" }}>
                            REGLAMENTO OFICIAL DE COMPETENCIA
                        </h2>
                        <p>Temporada 2025 - 2026</p>
                    </div>

                    <div style={{ fontSize: "11pt" }}>
                        <h3>CAPÍTULO I - DISPOSICIONES GENERALES</h3>

                        <p>
                            <strong>Art. 1 - Objetivo:</strong> La Liga Santiago Zapotitlán
                            tiene como finalidad fomentar el deporte, la convivencia social y
                            el respeto entre los participantes.
                        </p>

                        <p>
                            <strong>Art. 2 - Autoridad:</strong> La mesa directiva será la
                            autoridad máxima de la liga y estará integrada por presidente,
                            secretario y tesorero.
                        </p>

                        <p>
                            <strong>Art. 3 - Participación:</strong> Todos los equipos
                            participantes deberán aceptar el presente reglamento.
                        </p>

                        <p>
                            <strong>Art. 4 - Sistema de competencia:</strong> El torneo se
                            jugará bajo el sistema de todos contra todos durante la fase
                            regular.
                        </p>

                        <p>
                            <strong>Art. 5 - Puntuación:</strong>
                        </p>

                        <ul>
                            <li>Victoria: 3 puntos</li>
                            <li>Empate: 1 punto</li>
                            <li>Derrota: 0 puntos</li>
                        </ul>

                        <p>
                            <strong>Art. 6 - Tabla general:</strong> La posición en la tabla se
                            determinará por los puntos obtenidos.
                        </p>

                        <p>
                            <strong>Art. 7 - Desempate:</strong> En caso de empate se aplicará:
                        </p>

                        <ol>
                            <li>Diferencia de goles</li>
                            <li>Goles anotados</li>
                            <li>Resultado entre equipos</li>
                            <li>Fair play</li>
                        </ol>
                    </div>

                    <div style={footerStyle}>
                        Documento oficial emitido por la mesa directiva. Santiago
                        Zapotitlán, Tláhuac, CDMX.
                        <br />
                        Página 1 de 5
                    </div>
                </div>

                {/* PAGINA 2 */}
                <div style={pageStyle}>
                    <div style={{ fontSize: "11pt" }}>
                        <h3>CAPÍTULO II - DE LOS EQUIPOS</h3>

                        <p>
                            <strong>Art. 8 - Registro:</strong> Cada equipo deberá registrarse
                            antes del inicio del torneo.
                        </p>

                        <p>
                            <strong>Art. 9 - Plantilla:</strong> Cada equipo podrá registrar
                            hasta 25 jugadores.
                        </p>

                        <p>
                            <strong>Art. 10 - Documentación:</strong> Los jugadores deberán
                            presentar identificación oficial.
                        </p>

                        <p>
                            <strong>Art. 11 - Altas y bajas:</strong> Solo podrán realizarse
                            durante los periodos establecidos por la liga.
                        </p>

                        <h3>CAPÍTULO III - DE LOS JUGADORES</h3>

                        <p>
                            <strong>Art. 12 - Uniforme:</strong> Es obligatorio usar uniforme
                            completo.
                        </p>

                        <p>
                            <strong>Art. 13 - Numeración:</strong> Cada jugador deberá portar
                            número visible.
                        </p>

                        <p>
                            <strong>Art. 14 - Espinilleras:</strong> Son obligatorias para
                            participar.
                        </p>

                        <p>
                            <strong>Art. 15 - Jugadores no registrados:</strong> La alineación
                            indebida provocará la pérdida del partido por marcador de 3-0.
                        </p>
                    </div>

                    <div style={footerStyle}>
                        Documento oficial emitido por la mesa directiva.
                        <br />
                        Página 2 de 5
                    </div>
                </div>

                {/* PAGINA 3 */}
                <div style={pageStyle}>
                    <div style={{ fontSize: "11pt" }}>
                        <h3>CAPÍTULO IV - DESARROLLO DE LOS PARTIDOS</h3>

                        <p>
                            <strong>Art. 16 - Duración:</strong> Los partidos tendrán una
                            duración de 90 minutos.
                        </p>

                        <p>
                            <strong>Art. 17 - Descanso:</strong> Habrá descanso de 10 minutos
                            entre tiempos.
                        </p>

                        <p>
                            <strong>Art. 18 - Tolerancia:</strong> La tolerancia máxima para
                            iniciar un partido será de 10 minutos.
                        </p>

                        <p>
                            <strong>Art. 19 - Cambios:</strong> Cada equipo podrá realizar
                            hasta 5 sustituciones.
                        </p>

                        <p>
                            <strong>Art. 20 - Balón:</strong> El equipo local deberá
                            proporcionar el balón oficial.
                        </p>
                    </div>

                    <div style={footerStyle}>
                        Documento oficial emitido por la mesa directiva.
                        <br />
                        Página 3 de 5
                    </div>
                </div>

                {/* PAGINA 4 */}
                <div style={pageStyle}>
                    <div style={{ fontSize: "11pt" }}>
                        <h3>CAPÍTULO V - DEL ARBITRAJE</h3>

                        <p>
                            <strong>Art. 21 - Autoridad arbitral:</strong> El árbitro será la
                            máxima autoridad durante el partido.
                        </p>

                        <p>
                            <strong>Art. 22 - Decisiones:</strong> Las decisiones arbitrales
                            serán definitivas.
                        </p>

                        <h3>CAPÍTULO VI - FALTAS Y SANCIONES</h3>

                        <p>
                            <strong>Art. 23 - Tarjetas amarillas:</strong> La acumulación de 3
                            tarjetas implicará suspensión de un partido.
                        </p>

                        <p>
                            <strong>Art. 24 - Tarjeta roja:</strong> Implica suspensión mínima
                            de un partido.
                        </p>

                        <p>
                            <strong>Art. 25 - Agresiones:</strong> Cualquier agresión física
                            provocará expulsión del torneo.
                        </p>
                    </div>

                    <div style={footerStyle}>
                        Documento oficial emitido por la mesa directiva.
                        <br />
                        Página 4 de 5
                    </div>
                </div>

                {/* PAGINA 5 */}
                <div style={{ ...pageStyle, pageBreakAfter: "auto" }}>
                    <div style={{ fontSize: "11pt" }}>
                        <h3>CAPÍTULO VII - PREMIACIÓN</h3>

                        <p>
                            <strong>Art. 26 - Campeón:</strong> Recibirá trofeo y reconocimiento
                            oficial.
                        </p>

                        <p>
                            <strong>Art. 27 - Subcampeón:</strong> Recibirá trofeo
                            correspondiente.
                        </p>

                        <p>
                            <strong>Art. 28 - Reconocimientos:</strong> Se premiará al campeón
                            goleador y mejor portero.
                        </p>

                        <h3>CAPÍTULO VIII - DISPOSICIONES FINALES</h3>

                        <p>
                            <strong>Art. 29 - Interpretación:</strong> Cualquier situación no
                            prevista será resuelta por la mesa directiva.
                        </p>

                        <p>
                            <strong>Art. 30 - Vigencia:</strong> Este reglamento entra en vigor
                            a partir del inicio de la temporada.
                        </p>
                    </div>

                    <div style={footerStyle}>
                        Documento oficial emitido por la mesa directiva.
                        <br />
                        Página 5 de 5
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ReglamentoDocumento;