import { FC } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  isGrid: boolean;
}

export const CourseCard: FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  isGrid,
}) => {
  // Handle image source: if it's a File, create an object URL
  const getImageSrc = (image: string | File | undefined) => {
    if (!image) return '';
    if (typeof image === 'string') return image; // If it's already a string URL
    if (image instanceof File) return URL.createObjectURL(image); // If it's a File, create a URL
    return '';
  };

  return (
    <Card className={`group ${isGrid ? 'p-0 flex flex-col h-[340px]' : 'flex items-center justify-between p-4'} bg-darkPurple`}>
      {isGrid ? (
        // Grid layout (Vertical)
        <>
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={getImageSrc(course.image)} // Use the function to get the correct image source
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(course)}
                  className="text-[#AE445A]"
                >
                  <Edit2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(course.id)}
                  className="text-[#602420]"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-medium mb-2 text-[#F39F5A]">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-sm text-[#F97316] line-clamp-3 flex-1">
                {course.description}
              </p>
            )}
            {course.price !== undefined && (
              <div className="mt-4 text-lg font-medium text-yellow-500">
                ${course.price.toFixed(2)}
              </div>
            )}
          </div>
        </>
      ) : (
        // Horizontal layout (Default)
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 flex-1">
            <div className="h-16 w-16 relative rounded-lg overflow-hidden">
              <img
                src={getImageSrc(course.image)} // Use the function to get the correct image source
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg text-[#F39F5A]">{course.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(course)}
                    className="text-[#AE445A]"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(course.id)}
                    className="text-[#832222]" // Orange for delete button
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {course.description && (
                <span className="text-sm text-[#F97316]">{course.description}</span>
              )}
              {course.price !== undefined && (
                <span className="text-yellow-500 text-[#2b8630]">${course.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
