import { useState } from "react";
import { ExclamationMarkIcon, SignOutIcon } from "@phosphor-icons/react";

function AdminHeader({ username = "Admin user", onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleConfirmLogout() {
    if (!onLogout || isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await onLogout();
      setShowLogoutConfirm(false);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-header-brand">Algonquin GO</div>
        <div className="admin-header-right">
          <span className="admin-username">{username}</span>
          <button
            className="logout-button"
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <SignOutIcon size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {showLogoutConfirm ? (
        <div
          className="event-edit-confirm-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="event-edit-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-edit-confirm-content">
              <div className="event-edit-confirm-icon">
                <ExclamationMarkIcon size={44} weight="regular" />
              </div>

              <div className="event-edit-confirm-copy">
                <h2>Confirm logout</h2>
                <p>Are you sure you want to logout?</p>
              </div>

              <div className="event-edit-confirm-actions">
                <button
                  type="button"
                  className="event-cancel-button"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="event-submit-button"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                >
                  <SignOutIcon size={20} />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AdminHeader;
