import { SignOutIcon } from "@phosphor-icons/react";

function AdminHeader({ username = "Admin user", onLogout }) {
  return (
    <header className="admin-header">
      <div className="admin-header-brand">Algonquin GO</div>
      <div className="admin-header-right">
        <span className="admin-username">{username}</span>
        <button className="logout-button" type="button" onClick={onLogout}>
          <SignOutIcon size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
