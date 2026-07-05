"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Shape of payload sent to backend
interface ProcedurePayload {
  name: string;
  prerequisites: string[];
  steps: Record<string, string>;
  amount: number;
  minDays: number;
  maxDays: number;
  result: string;
}

export default function AddProcedurePage() {
  const router = useRouter();

  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  // State matching backend structure
  const [name, setName] = useState<string>("");
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [amount, setAmount] = useState<number>(0);
  const [minDays, setMinDays] = useState<number>(0);
  const [maxDays, setMaxDays] = useState<number>(0);
  const [result, setResult] = useState<string>("");

  // Handlers for dynamic arrays
  const updatePrerequisite = (index: number, value: string) => {
    const copy = [...prerequisites];
    copy[index] = value;
    setPrerequisites(copy);
  };

  const addPrerequisite = () => setPrerequisites([...prerequisites, ""]);

  const removePrerequisite = (index: number) =>
    setPrerequisites(prerequisites.filter((_, i) => i !== index));

  const updateStep = (index: number, value: string) => {
    const copy = [...steps];
    copy[index] = value;
    setSteps(copy);
  };

  const addStep = () => setSteps([...steps, ""]);

  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  // Submit handler
  const handleSubmit = async () => {
    if (!name.trim()) return alert("Procedure name is required");
    if (prerequisites.some((p) => !p.trim()))
      return alert("All prerequisites must have text");
    if (steps.some((s) => !s.trim())) return alert("All steps must have text");

    const payload: ProcedurePayload = {
      name,
      prerequisites,
      steps: steps.reduce<Record<string, string>>((acc, step, i) => {
        acc[(i + 1).toString()] = step;
        return acc;
      }, {}),
      amount,
      minDays,
      maxDays,
      result,
    };

    try {
      console.log("Submitting payload:", payload);

      const res = await fetch(
        "https://ethio-guide-backend-dlwz.onrender.com/api/v1/procedures",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(errorData?.message || "Failed to add procedure");
      }

      router.push("/admin/procedures");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error);
        alert(`Failed to add procedure: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert("Failed to add procedure: Unknown error");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-primary-dark">
      <h2 className="text-xl font-semibold">Add New Procedure</h2>

      {/* Name */}
      <div>
        <Label htmlFor="name">Procedure Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Prerequisites */}
      <div>
        <h3 className="font-medium">Prerequisites</h3>
        {prerequisites.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <Input
              placeholder={`Prerequisite ${i + 1}`}
              value={p}
              onChange={(e) => updatePrerequisite(i, e.target.value)}
            />
            {prerequisites.length > 1 && (
              <Button variant="outline" onClick={() => removePrerequisite(i)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addPrerequisite}>
          + Add Prerequisite
        </Button>
      </div>

      {/* Steps */}
      <div>
        <h3 className="font-medium">Steps</h3>
        {steps.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <Input
              placeholder={`Step ${i + 1}`}
              value={s}
              onChange={(e) => updateStep(i, e.target.value)}
            />
            {steps.length > 1 && (
              <Button variant="outline" onClick={() => removeStep(i)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addStep}>
          + Add Step
        </Button>
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Fee Amount</Label>
        <Input
          type="number"
          id="amount"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {/* Processing Time */}
      <div>
        <h3 className="font-medium">Processing Time (Days)</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min Days"
            value={minDays}
            onChange={(e) => setMinDays(Number(e.target.value))}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max Days"
            value={maxDays}
            onChange={(e) => setMaxDays(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Result */}
      <div>
        <Label htmlFor="result">Result</Label>
        <Input
          id="result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
      </div>

      {/* Submit */}
      <Button className="bg-primary text-white" onClick={handleSubmit}>
        Save Procedure
      </Button>
    </div>
  );
}
