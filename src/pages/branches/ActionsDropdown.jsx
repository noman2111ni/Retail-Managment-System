import React, { useState } from "react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

const ActionsDropdown = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)
            
        }
        className="p-2 rounded hover:bg-gray-100"
      >
        <FiMoreVertical />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiEdit2 className="mr-2" /> Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <FiTrash2 className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
