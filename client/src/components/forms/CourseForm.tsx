import { FC, useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {  Image as ImageIcon } from 'lucide-react';
import { CourseFormData } from '@/types/course';

export const API_BASE_URL = "http://localhost:3000/api";

interface CourseFormProps {
  course: CourseFormData;
  onSave: (course: CourseFormData) => void;
  mode?: 'create' | 'edit';
}

export const CourseForm: FC<CourseFormProps> = ({
  course,
  onSave,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState<CourseFormData & {
    duration?: string;
    level?: string;
    lessons?: number;
  }>({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    image: course?.image || '',
   
  });

  const [imagePreview, setImagePreview] = useState<string | null>(course?.image || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        const response = await fetch("http://localhost:3000/api/course/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (!response.ok || !data.success) {
          alert("Failed to upload image");
          return;
        }
  
        setFormData((prev) => ({ ...prev, image: data.data.imageUrl }));
        setImagePreview(data.data.imageUrl);  // Here, data.data.imageUrl is a string
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  
  


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.getElementById('image') as HTMLInputElement;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleImageChange({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Title */}
        <div className="md:col-span-2">
          <Label htmlFor="title" className="text-yellow mb-2 block">Course Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging course title"
            className="bg-purple/10 border-purple/20 text-yellow placeholder:text-yellow/50 focus:border-pink"
          />
        </div>

        {/* Price and Duration */}
        <div>
          <Label htmlFor="price" className="text-yellow mb-2 block">Price ($)</Label>
          <div className="relative">
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="99.99"
            className="bg-purple/10 border-purple/20 text-yellow placeholder:text-yellow/50 focus:border-pink"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow">$</span>
          </div>
        </div>

     

     

        {/* Course Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-yellow mb-2 block">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="w-full bg-purple/10 border-purple/20 text-yellow rounded-md p-3 focus:border-pink resize-none"
            placeholder="Provide a detailed description of your course"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <Label htmlFor="image" className="text-yellow mb-2 block">Course Image</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-pink bg-purple/20' : 'border-purple/20'
            }`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center h-40 cursor-pointer"
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6">
                  <ImageIcon className="h-12 w-12 text-yellow mb-2" />
                  <p className="text-yellow text-sm text-center">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-yellow/60 text-xs mt-2">
                    Recommended size: 1280x720px
                  </p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={() => onSave(formData)}
        className="w-full bg-pink text-darkPurple hover:bg-pink/90 mt-8"
      >
        {mode === 'create' ? 'Create Course' : 'Save Changes'}
      </Button>
    </div>
  );
};
