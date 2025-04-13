"use client";

import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RouteErrors() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-sm font-medium text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          Інформація про можливі проблеми
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="mt-2 text-sm text-gray-600 space-y-2 overflow-y-auto max-h-[200px]">
          <p>При побудові маршруту можуть виникати такі проблеми:</p>
          <div className="space-y-3 mt-3">
            <div>
              <h3 className="font-medium text-red-600">Маршрут не знайдено</h3>
              <p className="mt-1 text-xs">
                Це означає, що система не може побудувати доступний маршрут між обраними точками.
                Спробуйте обрати точки ближче до тротуарів або дороги.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-amber-600">Маршрут доступний тільки для пішоходів</h3>
              <p className="mt-1 text-xs">
                Система спробувала побудувати маршрут для людей на візках, але не змогла знайти
                повністю доступний шлях. Замість цього був побудований маршрут для пішоходів, який
                може містити ділянки з обмеженою доступністю для людей на візках.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-600">Точки прив&apos;язки до дороги</h3>
              <p className="mt-1 text-xs">
                Система автоматично прив&apos;язує вибрані точки до найближчої доступної дороги чи
                тротуару. Якщо точки були перенесені на значну відстань, спробуйте обрати точки
                безпосередньо на дорозі.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
