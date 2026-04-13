"use client";
import { useState } from "react";

import { Step, ImportModule } from "@/data/imports";
import { PageHeader } from "@/components/dashboard/import/PageHeader";
import { StepIndicator } from "@/components/dashboard/import/StepIndicator";
import { UploadStep } from "@/components/dashboard/import/UploadStep";
import { MappingStep } from "@/components/dashboard/import/MappingStep";
import { ProcessingStep, DoneStep } from "@/components/dashboard/import/ImportSteps";
import { ImportHistory } from "@/components/dashboard/import/ImportHistory";

export default function ImportCenterPage() {
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ImportModule>("expense");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const simulateUpload = (name: string) => {
    setUploadedFile(name);
    setTimeout(() => setStep("mapping"), 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  };

  const handleConfirmMapping = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2000);
  };

  const handleReset = () => {
    setStep("upload");
    setUploadedFile(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader />

      <StepIndicator currentStep={step} />

      {step === "upload" && (
        <UploadStep
          selectedModule={selectedModule}
          dragOver={dragOver}
          onModuleChange={setSelectedModule}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
        />
      )}

      {step === "mapping" && (
        <MappingStep
          uploadedFile={uploadedFile}
          onConfirm={handleConfirmMapping}
          onCancel={handleReset}
        />
      )}

      {step === "processing" && <ProcessingStep />}

      {step === "done" && <DoneStep onReset={handleReset} />}

      <ImportHistory />
    </div>
  );
}