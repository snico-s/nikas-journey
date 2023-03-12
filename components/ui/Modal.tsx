import React, { Dispatch, FC, FunctionComponent, SetStateAction } from "react";

type Props = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  onSubmit: Function;
};

const Modal = ({ setShowModal, title, children, onSubmit }: Props) => {
  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-slate-400 bg-opacity-40">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
              <h3 className="text-3xl font=semibold">{title}</h3>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                <span className="text-black text-2xl">x</span>
              </button>
            </div>
            {/* Body */}
            <div className="p-6">{children}</div>
            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  onSubmit();
                  setShowModal(false);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
