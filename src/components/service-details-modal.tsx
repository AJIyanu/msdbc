import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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

interface ServiceDetailsModalProps {
  service: Service;
  variant?: "desktop" | "tablet" | "mobile";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeString: string) {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Header Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {service.title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Date
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formatDate(service.date)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Day
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {service.day}
            </span>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-base text-gray-800 mb-3 border-b pb-1">
            Service Information
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Anchor/Speaker:
              </span>
              <span className="text-sm text-gray-900 font-semibold mt-1 sm:mt-0">
                {service.anchor}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Start Time:
              </span>
              <span className="text-sm text-gray-900 font-semibold mt-1 sm:mt-0">
                {formatTime(service.time_started)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                End Time:
              </span>
              <span className="text-sm text-gray-900 font-semibold mt-1 sm:mt-0">
                {formatTime(service.time_ended)}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div>
          <h4 className="font-semibold text-base text-gray-800 mb-3 border-b pb-1">
            Attendance Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {service.men}
                </div>
                <div className="text-xs font-medium text-blue-800">Men</div>
              </div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {service.women}
                </div>
                <div className="text-xs font-medium text-pink-800">Women</div>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {service.boys}
                </div>
                <div className="text-xs font-medium text-green-800">Boys</div>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {service.girls}
                </div>
                <div className="text-xs font-medium text-purple-800">Girls</div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  Male Total
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {service.men + service.boys}
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  Female Total
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {service.women + service.girls}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-medium text-indigo-600">
                Total Attendance
              </div>
              <div className="text-3xl font-bold text-indigo-900">
                {service.total_attendance}
              </div>
            </div>
          </div>
        </div>

        {/* Offerings Section */}
        <div>
          <h4 className="font-semibold text-base text-gray-800 mb-3 border-b pb-1">
            Offering Details
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 bg-gray-50 px-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                First Offering:
              </span>
              <span className="text-lg font-bold text-gray-900 mt-1 sm:mt-0">
                {formatCurrency(service.first_offering)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 bg-gray-50 px-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Second Offering:
              </span>
              <span className="text-lg font-bold text-gray-900 mt-1 sm:mt-0">
                {formatCurrency(service.second_offering)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 bg-gray-50 px-4 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Third Offering:
              </span>
              <span className="text-lg font-bold text-gray-900 mt-1 sm:mt-0">
                {formatCurrency(service.third_offering)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 bg-green-100 px-4 rounded-lg border-2 border-green-200">
              <span className="text-base font-semibold text-green-800">
                Total Offering:
              </span>
              <span className="text-2xl font-bold text-green-900 mt-1 sm:mt-0">
                {formatCurrency(service.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-base text-gray-800 mb-3">
            Additional Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service ID:</span>
              <span className="font-mono text-gray-900">{service.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">
                {new Date(service.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailsModal({
  service,
  variant = "desktop",
}: ServiceDetailsModalProps) {
  const getDialogClasses = () => {
    switch (variant) {
      case "mobile":
        return "max-w-[95vw] max-h-[90vh] mx-2 overflow-hidden";
      case "tablet":
        return "max-w-2xl max-h-[90vh] overflow-hidden";
      default:
        return "max-w-2xl max-h-[90vh] overflow-hidden";
    }
  };

  const getTriggerButton = () => {
    if (variant === "mobile") {
      return (
        <Button variant="outline" size="sm">
          <Eye className="h-3 w-3" />
        </Button>
      );
    }
    return (
      <Button variant="outline" size="sm">
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    );
  };

  const getTitle = () => {
    if (variant === "mobile") {
      return (
        <DialogTitle className="text-lg font-semibold leading-tight">
          {service.title}
          <div className="text-sm font-normal text-gray-600 mt-1">
            {formatDate(service.date)}
          </div>
        </DialogTitle>
      );
    }
    return (
      <DialogTitle className="text-xl font-semibold">
        {service.title} - {formatDate(service.date)}
      </DialogTitle>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{getTriggerButton()}</DialogTrigger>
      <DialogContent className={getDialogClasses()}>
        <DialogHeader className="pb-4 border-b">{getTitle()}</DialogHeader>
        <div className="overflow-y-auto">
          <ServiceDetails service={service} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
