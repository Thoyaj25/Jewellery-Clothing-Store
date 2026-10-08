"use client";

import { useEffect, useState } from "react";

import EnquiriesPanel from "./EnquiriesPanel";
import {
  fetchEnquiries,
  type Enquiry,
} from "../services/adminApi";

export default function EnquiriesSection() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEnquiries() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEnquiries({
          page: 1,
          limit: 20,
        });

        if (active) {
          setEnquiries(
            Array.isArray(data.enquiries)
              ? data.enquiries
              : []
          );
        }
      } catch (err) {
        console.error("Failed to load enquiries:", err);

        if (active) {
          setError("Unable to load customer enquiries.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEnquiries();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <section className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
        <p className="text-sm text-red-300">
          {error}
        </p>
      </section>
    );
  }

  return (
    <EnquiriesPanel
      enquiries={enquiries}
      loading={loading}
    />
  );
}
