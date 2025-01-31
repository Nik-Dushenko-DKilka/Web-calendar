import { createPortal } from "react-dom";
import { useState } from "react";

interface ModalProps {
  title: string;
  text: string;
}

const Modal = ({ title, text }: Required<ModalProps>) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const closeToast = () => {
    console.log("Modal was closed");
    return setIsVisible(!isVisible);
  };

  return createPortal(
    isVisible && (
      <div className={`w-1/4 shadow-2xl rounded-lg p-4 mt-4 ml-4`}>
        <h2 className="inline-block text-xl font-bold border-b w-full">
          {title}
          <span
            className="text-gray-500 float-end cursor-pointer"
            onClick={closeToast}
          >
            X
          </span>
        </h2>
        <div className="mt-2">{text}</div>
      </div>
    ),
    document.body
  );
};

export default Modal;
