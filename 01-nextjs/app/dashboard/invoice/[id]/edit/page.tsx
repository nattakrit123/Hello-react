"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Invoice } from "@/types/invoice";
import { useState } from "react";
import { updateInvoice } from "@/services/invoiceService";
import { getInvoice } from "@/services/invoiceService";

export default function EditInvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoice(id as string);
        if (data) {
          setInvoice(data);
        } else {
          setError("Invoice not found");
        }
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
        setError("Failed to load invoice. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!invoice) return;

    console.log("Submitting invoice:", invoice);

    updateInvoice(id as string, invoice)
      .then(() => {
        setIsSubmitting(false);
        router.push("/dashboard/invoice");
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Error updating invoice:", error);
      });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/invoice")}
        >
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Invoice</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="customer"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Customer Name
          </label>
          <input
            type="text"
            id="customer"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Enter customer name"
            onChange={(e) => {
              if (!invoice) return;
              setInvoice({ ...invoice, customer: e.target.value });
            }}
            value={invoice?.customer || ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black"
            defaultValue="pending"
            onChange={(e) => {
              if (!invoice) return;
              setInvoice({
                ...invoice,
                status: e.target.value as
                  | "draft"
                  | "pending"
                  | "paid"
                  | "overdue",
              });
            }}
            value={invoice?.status || ""}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/invoice")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Editing..." : "Edit Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
