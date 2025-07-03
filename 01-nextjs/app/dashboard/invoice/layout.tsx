"use client";

import { ReactNode, use, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getInvoiceStatuses } from "@/services/invoiceService";
import Link from "next/link";

interface InvoiceLayoutProps {
  children: ReactNode;
}

export default function InvoiceLayout({ children }: InvoiceLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const invoiceStatus = getInvoiceStatuses();
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState<string[]>(
    []
  );
  const statusParam = searchParams.get("status")?.split(",") || [];

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.currentTarget;
    const selectedStatus = invoiceStatus.find((status) => status === id);
    if (!selectedStatus) return;
    let updated: string[];
    if (checked) {
      updated = [...selectedInvoiceStatus, selectedStatus];
      setSelectedInvoiceStatus(updated);
    } else {
      updated = selectedInvoiceStatus.filter(
        (status) => status !== selectedStatus
      );
      setSelectedInvoiceStatus(updated);
    }

    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set("status", updated.join(","));
    } else {
      params.delete("status");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const initialStatuses = searchParams.get("status")?.split(",") || [];
    setSelectedInvoiceStatus(initialStatuses);

    console.log("Selected Invoice Statuses:", initialStatuses);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link
          href="/dashboard/invoice/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create New
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-semibold mb-3 text-gray-800">Filter</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pending"
                  className="rounded text-blue-600"
                  checked={statusParam.includes("pending")}
                  onChange={handleStatusChange}
                />
                <label htmlFor="pending" className="ml-2 text-sm text-gray-800">
                  Pending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paid"
                  className="rounded text-blue-600"
                  checked={statusParam.includes("paid")}
                  onChange={handleStatusChange}
                />
                <label htmlFor="paid" className="ml-2 text-sm text-gray-800">
                  Paid
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="overdue"
                  className="rounded text-blue-600"
                  checked={statusParam.includes("overdue")}
                  onChange={handleStatusChange}
                />
                <label htmlFor="overdue" className="ml-2 text-sm text-gray-800">
                  Overdue
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-semibold mb-3 text-gray-800">Quick Actions</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard/invoice/export"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Export Invoices
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/invoice/templates"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Templates
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
