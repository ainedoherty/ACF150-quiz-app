import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🙀 Oh no! Secret button activated!</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          <div className="modal-emoji">✨</div>
        </div>
        <div className="modal-footer">
          <button 
            className="btn modal-btn-cancel"
            onClick={onCancel}
          >
            No, Keep My Data
          </button>
          <button 
            className="btn modal-btn-confirm"
            onClick={onConfirm}
          >
            Yes, Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 