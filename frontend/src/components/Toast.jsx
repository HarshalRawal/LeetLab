import React from 'react'

const Toast = ({ success, error, message }) => {
  if (!success && !error) return null // Render nothing if neither success nor error

  return (
    <div className="toast toast-top toast-end">
      {success && (
        <div className="alert alert-success">
          <span>{message || "Operation completed successfully."}</span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message || "Something went wrong."}</span>
        </div>
      )}
    </div>
  )
}

export default Toast
