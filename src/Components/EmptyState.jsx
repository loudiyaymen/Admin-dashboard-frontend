import { SealWarningIcon } from "@phosphor-icons/react";

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = SealWarningIcon,
  compact = false,
  className = "",
}) {
  return (
    <div
      className={`empty-state ${compact ? "empty-state-compact" : ""} ${className}`.trim()}
    >
      <div className="empty-state-badge" aria-hidden="true">
        <Icon size={compact ? 36 : 48} weight="fill" />
      </div>

      <div className="empty-state-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {actionLabel && onAction ? (
        <button type="button" className="empty-state-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
