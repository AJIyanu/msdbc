import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceDetailsModal } from "./service-details-modal";
import { Pagination } from "./pagination";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteItem } from "./service-details-modal";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MidweekServiceForm } from "@/auth/forms/midweekserviceform";

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

interface ServiceTableProps {
  services: Service[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
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

export function ServiceTable({
  services,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
}: ServiceTableProps) {
  // console.log("Rendering ServiceTable with services:", services);
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Anchor</TableHead>
              <TableHead>Time Started</TableHead>
              <TableHead>Time Ended</TableHead>
              <TableHead>Men</TableHead>
              <TableHead>Women</TableHead>
              <TableHead>Boys</TableHead>
              <TableHead>Girls</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Total Offering</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  {formatDate(service.date)}
                </TableCell>
                <TableCell>{service.title}</TableCell>
                <TableCell>{service.anchor}</TableCell>
                <TableCell>{formatTime(service.time_started)}</TableCell>
                <TableCell>{formatTime(service.time_ended)}</TableCell>
                <TableCell>{service.men}</TableCell>
                <TableCell>{service.women}</TableCell>
                <TableCell>{service.boys}</TableCell>
                <TableCell>{service.girls}</TableCell>
                <TableCell className="font-semibold">
                  {service.total_attendance}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(service.total)}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="lg:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                      </DialogHeader>
                      <MidweekServiceForm
                        initialData={{
                          ...service,
                          date: new Date(service.date),
                        }}
                        userID={service.id}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="ml-2"
                    variant="outline"
                    onClick={() => deleteItem(service.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tablet View */}
      <div className="hidden md:block lg:hidden">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Time Started</TableHead>
              <TableHead>Male</TableHead>
              <TableHead>Female</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Total Offering</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  {formatDate(service.date)}
                </TableCell>
                <TableCell>{service.title}</TableCell>
                <TableCell>{formatTime(service.time_started)}</TableCell>
                <TableCell>{service.men + service.boys}</TableCell>
                <TableCell>{service.women + service.girls}</TableCell>
                <TableCell className="font-semibold">
                  {service.total_attendance}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(service.total)}
                </TableCell>
                <TableCell>
                  <ServiceDetailsModal service={service} variant="tablet" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Offering</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium text-xs">
                  {formatDate(service.date)}
                </TableCell>
                <TableCell className="text-xs">{service.title}</TableCell>
                <TableCell className="font-semibold text-xs">
                  {service.total_attendance}
                </TableCell>
                <TableCell className="font-semibold text-xs">
                  {formatCurrency(service.total)}
                </TableCell>
                <TableCell>
                  <ServiceDetailsModal service={service} variant="mobile" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
