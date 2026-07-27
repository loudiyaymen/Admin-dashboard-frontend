import { WarningCircleIcon } from "@phosphor-icons/react";

function PageErrorState({
  title = "Oops! Something went wrong",
  description = "Check your internet connection and try again",
  retryLabel = "Retry",
  onRetry,
}) {
  return (
    <section className="page-error-state" aria-live="polite">
      <div className="page-error-state-badge" aria-hidden="true">
        <WarningCircleIcon size={86} weight="fill" />
      </div>

      <h1>{title}</h1>
      <p>{description}</p>

      {onRetry ? (
        <button
          type="button"
          className="page-error-state-button"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      ) : null}
    </section>
  );
}

export default PageErrorState;
