"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function RegisterOrganization() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://ethio-guide-backend-1.onrender.com/api/v1/orgs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, name, type }),
      });

      if (res.status === 201 || res.status === 200) {
        setMessage("Organization created successfully.");
        setEmail("");
        setName("");
        setType("");
      } else if (res.status === 400 || res.status === 409) {
        const text = await res.text();
        setMessage(`⚠️ ${text || "Invalid request."}`);
      } else {
        setMessage(" Something went wrong. Try again later.");
      }
    } catch (e) {
      setMessage(` Network error. Please try again. ${e}`);
    } finally {
      setLoading(false);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-center">
              Register Organization
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="pb-3 pt-3" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="org@example.com"
                  required
                />
              </div>

              <div>
                <Label className="pb-3 pt-3" htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Organization"
                  required
                />
              </div>

              <div>
                <Label className="pb-3 pt-3" htmlFor="type">Organization Type</Label>
                <Input
                  id="type"
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Non-profit, Business, etc."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm"
              >
                {message}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
