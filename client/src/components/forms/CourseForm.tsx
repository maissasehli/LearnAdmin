import { FC, useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CourseFormData } from '@/types/course';

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
  const [formData, setFormData] = useState<CourseFormData>({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    image: course?.image || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(course.image || null);

  // Mise à jour du formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Gestion du changement d'image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file); // Lit l'image et renvoie l'URL de l'image
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Course Title</Label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter course title"
          className="bg-background p-3"
        />
      </div>

      <div>
        <Label>Price ($)</Label>
        <Input
          name="price"
          type="number"
          value={formData.price || ''}
          onChange={handleChange}
          placeholder="Enter course price"
          className="bg-background p-3"
        />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-background p-3 w-full h-32"
          placeholder="Enter course description"
        />
      </div>

      <div>
        <Label>Image</Label>
        <div className="mt-2">
          {/* Input pour ajouter l'image */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
            <p className="text-sm text-center">Click to upload image</p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        {/* Affichage de la prévisualisation de l'image */}
        {imagePreview && (
          <div className="mt-4 relative w-full h-32 rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Bouton d'enregistrement */}
      <Button
        onClick={() => onSave(formData)}
        className="w-full bg-[#AE445A] text-[#24062C] hover:bg-opacity-90"
      >
        {mode === 'create' ? 'Add Course' : 'Save Changes'}
      </Button>
    </div>
  );
};
