import { FC } from 'react';
import { Edit2, Trash2} from 'lucide-react';
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
  const getImageSrc = (image: string | File | undefined) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return '';
  };

  return (
    <Card className={`group transition-all duration-500 hover:shadow-2xl rounded-lg transform ${
      isGrid 
        ? 'p-0 flex flex-col h-[400px] hover:scale-105 hover:translate-y-[-8px]' 
        : 'flex items-center justify-between p-5 hover:bg-purple/10'
    } bg-darkPurple border border-purple/30`}>
      {isGrid ? (
        <>
          <div className="relative w-full h-52 overflow-hidden rounded-t-lg">
            <img
              src={getImageSrc(course.image)}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkPurple/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
             
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(course)}
                    className="bg-purple/80 hover:bg-purple text-pink"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(course.id)}
                    className="bg-purple/80 hover:bg-purple text-pink"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-extrabold text-yellow tracking-wide line-clamp-2">{course.title}</h3>
              <span className="text-lg font-semibold text-pink whitespace-nowrap ml-4">
                ${course.price?.toFixed(2)}
              </span>
            </div>
            {course.description && (
              <p className="text-sm text-yellow/70 line-clamp-3 flex-1 mb-3">{course.description}</p>
            )}
          
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between w-full gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="h-24 w-32 relative rounded-lg overflow-hidden shadow-md">
              <img
                src={getImageSrc(course.image)}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-yellow">{course.title}</h3>
                <span className="text-lg font-semibold text-pink whitespace-nowrap ml-4">
                  ${course.price?.toFixed(2)}
                </span>
              </div>
              {course.description && (
                <p className="text-sm text-yellow/70 line-clamp-2 mb-3">{course.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(course)}
                className="text-pink hover:bg-purple/20"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(course.id)}
                className="text-pink hover:bg-purple/20"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
