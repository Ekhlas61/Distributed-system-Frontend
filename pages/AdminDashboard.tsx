import React, { useState, useEffect } from "react";
import { adminService } from "../api/adminService";
import { catalogService } from "../api/catalogService";
import { bookingService } from "../api/bookingService";
import {
  SystemHealth,
  SystemMetrics,
  Event,
  CreateEventRequest,
  Reservation,
} from "../types";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Form states
  const [eventForm, setEventForm] = useState<CreateEventRequest>({
    name: "",
    start_at: "",
    price_cents: 0,
    total_tickets: 0,
  });

  const fetchData = async () => {
    const [healthData, metricsData] = await Promise.all([
      adminService.getSystemHealth(),
      adminService.getMetrics(),
    ]);
    setHealth(healthData);
    setMetrics(metricsData);
    setLoading(false);
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const response = await catalogService.getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setActionError(String(error));
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchEventReservations = async (eventId: string) => {
    setReservationsLoading(true);
    try {
      const response = await bookingService.getEventReservations(eventId);
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await catalogService.createEvent(eventForm);
      setShowAddModal(false);
      setActionError(null);
      setEventForm({
        name: "",
        start_at: "",
        price_cents: 0,
        total_tickets: 0,
      });
      fetchEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
      setActionError('Failed to create event: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    try {
      await catalogService.updateEvent(selectedEvent.id, eventForm);
      setShowEditModal(false);
      setActionError(null);
      setSelectedEvent(null);
      setEventForm({
        name: "",
        start_at: "",
        price_cents: 0,
        total_tickets: 0,
      });
      fetchEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
      setActionError('Failed to update event: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventId) return;
    try {
      await catalogService.deleteEvent(selectedEventId);
      setShowDeleteConfirm(false);
      setActionError(null);
      setSelectedEventId(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      setActionError('Failed to delete event: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      name: event.name,
      start_at: event.start_at,
      price_cents: event.price_cents,
      total_tickets: event.total_tickets,
      metadata: event.metadata,
    });
    setShowEditModal(true);
  };

  const openReservationsModal = async (eventId: string) => {
    setSelectedEventId(eventId);
    setShowReservationsModal(true);
    await fetchEventReservations(eventId);
  };

  if (loading && activeTab === "overview")
    return (
      <div className="text-center py-24">
        Aggregating distributed system logs...
      </div>
    );

  return (
    <div className="space-y-12">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "events"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Event Management
          </button>
        </nav>
      </div>

      {activeTab === "overview" && (
        <>
          <section>
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                System Overview
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Aggregated real-time metrics across all service clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Total Reservations
                </p>
                <p className="text-4xl font-black text-blue-600">
                  {metrics?.totalReservations}
                </p>
                <div className="mt-4 flex items-center text-green-600 text-xs font-bold">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  +12% vs last hour
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Platform Revenue
                </p>
                <p className="text-4xl font-black text-indigo-600">
                  ${metrics?.revenue.toLocaleString()}
                </p>
                <p className="mt-4 text-[10px] text-gray-400 font-mono">
                  Synced from Payment-Svc
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Active Sessions
                </p>
                <p className="text-4xl font-black text-purple-600">
                  {metrics?.activeUsers}
                </p>
                <p className="mt-4 text-[10px] text-gray-400 font-mono">
                  Distributed Redis state
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Catalog Items
                </p>
                <p className="text-4xl font-black text-green-600">
                  {metrics?.totalEvents}
                </p>
                <p className="mt-4 text-[10px] text-gray-400 font-mono">
                  Managed by Event-Svc
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Service Mesh Health
                </h2>
                <p className="text-sm text-gray-500">
                  Global status of independent microservice deployments.
                </p>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchData();
                }}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-600 transition"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Heartbeats
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Service Unit
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Latency
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Deployment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {health.map((svc) => (
                    <tr
                      key={svc.serviceName}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 tracking-tight">
                              {svc.serviceName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full uppercase tracking-widest border ${
                            svc.status === "UP"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : svc.status === "DEGRADED"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {svc.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-mono ${
                              svc.latency > 200
                                ? "text-orange-600 font-bold"
                                : "text-gray-500"
                            }`}
                          >
                            {svc.latency}ms
                          </span>
                          <div className="ml-2 w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                svc.latency > 200
                                  ? "bg-orange-500"
                                  : "bg-blue-400"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (svc.latency / 500) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-mono text-gray-400">
                        {svc.version}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg
                className="w-48 h-48"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-black mb-4 tracking-tight">
                Distributed System Maintenance
              </h3>
              <p className="text-indigo-200 mb-8 leading-relaxed font-light">
                All services are currently scaling independently. The Event Bus
                is handling approximately 4.2k events/second. Kafka partitions
                are rebalancing automatically.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl hover:bg-indigo-50 transition shadow-lg">
                  Manual Rebalance
                </button>
                <button className="px-6 py-3 bg-indigo-700/50 text-indigo-100 font-bold rounded-2xl hover:bg-indigo-700 transition border border-indigo-600">
                  View Node Logs
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "events" && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Event Management
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Manage events, view reservations, and update event details.
              </p>
            </div>
            <button
              onClick={() => {
                setEventForm({
                  name: "",
                  start_at: "",
                  price_cents: 0,
                  total_tickets: 0,
                });
                setShowAddModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Event
            </button>
          </div>

          {actionError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-800">
              {actionError}
            </div>
          )}

          {eventsLoading ? (
            <div className="text-center py-24">Loading events...</div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Event Name
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Price
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Tickets
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {events.map((event) => {
                    const availableTickets =
                      event.total_tickets -
                      event.tickets_sold -
                      event.tickets_held;
                    return (
                      <tr
                        key={event.id}
                        className="hover:bg-gray-50/50 transition"
                      >
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-gray-900">
                            {event.name}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {new Date(event.start_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(event.start_at).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${(event.price_cents / 100).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              {availableTickets}
                            </span>{" "}
                            / {event.total_tickets} available
                          </div>
                          <div className="text-xs text-gray-400">
                            {event.tickets_sold} sold, {event.tickets_held} held
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full uppercase tracking-widest border ${
                              availableTickets > 0
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {availableTickets > 0 ? "Available" : "Sold Out"}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openReservationsModal(event.id)}
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                            >
                              Reservations
                            </button>
                            <button
                              onClick={() => openEditModal(event)}
                              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setShowDeleteConfirm(true);
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {events.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No events found. Create your first event!
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Event
              </h2>
            </div>
            <form onSubmit={handleAddEvent} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.name}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={
                    eventForm.start_at
                      ? new Date(eventForm.start_at).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      start_at: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (cents)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={eventForm.price_cents}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        price_cents: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ${(eventForm.price_cents / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Tickets
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventForm.total_tickets}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        total_tickets: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEventForm({
                      name: "",
                      start_at: "",
                      price_cents: 0,
                      total_tickets: 0,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
            </div>
            <form onSubmit={handleEditEvent} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.name}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={
                    eventForm.start_at
                      ? new Date(eventForm.start_at).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      start_at: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (cents)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={eventForm.price_cents}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        price_cents: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ${(eventForm.price_cents / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Tickets
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventForm.total_tickets}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        total_tickets: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    setEventForm({
                      name: "",
                      start_at: "",
                      price_cents: 0,
                      total_tickets: 0,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delete Event
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedEventId(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Modal */}
      {showReservationsModal && selectedEventId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Event Reservations
              </h2>
              <button
                onClick={() => {
                  setShowReservationsModal(false);
                  setSelectedEventId(null);
                  setReservations([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {reservationsLoading ? (
                <div className="text-center py-12">Loading reservations...</div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No reservations found for this event.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reservation ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {reservation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {reservation.user_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {reservation.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(reservation.amount_cents / 100).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                reservation.status === "CONFIRMED" ||
                                reservation.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : reservation.status === "PENDING" ||
                                    reservation.status === "AWAITING_PAYMENT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(reservation.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
