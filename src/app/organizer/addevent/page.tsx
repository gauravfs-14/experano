"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  X,
  Upload,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar/default";

// Event Form Type
interface EventFormData {
  title: string;
  date: Date | null;
  venue: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  genre: string;
  description: string;
  imageUrl: string;
}

// Genre Options
const genreOptions = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "R&B",
  "Folk",
  "Metal",
  "Blues",
  "Indie",
  "World",
  "Reggae",
  "Other",
];

// US States
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    date: null,
    venue: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    genre: "",
    description: "",
    imageUrl: "",
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Date Selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  // Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async () => {
    if (!imageFile) return null;

    setIsUploading(true);

    try {
      // Create FormData for image upload
      const uploadData = new FormData();
      uploadData.append("file", imageFile);

      // Call your backend API route that handles Cloudinary upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url; // Cloudinary URL returned from your API
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Keyword Management with comma separation
  const handleKeywordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      // Split the input by commas and trim each keyword
      const newKeywords = keywordInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      // Add only unique keywords (not already in the keywords array)
      const uniqueNewKeywords = newKeywords.filter(
        (keyword) => !keywords.includes(keyword)
      );

      if (uniqueNewKeywords.length > 0) {
        setKeywords([...keywords, ...uniqueNewKeywords]);
        setKeywordInput("");
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First upload image to Cloudinary (if there's an image)
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Prepare event data with keywords array and Cloudinary image URL
      const eventData = {
        ...formData,
        imageUrl,
        keywords,
        date: formData.date ? format(formData.date, "yyyy-MM-dd") : null,
      };

      // Submit event data to your API
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      toast.success("Your event has been successfully created!");
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10 px-4 bg-gray-50">
        <Card className="max-w-4xl mx-auto shadow-lg border-0 p-0">
          <CardHeader className="bg-black p-4 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">
              Create New Event
            </CardTitle>
            <CardDescription className="text-gray-100">
              Share your amazing event with the world
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-lg font-medium">
                      Event Name
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Enter your event name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-lg font-medium">
                      Event Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date
                            ? format(formData.date, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date || undefined}
                          onSelect={handleDateSelect}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="venue" className="text-lg font-medium">
                      Venue Name
                    </Label>
                    <Input
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g. Madison Square Garden"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <Label className="text-lg font-medium">
                        Venue Address
                      </Label>
                    </div>
                    <div className="space-y-3 pl-7">
                      <div>
                        <Label htmlFor="addressLine1" className="my-1">
                          Address Line 1
                        </Label>
                        <Input
                          id="addressLine1"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressLine2" className="my-1">
                          Address Line 2
                        </Label>
                        <Input
                          id="addressLine2"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          placeholder="Apt, Suite, Building (optional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 my-1">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("state", value)
                          }
                          value={formData.state}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {usStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="genre" className="text-lg font-medium">
                      Genre
                    </Label>
                    <Input
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Enter event genre (e.g. Rock, Pop, Jazz)"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-lg font-medium"
                    >
                      Event Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 min-h-32"
                      placeholder="Tell potential attendees about your event"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-lg font-medium">
                      Target Keywords
                    </Label>
                    <div className="flex mt-1">
                      <Input
                        id="keywords"
                        value={keywordInput}
                        onChange={handleKeywordInput}
                        placeholder="Add keywords separated by commas (e.g. music, live, concert)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addKeyword();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        disabled={!keywordInput.trim()}
                        className="ml-2"
                      >
                        Add
                      </Button>
                    </div>
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {keyword}
                            <X
                              className="ml-1 h-3 w-3 cursor-pointer"
                              onClick={() => removeKeyword(keyword)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="imageUpload"
                      className="text-lg font-medium"
                    >
                      Event Image
                    </Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="max-h-48 mx-auto rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: "",
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center">
                            <Upload className="h-12 w-12 text-gray-400" />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Drag and drop an image or click to browse
                          </p>
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-4"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-end space-x-4 py-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="bg-green-600"
              >
                {isSubmitting || isUploading ? "Creating..." : "Create Event"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
