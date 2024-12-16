// src/pages/telephone/DashboardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { PhoneIcon } from "@heroicons/react/solid";

function DashboardPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <span className="ml-4 text-gray-700">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Función para obtener el mes en formato "YYYY-MM"
  const getMonth = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}`;
  };

  // Filtrar llamadas del mes actual
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const callsCurrentMonth = calls.filter(
    (call) => getMonth(call.start_timestamp) === currentMonth
  );

  // 1. Precio Total de las Llamadas del Mes Actual
  const totalPriceCurrentMonth = callsCurrentMonth.reduce(
    (acc, call) => acc + call.cost_with_profit,
    0
  );

  // 2. Reservas Realizadas en el Mes Actual
  const reservationsCurrentMonth = callsCurrentMonth.filter(
    (call) => call.reserva_finalizada
  ).length;

  // 3. Número de Llamadas en el Mes Actual
  const numberOfCallsCurrentMonth = callsCurrentMonth.length;

  // 4. Estadísticas Mensuales
  const statisticsPerMonth = calls.reduce((acc, call) => {
    const month = getMonth(call.start_timestamp);
    if (!acc[month]) {
      acc[month] = {
        month,
        llamadas: 0,
        coste_total: 0,
        reservas: 0,
      };
    }
    acc[month].llamadas += 1;
    acc[month].coste_total += call.total_cost;
    if (call.reserva_finalizada) {
      acc[month].reservas += 1;
    }
    return acc;
  }, {});

  // Convertir el objeto a un arreglo y ordenar por mes
  const statisticsPerMonthArray = Object.values(statisticsPerMonth).sort(
    (a, b) => new Date(a.month + "-01") - new Date(b.month + "-01")
  );

  // 5. Sentimiento del Usuario
  const sentimentData = [
    {
      name: "Positivo",
      value: calls.filter((call) => call.user_sentiment === "Positive").length,
    },
    {
      name: "Neutral",
      value: calls.filter((call) => call.user_sentiment === "Neutral").length,
    },
    {
      name: "Negativo",
      value: calls.filter((call) => call.user_sentiment === "Negative").length,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  // 6. Estado de las Llamadas
  const statusData = [
    {
      name: "Exitosa",
      count: calls.filter((call) => call.call_successful).length,
    },
    {
      name: "Fallida",
      count: calls.filter((call) => !call.call_successful).length,
    },
  ];

  // 7. Distribución de Costes
  const costData = calls.map((call) => ({
    call_id: call.call_id,
    coste_total: call.total_cost,
    coste_combinado: call.call_cost?.combined_cost || 0,
  }));

  // 8. Número de Llamadas por Día
  const callsPerDay = calls.reduce((acc, call) => {
    const date = new Date(call.start_timestamp).toLocaleDateString("es-ES");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const callsPerDayData = Object.keys(callsPerDay).map((date) => ({
    fecha: date,
    llamadas: callsPerDay[date],
  }));

  // 9. Duración Promedio de Llamadas
  const averageDuration =
    calls.length > 0
      ? calls.reduce((acc, call) => acc + call.duration_ms, 0) /
        calls.length /
        1000
      : 0;

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>

      {/* Resumen de Estadísticas del Mes Actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Precio Total */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Precio Total (Este Mes)</p>
            <p className="text-xl font-semibold">
              ${totalPriceCurrentMonth.toFixed(2)}
            </p>
          </div>
        </div>
        {/* Reservas Realizadas */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <UserGroupIcon className="h-8 w-8 text-purple-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">
              Reservas Realizadas (Este Mes)
            </p>
            <p className="text-xl font-semibold">{reservationsCurrentMonth}</p>
          </div>
        </div>
        {/* Número de Llamadas */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <PhoneIcon className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">
              Número de Llamadas (Este Mes)
            </p>
            <p className="text-xl font-semibold">{numberOfCallsCurrentMonth}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Sentimiento del Usuario */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Sentimiento del Usuario
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Estado de las Llamadas */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Estado de las Llamadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Llamadas por Día */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Número de Llamadas por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={callsPerDayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="llamadas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Coste Total por Llamada */}
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">
            Coste Total por Llamada
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={costData.slice(0, 20)} // Mostrar solo las primeras 20 llamadas para mejor visualización
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="call_id" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="coste_total" fill="#82ca9d" />
              <Bar dataKey="coste_combinado" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Estadísticas Mensuales */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Estadísticas Mensuales</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={statisticsPerMonthArray}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="llamadas"
              stroke="#8884d8"
              name="Número de Llamadas"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="reservas"
              stroke="#82ca9d"
              name="Reservas Realizadas"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="coste_total"
              stroke="#FF8042"
              name="Coste Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Duración Promedio de Llamadas */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">
          Duración Promedio de Llamadas
        </h3>
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
          <span className="text-lg">{averageDuration.toFixed(2)} segundos</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
