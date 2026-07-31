"use client";

import { useState } from "react";
import {
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
  TypeIcon,
  StarIcon,
  ListFilterIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface FieldItem {
  id: string;
  type: "text" | "rating" | "choice";
  label: string;
  required: boolean;
}

export function LandingBuilderDemo() {
  const [fields, setFields] = useState<FieldItem[]>([
    { id: "1", type: "rating", label: "How would you rate your onboarding experience?", required: true },
    { id: "2", type: "choice", label: "Which feature do you use most frequently?", required: false },
    { id: "3", type: "text", label: "What additional features would you like to see?", required: false },
  ]);

  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");

  const addField = (type: "text" | "rating" | "choice") => {
    const newField: FieldItem = {
      id: Date.now().toString(),
      type,
      label:
        type === "text"
          ? "Describe your thoughts..."
          : type === "rating"
          ? "Overall satisfaction rating"
          : "Select your preferred option",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateLabel = (id: string, newLabel: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, label: newLabel } : f)));
  };

  const toggleRequired = (id: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, required: !f.required } : f)));
  };

  return (
    <div className="rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-6 shadow-xs space-y-6">
      {/* Playground Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DFD5] pb-4">
        <div>
          <h3 className="peak-serif text-2xl font-medium text-[#2D2926]">
            Try the Form Builder Playground
          </h3>
          <p className="text-xs text-[#78726A] mt-0.5">
            Add, edit, or reorder questions live below to test PeakForms builder logic.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("builder")}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "builder"
                ? "bg-white text-[#2D2926] shadow-xs"
                : "text-[#78726A] hover:text-[#2D2926]"
            }`}
          >
            Form Editor ({fields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "preview"
                ? "bg-[#DA7756] text-white shadow-xs"
                : "text-[#78726A] hover:text-[#2D2926]"
            }`}
          >
            <EyeIcon className="size-3.5" />
            Live Preview
          </button>
        </div>
      </div>

      {activeTab === "builder" ? (
        <div className="space-y-6">
          {/* Add Field Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#78726A] font-mono mr-1">ADD FIELD:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField("text")}
              className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F7EBE1] hover:text-[#DA7756]"
            >
              <TypeIcon className="mr-1.5 size-3.5" />
              Text Field
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField("rating")}
              className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F7EBE1] hover:text-[#DA7756]"
            >
              <StarIcon className="mr-1.5 size-3.5" />
              Rating Scale
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addField("choice")}
              className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F7EBE1] hover:text-[#DA7756]"
            >
              <ListFilterIcon className="mr-1.5 size-3.5" />
              Multiple Choice
            </Button>
          </div>

          {/* Field Drag List */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-4 transition-all hover:border-[#D6CEC1]"
              >
                <GripVerticalIcon className="size-4 text-[#9E978F] cursor-grab shrink-0" />
                <span className="font-mono text-xs font-semibold text-[#DA7756] shrink-0">
                  Q{index + 1}
                </span>

                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateLabel(field.id, e.target.value)}
                  className="flex-1 rounded-lg border border-[#E5DFD5] bg-white px-3 py-1.5 text-xs text-[#2D2926] focus:border-[#DA7756] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => toggleRequired(field.id)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium transition-all ${
                    field.required
                      ? "bg-[#DA7756]/15 text-[#DA7756]"
                      : "bg-[#E5DFD5]/50 text-[#78726A] hover:bg-[#E5DFD5]"
                  }`}
                >
                  {field.required ? "Required" : "Optional"}
                </button>

                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-1 text-[#9E978F] hover:text-red-500 transition-colors"
                  aria-label="Remove Question"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live Rendered Form Preview */
        <div className="space-y-6 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-6">
          <div className="border-b border-[#E5DFD5] pb-3 text-xs font-mono text-[#78726A]">
            LIVE_FORM_PREVIEW
          </div>

          <div className="space-y-6 max-w-lg mx-auto">
            {fields.map((f, i) => (
              <div key={f.id} className="space-y-2">
                <label className="block text-sm font-medium text-[#2D2926]">
                  {i + 1}. {f.label}{" "}
                  {f.required && <span className="text-[#DA7756]">*</span>}
                </label>

                {f.type === "text" && (
                  <input
                    type="text"
                    placeholder="Respondent answer..."
                    disabled
                    className="w-full rounded-xl border border-[#E5DFD5] bg-white px-4 py-2.5 text-xs text-[#78726A]"
                  />
                )}

                {f.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="grid size-9 place-items-center rounded-lg border border-[#E5DFD5] bg-white text-xs font-medium text-[#78726A]"
                      >
                        {star}
                      </div>
                    ))}
                  </div>
                )}

                {f.type === "choice" && (
                  <div className="space-y-1.5">
                    {["Option A", "Option B", "Option C"].map((opt) => (
                      <div
                        key={opt}
                        className="flex items-center gap-2.5 rounded-lg border border-[#E5DFD5] bg-white px-3 py-2 text-xs text-[#2D2926]"
                      >
                        <div className="size-3.5 rounded-full border border-[#E5DFD5]" />
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
