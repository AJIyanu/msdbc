"use client";

import { useState, useEffect } from "react";
import { Check, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SundayAttendanceForm from "@/auth/forms/sundayattendance";
import { SermonForm } from "@/auth/forms/sermonform";
import { SundayOfferingForm } from "@/auth/forms/sundayofferingform";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { useMediaQuery } from "@/hooks/usemobile";
import { Skeleton } from "@/components/ui/skeleton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

interface SermonData {
  id: string;
  created_at: string;
  date: string;
  preacherId: string;
  sermon_exist: boolean;
  sermon_title: string;
  sermon_text: string;
  preacher_sign: boolean;
}

interface AttendanceData {
  id: string;
  recordBy: string;
  created_at: string;
  men: number;
  women: number;
  boys: number;
  girls: number;
  visitors: number;
  total: number;
  date: string;
}

interface OfferingBreakdown {
  offeringTitle: string;
  amount: number;
}

interface OfferingData {
  id: string;
  created_at: string;
  recorded_by: string;
  date: string;
  amount: number;
  breakdown: OfferingBreakdown[];
}

interface ServiceRecord {
  date: string;
  sermon: SermonData | null;
  attendance: AttendanceData | null;
  offering: OfferingData | null;
}

// Service Details Component
function ServiceDetails({
  record,
  refreshMe,
  serviceDate,
}: {
  record: ServiceRecord;
  refreshMe?: () => void;
  serviceDate?: string;
}) {
  const [isEditSermon, setIsEditSermon] = useState(false);
  const [isEditAttendance, setIsEditAttendance] = useState(false);
  const [isEditOffering, setIsEditOffering] = useState(false);

  const handleEditSermon = () => {
    setIsEditSermon(!isEditSermon);
  };
  const handleEditAttendance = () => {
    setIsEditAttendance(!isEditAttendance);
  };
  const handleEditOffering = () => {
    setIsEditOffering(!isEditOffering);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {formatDate(record.date)}
        </h2>
        <div className="flex gap-2">
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-2"
            >
            <Trash2 className="h-4 w-4" />
            Delete
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  service record for {formatDate(record.date)}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
              >
              Delete
              </AlertDialogAction>
              </AlertDialogFooter>
              </AlertDialogContent>
              </AlertDialog> */}
        </div>
      </div>

      {/* Sermon Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            📖 Sermon
          </h3>
          <Button
            onClick={handleEditSermon}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            {isEditSermon ? (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
        {isEditSermon ? (
          <SermonForm
            {...(record.sermon && {
              defaultValues: {
                ...record.sermon,
                date: new Date(record.sermon.date),
              },
              userID: record.sermon.id,
              onSuccess: refreshMe,
            })}
          />
        ) : record.sermon ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-base font-medium text-gray-900">
                {record.sermon.sermon_title}
              </h4>
              <p className="text-gray-00 text-sm">
                Scripture: {record.sermon.sermon_text}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 text-xl font-bold">
                <span className="text-sm italic text-gray-600">
                  Preached by:{" "}
                </span>
                {record.sermon.preacherId || "Unknown"}
              </p>
              <Badge
                variant={record.sermon.preacher_sign ? "default" : "secondary"}
              >
                {record.sermon.preacher_sign
                  ? "Preacher Signed"
                  : "Pending Signature"}
              </Badge>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No sermon recorded for this date.
          </p>
        )}
      </div>

      {/* Attendance Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            👥 Attendance
          </h3>
          <Button
            onClick={handleEditAttendance}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            {isEditAttendance ? (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
        {isEditAttendance ? (
          <SundayAttendanceForm
            {...(record.attendance && {
              defaultValues: {
                ...record.attendance,
                date: new Date(record.attendance.date),
              },
              attId: record.attendance.id,
              onSuccess: refreshMe,
            })}
          />
        ) : record.attendance ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {record.attendance.total}
              </div>
              <div className="text-xs text-gray-600">Total Attendance</div>
            </div>
            <Separator />
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {record.attendance.men}
                </div>
                <div className="text-xs text-gray-600">Men</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {record.attendance.women}
                </div>
                <div className="text-xs text-gray-600">Women</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {record.attendance.boys}
                </div>
                <div className="text-xs text-gray-600">Boys</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {record.attendance.girls}
                </div>
                <div className="text-xs text-gray-600">Girls</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {record.attendance.visitors}
                </div>
                <div className="text-xs text-gray-600">Visitors</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No attendance recorded for this date.
          </p>
        )}
      </div>

      {/* Offering Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            💰 Offering
          </h3>
          <Button
            onClick={handleEditOffering}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            {isEditOffering ? (
              <>
                <Check /> Done{" "}
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
        {isEditOffering ? (
          <SundayOfferingForm
            {...(record.offering && {
              defaultValues: {
                ...record.offering,
                date: new Date(record.offering.date),
              },
              offId: record.offering.id,
              onSuccess: refreshMe,
            })}
          />
        ) : record.offering ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(record.offering.amount)}
              </div>
              <div className="text-xs text-gray-600">Total Offering</div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Breakdown:</h4>
              {record.offering.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-700 text-sm">
                    {item.offeringTitle}
                  </span>
                  <span className="font-medium text-gray-900 text-sm">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No offering recorded for this date.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ChurchDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [isLoading, setIsLoading] = useState(false);

  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) =>
    (2020 + i).toString()
  ).reverse();

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "sunday_sermon_read_function",
        {
          body: { year: Number(selectedYear) },
        }
      );
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      if (error) {
        throw new Error(error.message);
      }

      setServiceRecords(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const handleRecordSelect = (record: ServiceRecord) => {
    setSelectedRecord(record);
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  //   const handleDelete = () => {
  //     if (selectedRecord) {
  //       // TODO: Implement delete functionality
  //       console.log("Deleting record for:", selectedRecord.date);
  //       // Remove from local state for demo
  //       setServiceRecords((prev) =>
  //         prev.filter((record) => record.date !== selectedRecord.date)
  //       );
  //       setSelectedRecord(null);
  //       setIsModalOpen(false);
  //     }
  //   };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Church Service Records
          </h1>
          <div className="flex items-center gap-4">
            <label
              htmlFor="year-select"
              className="text-sm font-medium text-gray-700"
            >
              Select Year:
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select" className="w-32">
                <SelectValue />
                {/* <ChevronDown className="h-4 w-4" /> */}
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Records</CardTitle>
              </CardHeader>
              <div className="space-y-2 p-4">
                {isLoading ? (
                  // Mobile Loading Skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : serviceRecords.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No records found for {selectedYear}
                  </div>
                ) : (
                  serviceRecords.map((record) => (
                    <div
                      key={record.date}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleRecordSelect(record)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {record.sermon?.sermon_title || "No sermon recorded"}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {record.sermon && (
                            <Badge variant="secondary" className="text-xs">
                              Sermon
                            </Badge>
                          )}
                          {record.attendance && (
                            <Badge variant="secondary" className="text-xs">
                              Attendance
                            </Badge>
                          )}
                          {record.offering && (
                            <Badge variant="secondary" className="text-xs">
                              Offering
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Mobile Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Service Details</DialogTitle>
                </DialogHeader>
                {selectedRecord && (
                  <ServiceDetails
                    record={selectedRecord}
                    refreshMe={fetchData}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* Desktop Layout */
          <Card className="overflow-hidden">
            <div className="flex h-[calc(100vh-20rem)]">
              {/* Left Panel - Service List */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Service Records</CardTitle>
                </CardHeader>
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    // Desktop Left Panel Loading Skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="p-4 border-b border-gray-100">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex gap-1">
                            <Skeleton className="h-5 w-14" />
                            <Skeleton className="h-5 w-18" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : serviceRecords.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No records found for {selectedYear}
                    </div>
                  ) : (
                    serviceRecords.map((record) => (
                      <div
                        key={record.date}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedRecord?.date === record.date
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={() => handleRecordSelect(record)}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {record.sermon?.sermon_title ||
                              "No sermon recorded"}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {record.sermon && (
                              <Badge variant="secondary" className="text-xs">
                                Sermon
                              </Badge>
                            )}
                            {record.attendance && (
                              <Badge variant="secondary" className="text-xs">
                                Attendance
                              </Badge>
                            )}
                            {record.offering && (
                              <Badge variant="secondary" className="text-xs">
                                Offering
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - Detailed View */}
              <div className="flex-1 flex flex-col">
                {isLoading ? (
                  // Desktop Right Panel Loading Skeleton
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-64" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>

                    {/* Sermon Skeleton */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-6 w-32" />
                    </div>

                    {/* Attendance Skeleton */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <Skeleton className="h-5 w-24" />
                      <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-16 mx-auto" />
                        <Skeleton className="h-3 w-24 mx-auto" />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="text-center space-y-1">
                            <Skeleton className="h-5 w-8 mx-auto" />
                            <Skeleton className="h-3 w-12 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Offering Skeleton */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <Skeleton className="h-5 w-20" />
                      <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-24 mx-auto" />
                        <Skeleton className="h-3 w-20 mx-auto" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ) : selectedRecord ? (
                  <div className="flex-1 overflow-y-auto p-6">
                    <ServiceDetails
                      record={selectedRecord}
                      refreshMe={fetchData}
                      serviceDate={selectedRecord.date}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">
                      Select a service record to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
