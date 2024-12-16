// src/pages/telephone/HistorialDeLlamadas.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CallCard from "../../components/Telephone/CallCard";

function HistorialDeLlamadas() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [callsPerPage] = useState(50); // Número de llamadas por página
  const [selectedCallId, setSelectedCallId] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const apiUrl = process.env.REACT_APP_CALLS_API; // URL de API Gateway para llamadas
  const retell = localStorage.getItem("retell") === "true"; // Verificar acceso

  useEffect(() => {
    if (!retell) {
      setError("No tienes acceso a esta sección.");
      setLoading(false);
      return;
    }

    const fetchCalls = async () => {
      try {
        const userPhoneID = localStorage.getItem("userPhoneID");
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userPhoneID, // Pasar userPhoneID como parámetro
          },
        });
        setCalls(response.data);
      } catch (err) {
        console.error("Error al obtener los datos de llamadas:", err);
        setError("Error al obtener los datos de llamadas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [apiUrl, token, retell]);

  // Obtener llamadas actuales según la paginación
  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = calls.slice(indexOfFirstCall, indexOfLastCall);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Renderizar números de página
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(calls.length / callsPerPage);
    const maxPageNumbers = 10; // Máximo de números de página a mostrar
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPageNumbers) {
      const middle = Math.floor(maxPageNumbers / 2);
      startPage = currentPage - middle > 0 ? currentPage - middle : 1;
      endPage =
        startPage + maxPageNumbers - 1 > totalPages
          ? totalPages
          : startPage + maxPageNumbers - 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 border rounded mx-1 ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <span className="ml-4 text-gray-700">Cargando llamadas...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="h-full w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Historial de Llamadas
      </h2>

      {calls.length === 0 ? (
        <p className="text-gray-700">No hay llamadas registradas.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Fecha y Hora</th>
                  <th className="py-2 px-4 border-b">Duración</th>
                  <th className="py-2 px-4 border-b">Tipo</th>
                  <th className="py-2 px-4 border-b">Coste</th>
                  <th className="py-2 px-4 border-b">Coste Margen</th>
                  <th className="py-2 px-4 border-b">ID de Llamada</th>
                  <th className="py-2 px-4 border-b">Razón de Desconexión</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                  <th className="py-2 px-4 border-b">
                    Sentimiento del Usuario
                  </th>
                  <th className="py-2 px-4 border-b">Desde</th>
                  <th className="py-2 px-4 border-b">Hacia</th>
                  <th className="py-2 px-4 border-b">Llamada Exitosa</th>
                  <th className="py-2 px-4 border-b">Buzón de Voz Detectado</th>
                  <th className="py-2 px-4 border-b">Latencia Promedio E2E</th>
                  <th className="py-2 px-4 border-b">Reserva Finalizada</th>
                </tr>
              </thead>
              <tbody>
                {currentCalls.map((call) => (
                  <React.Fragment key={call.call_id}>
                    <tr
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        setSelectedCallId(
                          selectedCallId === call.call_id ? null : call.call_id
                        )
                      }
                    >
                      <td className="py-2 px-4 border-b">
                        {new Date(call.start_timestamp).toLocaleString("es-ES")}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {Math.floor(call.duration_ms / 60000)}m{" "}
                        {Math.floor((call.duration_ms % 60000) / 1000)}s
                      </td>
                      <td className="py-2 px-4 border-b">{call.call_type}</td>
                      <td className="py-2 px-4 border-b">
                        ${call.real_cost.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ${call.cost_with_profit.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b">{call.call_id}</td>
                      <td className="py-2 px-4 border-b">
                        {call.disconnection_reason}
                      </td>
                      <td className="py-2 px-4 border-b">{call.call_status}</td>
                      <td className="py-2 px-4 border-b">
                        {call.user_sentiment}
                      </td>
                      <td className="py-2 px-4 border-b">{call.from_number}</td>
                      <td className="py-2 px-4 border-b">{call.to_number}</td>
                      <td className="py-2 px-4 border-b">
                        {call.call_successful ? "Sí" : "No"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {call.in_voicemail ? "Sí" : "No"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {call.average_end_to_end_latency} ms
                      </td>
                      <td className="py-2 px-4 border-b">
                        {call.reserva_finalizada ? "Sí" : "No"}
                      </td>
                    </tr>
                    {selectedCallId === call.call_id && (
                      <tr>
                        <td colSpan="14" className="p-4 bg-gray-50">
                          <CallCard call={call} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-100"
                >
                  Anterior
                </button>
              )}
              {renderPageNumbers()}
              {currentPage < Math.ceil(calls.length / callsPerPage) && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-100"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HistorialDeLlamadas;
