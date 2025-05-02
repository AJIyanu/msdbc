"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Save, Edit, Check, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  addClassToFile,
  removeClassFromFile,
  getClassesFromFile,
} from "@/lib/class_manager";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define types
interface ClassOffering {
  id: string;
  class: string;
  amount: number;
  isEditing: boolean;
}

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export default function SundaySchoolOfferingForm() {
  const [date, setDate] = useState<Date>(new Date());
  const [classes, setClasses] = useState<string[]>([]);
  const [offerings, setOfferings] = useState<ClassOffering[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load classes from file
  useEffect(() => {
    const loadClasses = async () => {
      setIsLoading(true);
      try {
        const loadedClasses = await getClassesFromFile();
        setClasses(loadedClasses);

        const initialOfferings = loadedClasses.map((className, index) => ({
          id: index.toString(),
          class: className,
          amount: 0,
          isEditing: false,
        }));
        setOfferings(initialOfferings);
      } catch (error) {
        console.error("Error loading classes:", error);
        toast("Error", {
          description: "Failed to load classes. Using default classes instead.",
        });

        // Fallback to default classes if file loading fails
        const defaultClasses = [
          "Beginners",
          "Primary",
          "Junior",
          "Teen",
          "Youth",
          "Adult",
        ];
        setClasses(defaultClasses);

        const initialOfferings = defaultClasses.map((className, index) => ({
          id: index.toString(),
          class: className,
          amount: 0,
          isEditing: false,
        }));
        setOfferings(initialOfferings);
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Calculate total whenever offerings change
  useEffect(() => {
    const total = offerings.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAmount(total);
  }, [offerings]);

  // Handle amount change
  const handleAmountChange = (id: string, value: string) => {
    const numericValue = value === "" ? 0 : Number.parseInt(value, 10) || 0;

    setOfferings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: numericValue } : item
      )
    );
  };

  // Toggle edit mode
  const toggleEdit = (id: string) => {
    setOfferings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  // Delete a class offering
  const deleteOffering = async (id: string) => {
    const offeringToDelete = offerings.find((item) => item.id === id);

    if (offeringToDelete) {
      try {
        await removeClassFromFile(offeringToDelete.class);
        setOfferings((prev) => prev.filter((item) => item.id !== id));
        setClasses((prev) =>
          prev.filter((className) => className !== offeringToDelete.class)
        );
        toast("Class Removed", {
          description: `${offeringToDelete.class} has been removed from the class list.`,
        });
      } catch (error) {
        console.error("Error removing class:", error);
        toast("Error", {
          description: "Failed to remove class from file.",
        });
      }
    }
  };

  // Add a new class offering
  const addNewOffering = async () => {
    const newId = Date.now().toString();
    const newClassName = `New Class ${offerings.length + 1}`;

    try {
      await addClassToFile(newClassName);
      setOfferings((prev) => [
        ...prev,
        { id: newId, class: newClassName, amount: 0, isEditing: true },
      ]);
      setClasses((prev) => [...prev, newClassName]);
      toast("Class Added", {
        description: `${newClassName} has been added to the class list.`,
      });
    } catch (error) {
      console.error("Error adding class:", error);
      toast("Error", {
        description: "Failed to add class to file.",
      });
    }
  };

  // Update class name
  const updateClassName = async (
    id: string,
    oldName: string,
    newName: string
  ) => {
    if (oldName === newName) return;

    try {
      await removeClassFromFile(oldName);
      await addClassToFile(newName);

      setClasses((prev) => {
        const index = prev.indexOf(oldName);
        if (index !== -1) {
          const newClasses = [...prev];
          newClasses[index] = newName;
          return newClasses;
        }
        return prev;
      });

      toast("Class Updated", {
        description: `Class name updated from "${oldName}" to "${newName}".`,
      });
    } catch (error) {
      console.error("Error updating class name:", error);
      toast("Error", {
        description: "Failed to update class name in file.",
      });
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const breakdown = offerings.map((item) => ({
        class: item.class,
        amount: item.amount,
      }));

      // Mock Supabase submission
      const { error } = await supabase.from("sundayschooloffering").insert({
        date: date.toISOString().split("T")[0],
        amount: totalAmount,
        breakdown: breakdown,
      });

      if (error && error.code === "23505") {
        toast("Error", {
          description: "Offering for this date already exists.",
        });
        return;
      } else if (error) {
        throw error;
      }

      toast("Success", {
        description: "Sunday School offering saved successfully!",
      });

      // Reset form or redirect as needed
    } catch (error) {
      console.error("Error saving offering:", error);
      toast("Error", {
        description: "Failed to save offering. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading classes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Sunday School Offering Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="pl-3 text-left font-normal flex justify-between items-center"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selected) => {
                      if (selected) setDate(selected);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Class</TableHead>
              <TableHead className="w-[30%]">Amount</TableHead>
              <TableHead className="w-[30%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offerings.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.isEditing ? (
                    <Input
                      value={item.class}
                      onChange={(e) => {
                        setOfferings((prev) =>
                          prev.map((o) =>
                            o.id === item.id
                              ? { ...o, class: e.target.value }
                              : o
                          )
                        );
                      }}
                    />
                  ) : (
                    item.class
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) =>
                      handleAmountChange(item.id, e.target.value)
                    }
                    disabled={!item.isEditing}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {item.isEditing ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const oldName =
                            classes.find((c) => c === item.class) || "";
                          const newName = item.class;
                          updateClassName(item.id, oldName, newName);
                          toggleEdit(item.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleEdit(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteOffering(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button variant="outline" className="mt-4" onClick={addNewOffering}>
          <Plus className="h-4 w-4 mr-2" /> Add Class
        </Button>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-lg font-bold">
            Total Amount: ₦{totalAmount.toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="ml-auto"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Offering"}
        </Button>
      </CardFooter>
    </Card>
  );
}
