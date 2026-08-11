import { useEffect, useMemo, useState } from "react";
import {
  BuildingsIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationMarkIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import AdminHeader from "../Components/AdminHeader";
import Sidebar from "../Components/Sidebar";
import EmptyState from "../Components/EmptyState";
import {
  fetchNavigationRooms,
  updateNavigationRoom,
} from "../services/navigationService";

const PAGE_SIZE_OPTIONS = [6, 10, 15, 20];

function buildVisiblePages(currentPage, totalPages) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3];
  }

  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 1, currentPage, currentPage + 1];
}

function NavigationPage({ headerProps }) {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState("all");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRoomId, setEditingRoomId] = useState("");
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editRoomName, setEditRoomName] = useState("");
  const [activeInlineField, setActiveInlineField] = useState("");
  const [confirmEditPayload, setConfirmEditPayload] = useState(null);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    let mounted = true;
    let refreshTimer = null;

    async function loadRooms({ silent = false } = {}) {
      if (!silent) {
        setIsLoading(true);
      }
      setErrorMessage("");

      try {
        const result = await fetchNavigationRooms();
        if (!mounted) return;
        setRooms(result.rooms || []);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error.message || "Failed to load navigation rooms");
      } finally {
        if (mounted && !silent) {
          setIsLoading(false);
        }
      }
    }

    loadRooms();
    refreshTimer = window.setInterval(() => {
      loadRooms({ silent: true });
    }, 20000);

    return () => {
      mounted = false;
      if (refreshTimer) {
        window.clearInterval(refreshTimer);
      }
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBuildingId, pageSize]);

  const buildingOptions = useMemo(() => {
    const uniqueBuildings = new Map();
    rooms.forEach((room) => {
      if (!room?.buildingId || uniqueBuildings.has(room.buildingId)) return;
      uniqueBuildings.set(room.buildingId, {
        id: room.buildingId,
        name: room.buildingName || room.buildingId,
      });
    });

    return Array.from(uniqueBuildings.values()).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rooms.filter((room) => {
      if (
        selectedBuildingId !== "all" &&
        room.buildingId !== selectedBuildingId
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [room.roomNumber, room.roomName, room.buildingName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [rooms, searchQuery, selectedBuildingId]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleRooms = filteredRooms.slice(startIndex, startIndex + pageSize);
  const showingStart = filteredRooms.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + pageSize, filteredRooms.length);
  const visiblePages = buildVisiblePages(safeCurrentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const pageSummary = `Showing ${showingStart} to ${showingEnd} of ${filteredRooms.length} rooms`;

  function startInlineEdit(room) {
    setEditingRoomId(room.id);
    setEditRoomNumber(String(room.roomNumber || "").replace(/^-$/, ""));
    setEditRoomName(String(room.roomName || "").replace(/^-$/, ""));
    setActiveInlineField("");
    setEditError("");
  }

  function askConfirmRoomEdit(room) {
    if (!room) return;

    const normalizedRoomNumber = editRoomNumber.trim().toUpperCase();
    if (!normalizedRoomNumber) {
      setEditError("Room number is required.");
      return;
    }

    const normalizedRoomName = editRoomName.trim();
    const previousRoomNumber = String(room.roomNumber || "").replace(/^-$/, "");
    const previousRoomName = String(room.roomName || "").replace(/^-$/, "");

    if (
      normalizedRoomNumber === previousRoomNumber &&
      normalizedRoomName === previousRoomName
    ) {
      setEditError("No changes to save.");
      return;
    }

    setEditError("");
    setConfirmEditPayload({
      roomId: room.id,
      previousRoomNumber,
      previousRoomName,
      newRoomNumber: normalizedRoomNumber,
      newRoomName: normalizedRoomName,
    });
  }

  function cancelInlineEdit() {
    setEditingRoomId("");
    setEditRoomNumber("");
    setEditRoomName("");
    setActiveInlineField("");
    setEditError("");
  }

  async function handleConfirmRoomEdit() {
    if (!confirmEditPayload) return;

    setIsSavingEdit(true);
    setEditError("");

    try {
      const updatedRoom = await updateNavigationRoom(
        confirmEditPayload.roomId,
        {
          roomNumber: confirmEditPayload.newRoomNumber,
          roomName: confirmEditPayload.newRoomName,
        },
      );

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === confirmEditPayload.roomId
            ? { ...room, ...updatedRoom }
            : room,
        ),
      );

      setConfirmEditPayload(null);
      setEditingRoomId("");
      setEditRoomNumber("");
      setEditRoomName("");
      setActiveInlineField("");
      setShowEditSuccess(true);
    } catch (error) {
      setEditError(error.message || "Failed to update room.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  return (
    <div className="admin-layout">
      <AdminHeader {...headerProps} />

      <div className="admin-body">
        <Sidebar />

        <main className="admin-content">
          <div className="standard-page-content navigation-page">
            <div className="page-heading navigation-page-heading">
              <h1>Navigation Management</h1>
              <p>Manage room numbers and names</p>
            </div>

            <section className="navigation-management-card">
              <div className="navigation-toolbar">
                <label className="navigation-search-field">
                  <MagnifyingGlassIcon
                    size={20}
                    className="navigation-search-icon"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by room number or name"
                  />
                </label>

                <label className="navigation-building-select-wrap">
                  <select
                    value={selectedBuildingId}
                    onChange={(event) =>
                      setSelectedBuildingId(event.target.value)
                    }
                    className="navigation-building-select"
                  >
                    <option value="all">All Buildings</option>
                    {buildingOptions.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                  <CaretDownIcon size={18} className="navigation-select-icon" />
                </label>
              </div>

              {errorMessage ? (
                <p className="app-message-error navigation-page-error">
                  {errorMessage}
                </p>
              ) : null}

              <div className="navigation-table-wrap">
                <table className="navigation-table">
                  <thead>
                    <tr>
                      <th>Building</th>
                      <th>Room Number</th>
                      <th>Room Name</th>
                      <th>Floor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="navigation-table-status">
                            Loading navigation data...
                          </div>
                        </td>
                      </tr>
                    ) : visibleRooms.length > 0 ? (
                      visibleRooms.map((room) => {
                        const isEditingRow = editingRoomId === room.id;

                        return (
                          <tr key={room.id}>
                            <td>
                              <span className="navigation-building-cell">
                                <BuildingsIcon size={18} />
                                <span>{room.buildingName}</span>
                              </span>
                            </td>
                            <td>
                              {isEditingRow ? (
                                <input
                                  type="text"
                                  className={`navigation-inline-input ${
                                    activeInlineField === "roomNumber"
                                      ? "navigation-inline-input-active"
                                      : ""
                                  }`}
                                  value={editRoomNumber}
                                  onChange={(event) =>
                                    setEditRoomNumber(event.target.value)
                                  }
                                  onFocus={() =>
                                    setActiveInlineField("roomNumber")
                                  }
                                  onBlur={() => setActiveInlineField("")}
                                  maxLength={25}
                                />
                              ) : (
                                room.roomNumber
                              )}
                            </td>
                            <td>
                              {isEditingRow ? (
                                <input
                                  type="text"
                                  className={`navigation-inline-input ${
                                    activeInlineField === "roomName"
                                      ? "navigation-inline-input-active"
                                      : ""
                                  }`}
                                  value={editRoomName}
                                  onChange={(event) =>
                                    setEditRoomName(event.target.value)
                                  }
                                  onFocus={() =>
                                    setActiveInlineField("roomName")
                                  }
                                  onBlur={() => setActiveInlineField("")}
                                  maxLength={25}
                                />
                              ) : (
                                room.roomName || "-"
                              )}
                            </td>
                            <td>{room.floor ?? "-"}</td>
                            <td>
                              {isEditingRow ? (
                                <>
                                  <button
                                    type="button"
                                    className="navigation-action-button navigation-action-button-confirm"
                                    aria-label={`Confirm edit ${room.roomNumber}`}
                                    onClick={() => askConfirmRoomEdit(room)}
                                    disabled={isSavingEdit}
                                  >
                                    <CheckCircleIcon size={22} weight="bold" />
                                  </button>
                                  <button
                                    type="button"
                                    className="navigation-action-button"
                                    aria-label={`Cancel edit ${room.roomNumber}`}
                                    onClick={cancelInlineEdit}
                                    disabled={isSavingEdit}
                                  >
                                    <XIcon size={22} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="navigation-action-button"
                                  aria-label={`Edit ${room.roomNumber}`}
                                  onClick={() => startInlineEdit(room)}
                                >
                                  <PencilSimpleIcon size={22} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <EmptyState
                            compact
                            title="No rooms found"
                            description="Navigation rooms will appear here once they are synced from the database."
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="navigation-table-footer">
                <div className="navigation-page-size-wrap">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(event) =>
                      setPageSize(Number(event.target.value))
                    }
                    className="navigation-page-size-select"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span>per page</span>
                </div>

                <div className="navigation-table-summary">{pageSummary}</div>

                <div className="navigation-pagination">
                  <button
                    type="button"
                    className="navigation-pagination-button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safeCurrentPage === 1}
                  >
                    <CaretLeftIcon size={16} />
                  </button>

                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`navigation-pagination-button ${
                        pageNumber === safeCurrentPage ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="navigation-pagination-button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                  >
                    <CaretRightIcon size={16} />
                  </button>
                </div>
              </div>
              {editError ? (
                <p className="app-message-error navigation-inline-error">
                  {editError}
                </p>
              ) : null}
            </section>

            <section className="navigation-about-card">
              <h2>About Navigation Management</h2>
              <ul>
                <li>
                  Room information is used by the mobile wayfinder feature to
                  keep campus guidance accurate.
                </li>
                <li>
                  When room numbers or names change, update them here so the
                  mobile app picks up the latest data from the database.
                </li>
                <li>
                  Clear room labels help students and staff identify locations
                  faster.
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>

      {confirmEditPayload ? (
        <div
          className="event-edit-confirm-overlay"
          onClick={() => setConfirmEditPayload(null)}
        >
          <div
            className="event-edit-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-edit-confirm-content navigation-confirm-content">
              <div className="event-edit-confirm-icon navigation-confirm-warning-icon">
                <ExclamationMarkIcon size={44} weight="regular" />
              </div>

              <div className="event-edit-confirm-copy">
                <h2>Confirm edition</h2>
                <p>Are you sure you want to edit this room?</p>
              </div>

              <div className="event-edit-fields-card">
                <h3>Edited fields</h3>
                <h4>Room Number</h4>
                <div className="event-edit-fields-grid">
                  <div>
                    <span className="event-edit-fields-label-previous">
                      Previous
                    </span>
                    <p>{confirmEditPayload.previousRoomNumber || "-"}</p>
                  </div>
                  <div>
                    <span className="event-edit-fields-label-new">New</span>
                    <p>{confirmEditPayload.newRoomNumber || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="event-edit-confirm-actions">
                <button
                  type="button"
                  className="event-cancel-button"
                  onClick={() => setConfirmEditPayload(null)}
                  disabled={isSavingEdit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="event-submit-button"
                  onClick={handleConfirmRoomEdit}
                  disabled={isSavingEdit}
                >
                  <CheckIcon size={20} />
                  <span>{isSavingEdit ? "Saving..." : "Confirm edition"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showEditSuccess ? (
        <div
          className="event-edit-confirm-overlay"
          onClick={() => setShowEditSuccess(false)}
        >
          <div
            className="event-edit-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="navigation-success-content">
              <div className="event-edit-confirm-icon event-edit-confirm-icon-success">
                <CheckIcon size={54} weight="bold" />
              </div>
              <h2>Success!</h2>
              <p>Room Number has been successfully edited</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NavigationPage;
