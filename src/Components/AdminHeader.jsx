import { SignOutIcon } from '@phosphor-icons/react';

function AdminHeader() {
  return (
    <header className="admin-header">
      <div />
      <div className="admin-header-right">
        <span className="admin-username">Admin user</span>
        <button className="logout-button" type="button">
          <SignOutIcon size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;