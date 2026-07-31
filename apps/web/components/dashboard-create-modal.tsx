"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, FileTextIcon, SparklesIcon, XIcon, CheckIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCreateForm } from "~/hooks/api/form";

interface DashboardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const presetTemplates = [
  {
    id: "blank",
    title: "Blank Form",
    description: "Start with a clean slate and add your custom questions.",
    icon: FileTextIcon,
  },
  {
    id: "feedback",
    title: "Customer Feedback & CSAT",
    description: "Net Promoter Score, star ratings, and feedback branching.",
    icon: SparklesIcon,
  },
  {
    id: "rsvp",
    title: "Event RSVP & Registration",
    description: "Headcount, dietary preferences, and date selection.",
    icon: FileTextIcon,
  },
];

export function DashboardCreateModal({ open, onOpenChange }: DashboardCreateModalProps) {
  const router = useRouter();
  const { createFormAsync, status } = useCreateForm();
  const isCreating = status === "pending";

  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  if (!open) return null;

  async function handleCreate() {
    const newForm = await createFormAsync({
      title: title.trim() || "Untitled Form",
      description: description.trim() || undefined,
    });

    onOpenChange(false);
    if (newForm?.id) {
      router.push(`/dashboard/forms/${newForm.id}`);
    } else {
      router.push("/dashboard/forms");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-6 shadow-xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
          <div>
            <h3 className="peak-serif text-2xl font-medium text-[#2D2926]">
              Create new form
            </h3>
            <p className="text-xs text-[#78726A] mt-0.5">
              Build from scratch or start from a pre-configured preset.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid size-8 place-items-center rounded-lg text-[#78726A] hover:bg-[#F2ECE1] hover:text-[#2D2926]"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Template Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-[#78726A]">STARTING TEMPLATE</label>
          <div className="grid gap-2.5">
            {presetTemplates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    if (tpl.id !== "blank") {
                      setTitle(tpl.title);
                      setDescription(tpl.description);
                    }
                  }}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? "border-[#DA7756] bg-[#F7EBE1] text-[#2D2926]"
                      : "border-[#E5DFD5] bg-white text-[#2D2926] hover:border-[#D6CEC1]"
                  }`}
                >
                  <div
                    className={`mt-0.5 grid size-8 place-items-center rounded-lg shrink-0 ${
                      isSelected ? "bg-[#DA7756] text-white" : "bg-[#FAF7F2] text-[#78726A]"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#2D2926]">{tpl.title}</span>
                      {isSelected && <CheckIcon className="size-3.5 text-[#DA7756]" />}
                    </div>
                    <p className="text-[11px] text-[#78726A] mt-0.5 truncate">{tpl.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Details */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="form-title" className="block text-xs font-medium text-[#2D2926]">
              Form Title
            </label>
            <input
              id="form-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Customer Satisfaction Survey 2026"
              className="w-full rounded-xl border border-[#E5DFD5] bg-white px-3.5 py-2 text-xs text-[#2D2926] focus:border-[#DA7756] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-description" className="block text-xs font-medium text-[#2D2926]">
              Description (Optional)
            </label>
            <textarea
              id="form-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Provide context for your respondents..."
              className="w-full rounded-xl border border-[#E5DFD5] bg-white px-3.5 py-2 text-xs text-[#2D2926] focus:border-[#DA7756] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5DFD5]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-[#E5DFD5] bg-white text-xs text-[#78726A] hover:bg-[#F2ECE1] hover:text-[#2D2926]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isCreating}
            onClick={handleCreate}
            className="claude-button rounded-xl bg-[#DA7756] px-4 text-xs font-medium text-white hover:bg-[#C66545]"
          >
            {isCreating ? "Creating..." : "Create Form"}
            <PlusIcon className="ml-1 size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
