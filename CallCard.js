// src/components/Telephone/CallCard.js
import React from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatAltIcon,
  PhoneIcon,
  CashIcon,
  ClockIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from "@heroicons/react/solid"; // Asegúrate de tener instalados @heroicons/react

function CallCard({ call }) {
  // Función auxiliar para formatear duración en milisegundos a mm:ss
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Función auxiliar para obtener color e icono según sentimiento
  const getSentiment = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return { color: "green", icon: CheckCircleIcon };
      case "Neutral":
        return { color: "yellow", icon: ExclamationCircleIcon };
      case "Negative":
        return { color: "red", icon: ExclamationCircleIcon };
      default:
        return { color: "gray", icon: ExclamationCircleIcon };
    }
  };

  // Función auxiliar para obtener color e icono según estado de la llamada
  const getStatus = (status) => {
    switch (status.toLowerCase()) {
      case "ended":
        return { color: "red", icon: ExclamationCircleIcon };
      case "ongoing":
        return { color: "blue", icon: PhoneIcon };
      case "started":
        return { color: "green", icon: CheckCircleIcon };
      default:
        return { color: "gray", icon: GlobeAltIcon };
    }
  };

  // Desestructuración de sentimiento y obtención de color e icono correspondiente
  const sentiment = getSentiment(call.user_sentiment);
  const status = getStatus(call.call_status);

  return (
    <div className="border border-gray-200 p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Llamada ID: {call.call_id}
        </h2>
        <span
          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${
            call.call_successful ? "green-100" : "red-100"
          } text-${call.call_successful ? "green-800" : "red-800"}`}
        >
          {call.call_successful ? (
            <>
              <CheckCircleIcon className="h-5 w-5 mr-1 text-green-500" />
              Exitosa
            </>
          ) : (
            <>
              <ExclamationCircleIcon className="h-5 w-5 mr-1 text-red-500" />
              Fallida
            </>
          )}
        </span>
      </div>

      {/* Información Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información de la Llamada */}
        <div>
          <p className="flex items-center text-gray-700 mb-2">
            <PhoneIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Desde:</strong> {call.from_number}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <PhoneIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Hacia:</strong> {call.to_number}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <GlobeAltIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Dirección:</strong> {call.direction}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Tipo de Llamada:</strong> {call.call_type}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <status.icon className={`h-5 w-5 text-${status.color}-500 mr-2`} />
            <strong>Estado:</strong>{" "}
            <span className={`font-medium text-${status.color}-700`}>
              {call.call_status}
            </span>
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <strong>Razón de Desconexión:</strong> {call.disconnection_reason}
          </p>
        </div>

        {/* Tiempos y Duración */}
        <div>
          <p className="flex items-center text-gray-700 mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Inicio:</strong>{" "}
            {new Date(call.start_timestamp).toLocaleString("es-ES")}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Fin:</strong>{" "}
            {new Date(call.end_timestamp).toLocaleString("es-ES")}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Duración:</strong> {formatDuration(call.duration_ms)}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
            <strong>Latencia Promedio E2E:</strong>{" "}
            {call.average_end_to_end_latency} ms
          </p>
        </div>
      </div>

      {/* Costes */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <CashIcon className="h-6 w-6 text-green-500 mr-2" />
          Costes de la Llamada
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center text-gray-700 mb-2">
            <CashIcon className="h-5 w-5 text-green-500 mr-2" />
            <strong>Coste Total:</strong> ${call.real_cost.toFixed(2)}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <CashIcon className="h-5 w-5 text-green-500 mr-2" />
            <strong>Coste Unitario por Duración:</strong> $
            {call.call_cost?.total_duration_unit_price.toFixed(4)}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <CashIcon className="h-5 w-5 text-green-500 mr-2" />
            <strong>Coste Con Margen:</strong> $
            {call.cost_with_profit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Análisis de la Llamada */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <ChatAltIcon className="h-6 w-6 text-purple-500 mr-2" />
          Análisis de la Llamada
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="flex items-center text-gray-700 mb-2">
            <sentiment.icon
              className={`h-5 w-5 text-${sentiment.color}-500 mr-2`}
            />
            <strong>Sentimiento del Usuario:</strong>{" "}
            <span className={`font-medium text-${sentiment.color}-700`}>
              {call.user_sentiment}
            </span>
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <CheckCircleIcon
              className={`h-5 w-5 text-${
                call.call_successful ? "green" : "red"
              }-500 mr-2`}
            />
            <strong>Llamada Exitosa:</strong>{" "}
            {call.call_successful ? "Sí" : "No"}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <strong>Buzón de Voz Detectado:</strong>{" "}
            {call.in_voicemail ? "Sí" : "No"}
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            <CheckCircleIcon
              className={`h-5 w-5 text-${
                call.reserva_finalizada ? "green" : "red"
              }-500 mr-2`}
            />
            <strong>Reserva Finalizada:</strong>{" "}
            {call.reserva_finalizada ? "Sí" : "No"}
          </p>
        </div>
      </div>

      {/* Transcripción */}
      <div className="mt-6">
        <strong>Transcripción:</strong>
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-500 hover:underline">
            Ver Transcripción Completa
          </summary>
          <p className="whitespace-pre-wrap mt-2 text-gray-800">
            {call.transcript}
          </p>
        </details>
      </div>

      {/* Enlaces a Grabaciones y Logs */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <a
          href={call.recording_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700 hover:underline"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Ver Grabación
        </a>
        {call.public_log_url && (
          <a
            href={call.public_log_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-blue-700 hover:underline"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Ver Log Público
          </a>
        )}
      </div>
    </div>
  );
}

export default CallCard;
