"use client";

import { useState, useEffect } from "react";
import { LocateFixed, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RouteDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <Button
        className="rounded-full px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200 text-primary"
        onClick={handleOpen}
      >
        <LocateFixed className="h-5 w-5  mr-2" />
        <span>Маршрут</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            role="presentation"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-300"
              role="dialog"
              aria-modal="true"
              aria-labelledby="route-dialog-title"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 id="route-dialog-title" className="font-semibold">
                  Побудова маршруту
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Закрити"
                  onClick={handleClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="start">
                      Початкова точка
                    </label>
                    <Input
                      id="start"
                      className="border-gray-200"
                      placeholder="Введіть адресу або оберіть на карті"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="end">
                      Кінцева точка
                    </label>
                    <Input
                      id="end"
                      className="border-gray-200"
                      placeholder="Введіть адресу або оберіть на карті"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium mb-3 text-gray-700">Опції доступності</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="wheelchair"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="wheelchair" className="text-sm text-gray-700">
                          Доступно для візків
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="blind"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="blind" className="text-sm text-gray-700">
                          Доступно для незрячих
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handleClose}
                    >
                      Побудувати маршрут
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
