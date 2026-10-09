"use client";

import { useEffect, useState } from "react";

import EnquiriesPanel from "./EnquiriesPanel";
import {
  fetchEnquiries,
  updateEnquiryStatus,
  type Enquiry,
} from "../services/adminApi";

export default function EnquiriesSection() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "new" | "contacted" | "completed" | ""
  >("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadEnquiries() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchEnquiries({
          page,
          limit: 20,
          search: debouncedSearch,
          status: statusFilter,
        });

        if (active) {
          setEnquiries(
            Array.isArray(data.enquiries)
              ? data.enquiries
              : []
          );
          setTotal(Number(data.total) || 0);
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
  }, [page, debouncedSearch, statusFilter]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(
    value: "new" | "contacted" | "completed" | ""
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    const maxPage = Math.max(1, Math.ceil(total / 20));

    if (nextPage >= 1 && nextPage <= maxPage) {
      setPage(nextPage);
    }
  }

  async function handleStatusChange(
    id: number,
    status: "new" | "contacted" | "completed"
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const data = await updateEnquiryStatus(id, status);

      setEnquiries((current) =>
        current.map((enquiry) =>
          enquiry.id === id
            ? (data.enquiry as Enquiry)
            : enquiry
        )
      );
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
      setError("Unable to update enquiry status.");
    } finally {
      setUpdatingId(null);
    }
  }

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
      search={search}
      statusFilter={statusFilter}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      page={page}
      total={total}
      onPageChange={handlePageChange}
      loading={loading}
      updatingId={updatingId}
      onStatusChange={handleStatusChange}
    />
  );
}
