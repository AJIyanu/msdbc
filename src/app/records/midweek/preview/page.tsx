"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ServiceTable } from "@/components/service-table";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

interface Service {
  id: string;
  created_at: string;
  title: string;
  date: string;
  day: string;
  anchor: string;
  time_started: string;
  time_ended: string;
  first_offering: number;
  second_offering: number;
  third_offering: number;
  total: number;
  total_attendance: number;
  men: number;
  women: number;
  girls: number;
  boys: number;
}

export default function MidweekServiceTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchServices = async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay for demonstration
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        // Uncomment this when ready to use Supabase with pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        const {
          data: midweekServices,
          error,
          count,
        } = await supabase
          .from("midweekservice")
          .select("*", { count: "exact" })
          .order("date", { ascending: false })
          .range(startIndex, endIndex);

        if (error) {
          throw new Error(error.message);
        }

        setServices(midweekServices || []);
        setTotalItems(count || 0);

        // For now, use mock data
        // setServices(mockData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Midweek Services</h1>
          <p className="text-gray-600 mt-2">
            Track attendance and offerings for midweek services
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">
            Error Loading Data
          </div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <Button onClick={handleRetry} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Midweek Services</h1>
      </div>

      {loading ? (
        <>
          {/* Desktop Skeleton */}
          <div className="hidden lg:block">
            <LoadingSkeleton variant="desktop" />
          </div>

          {/* Tablet Skeleton */}
          <div className="hidden md:block lg:hidden">
            <LoadingSkeleton variant="tablet" />
          </div>

          {/* Mobile Skeleton */}
          <div className="block md:hidden">
            <LoadingSkeleton variant="mobile" />
          </div>
        </>
      ) : (
        <ServiceTable
          services={services}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* <div className="mt-6 text-center">
        {loading ? (
          <Skeleton className="h-6 w-32 mx-auto" />
        ) : (
          <Badge variant="secondary" className="text-xs">
            Showing {services.length} services
          </Badge>
        )}
      </div> */}
    </div>
  );
}
