"use client";

import { useState, useEffect } from "react";
import { User, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActiveTab("login"), 300);
  };
  const switchTab = (tab: "login" | "register") => setActiveTab(tab);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="rounded-full px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200 text-primary"
        onClick={handleOpen}
      >
        <User className="h-5 w-5 mr-2" />
        <span>Увійти</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            role="presentation"
            onClick={handleClose}
          />
          <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-xl bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 transition-all animate-in fade-in-0 zoom-in-95"
              aria-labelledby="dialog-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h2 id="dialog-title" className="text-lg font-semibold">
                    {activeTab === "login"
                      ? "Вхід до облікового запису"
                      : "Створення облікового запису"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeTab === "login"
                      ? "Увійдіть для доступу до всіх функцій"
                      : "Заповніть необхідні поля для реєстрації"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Закрити</span>
                </Button>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "login"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => switchTab("login")}
                  >
                    Вхід
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "register"
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => switchTab("register")}
                  >
                    Реєстрація
                  </button>
                </div>
              </div>

              <div className="p-4">
                {activeTab === "login" ? (
                  <LoginForm onSuccess={handleClose} />
                ) : (
                  <RegisterForm onSuccess={handleClose} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
