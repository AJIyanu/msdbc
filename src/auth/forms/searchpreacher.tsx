import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./sermonform";
interface Preacher {
  id: string;
  name: string;
}

interface PreacherAutoCompleteProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  preachers: Preacher[];
}

export default function PreacherAutoComplete({
  form,
  preachers,
}: PreacherAutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Find preacher name by ID
  const getPreacherNameById = useCallback(
    (id: string) => {
      const preacher = preachers.find((p) => p.id === id);
      return preacher ? preacher.name : "";
    },
    [preachers]
  );

  // Initialize form with existing value if any
  useEffect(() => {
    const currentValue = form.getValues("preacherId");
    if (currentValue) {
      setValue(currentValue);
      setSearchTerm(getPreacherNameById(currentValue));
    }
  }, [form, getPreacherNameById]);

  // Filter preachers based on search
  const filteredPreachers = preachers.filter((preacher) =>
    preacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle direct text input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Check if input matches any existing preacher
    const matchedPreacher = preachers.find(
      (p) => p.name.toLowerCase() === newValue.toLowerCase()
    );

    if (matchedPreacher) {
      // If exact match, set the ID
      setValue(matchedPreacher.id);
      form.setValue("preacherId", matchedPreacher.id);
    } else if (newValue.trim() === "") {
      // If empty, clear the value
      setValue("");
      form.setValue("preacherId", "");
    } else {
      // If new preacher, use default UUID
      setValue("987ac250-837e-41d1-943a-a421439df865");
      form.setValue("preacherId", "987ac250-837e-41d1-943a-a421439df865");
    }
  };

  // Handle selection from dropdown
  const handleSelect = (preacherId: string) => {
    // Find the selected preacher
    const selectedPreacher = preachers.find((p) => p.id === preacherId);

    if (selectedPreacher) {
      setValue(selectedPreacher.id);
      setSearchTerm(selectedPreacher.name);
      form.setValue("preacherId", selectedPreacher.id);
    }

    setOpen(false);
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Preacher</FormLabel>
      <div className="relative">
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full pl-3 text-left">
                <FormControl>
                  <Input
                    placeholder="Search or enter new preacher"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    className="w-full text-left shadow-none border-none"
                  />
                </FormControl>
                {/* <ChevronsUpDown className="h-4 w-4" /> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search preacher..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                {filteredPreachers.length === 0 && searchTerm !== "" ? (
                  <CommandEmpty>
                    &quot;{searchTerm}&quot; will be added as a new preacher
                  </CommandEmpty>
                ) : filteredPreachers.length === 0 ? (
                  <CommandEmpty>No preachers found</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredPreachers.map((preacher) => (
                      <CommandItem
                        key={preacher.id}
                        value={preacher.name}
                        onSelect={() => handleSelect(preacher.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === preacher.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {preacher.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  );
}
