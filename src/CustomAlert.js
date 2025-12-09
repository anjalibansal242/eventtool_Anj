import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ModalStyles.css";

const CustomAlert = ({ message, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-description"
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="alert-title">
                Alert
              </h5>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" id="alert-description">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
