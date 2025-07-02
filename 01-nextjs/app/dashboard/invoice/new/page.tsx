"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/services/invoiceService";
import { Invoice } from "@/types/invoice";

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const invoiceData: Invoice = {
      id: "INV-001",
      customer: customerName,
      amount: amount ? parseFloat(amount) : 0.0, // Optional amount
      status: status
        ? (status as "draft" | "pending" | "paid" | "overdue")
        : "pending",
      date: "2023-05-15",
      dueDate: "2023-06-15",
      customerEmail: "billing@acme.com",
      customerAddress: "123 Business St.\nSan Francisco, CA 94103",
      notes: "Thank you for your business!",
      items: [
        {
          description: "Web Design Services",
          quantity: 1,
          unitPrice: 1000,
          total: 1000,
        },
        {
          description: "Hosting (1 year)",
          quantity: 1,
          unitPrice: 200,
          total: 200,
        },
      ],
    };

    createInvoice(invoiceData)
      .then(() => {
        setIsSubmitting(false);
        console.log("Invoice created!");
        router.push("/dashboard/invoice");
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error("Error creating invoice:", error);
        // Handle error (e.g., show a notification)
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Create New Invoice</h2>

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
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                required
                min="0"
                step="0.01"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md text-black"
                placeholder="0.00"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
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
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
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
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
