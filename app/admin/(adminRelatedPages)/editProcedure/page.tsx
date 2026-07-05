"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProcedurePropCapital from "@/types/procedureRecive";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProcedurePage({
  procedure,
}: {
  procedure: ProcedurePropCapital;
}) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  // ---------------- State ----------------
  const [name, setName] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState<Record<string, string>>({});
  const [fees, setFees] = useState({
    label: "",
    amount: 0,
    currency: "Birr",
  });
  const [processingTime, setProcessingTime] = useState({
    minDays: 0,
    maxDays: 0,
  });

  // Normalize backend → frontend
  useEffect(() => {
    if (procedure) {
      setName(procedure.Name ?? "");
      setPrerequisites(procedure.Content?.Prerequisites ?? []);
      setResult(procedure.Content?.Result ?? {});
      setSteps(procedure.Content?.Steps ?? {});

      // Map backend Fees → frontend Fees
      setFees(
        procedure.Fees
          ? {
              label: procedure.Fees.Label,
              amount: procedure.Fees.Amount,
              currency: procedure.Fees.Currency,
            }
          : { label: "", amount: 0, currency: "Birr" }
      );

      // Map ProcessingTime
      setProcessingTime(
        procedure.ProcessingTime
          ? {
              minDays: procedure.ProcessingTime.MinDays,
              maxDays: procedure.ProcessingTime.MaxDays,
            }
          : { minDays: 0, maxDays: 0 }
      );
    }
  }, [procedure]);

    const route = useRouter()
  // ---------------- Update ----------------
  const handleUpdate = async () => {
    if (!token) return;

    const payload = {
      ID: procedure.ID,
      Name: name,
      Content: {
        Prerequisites: prerequisites,
        Result: result,
        Steps: steps,
      },
      Fees: fees,
      ProcessingTime: processingTime,
    };

    console.log("Updating with:", payload);

    const res = await fetch(
      `https://ethio-guide-backend-1.onrender.com/api/v1/procedures/${procedure.ID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.error("Failed to update procedure");
    } else {
      console.log("Procedure updated!");
      route.push("/admin/procedures")
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-primary-dark">
      <h2 className="text-xl font-semibold">Edit Procedure</h2>

      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>
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
          <Input
            key={i}
            value={p}
            onChange={(e) => {
              const updated = [...prerequisites];
              updated[i] = e.target.value;
              setPrerequisites(updated);
            }}
            className="mb-2"
          />
        ))}
        <Button
          variant="outline"
          onClick={() => setPrerequisites([...prerequisites, ""])}
        >
          + Add Prerequisite
        </Button>
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

      {/* Steps */}
      <div>
        <h3 className="font-medium">Steps</h3>
        {Object.entries(steps).map(([order, text]) => (
          <div key={order} className="flex gap-2 mb-2">
            <span>{order}.</span>
            <Input
              value={text}
              onChange={(e) => setSteps({ ...steps, [order]: e.target.value })}
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            setSteps({
              ...steps,
              [Object.keys(steps).length + 1]: "",
            })
          }
        >
          + Add Step
        </Button>
      </div>

      {/* Fees */}
      <div>
        <h3 className="font-medium">Fees</h3>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Label"
            value={fees.label}
            onChange={(e) => setFees({ ...fees, label: e.target.value })}
          />
          <Input
            type="number"
            min={0}
            placeholder="Amount"
            value={fees.amount}
            onChange={(e) =>
              setFees({ ...fees, amount: Number(e.target.value) })
            }
          />
          <Input
            placeholder="Currency"
            value={fees.currency}
            onChange={(e) => setFees({ ...fees, currency: e.target.value })}
          />
        </div>
      </div>

      {/* Processing Time */}
      <div>
        <h3 className="font-medium">Processing Time</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min Days"
            value={processingTime.minDays}
            onChange={(e) =>
              setProcessingTime({
                ...processingTime,
                minDays: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            min={0}
            placeholder="Max Days"
            value={processingTime.maxDays}
            onChange={(e) =>
              setProcessingTime({
                ...processingTime,
                maxDays: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <Button className="bg-primary text-white" onClick={handleUpdate}>
        Save Changes
      </Button>
    </div>
  );
}
