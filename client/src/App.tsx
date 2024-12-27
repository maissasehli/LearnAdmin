import { FC, useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CourseForm } from '@/components/forms/CourseForm';
import { CourseCard } from '@/components/cards/CourseCard';
import { Course, CourseFormData } from '@/types/course';
import { courseApi } from '@/lib/api';

const Dashboard: FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isGrid, setIsGrid] = useState(false);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseApi.getAllCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => 
    courses.filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase())
    ), [courses, search]
  );

  const handleSave = async (courseData: CourseFormData) => {
    try {
      let newCourse: Course;
      if (editingCourse) {
        newCourse = await courseApi.updateCourse({
          ...editingCourse,
          ...courseData,
        });
      } else {
        newCourse = await courseApi.createCourse(courseData);
      }

      setCourses(prevCourses => {
        if (editingCourse) {
          return prevCourses.map(c => (c.id === newCourse.id ? newCourse : c));
        } else {
          return [...prevCourses, newCourse];
        }
      });

      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await courseApi.deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#120316] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F39F5A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120316] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
            <img
              src="../src/assets/logo/the_bridge.png"
              alt="Logo"
              className="h-12 object-contain"
            />
          </div>
          <div className="relative flex-1 mx-8 bg-darkPurple">
            <Input
              className="w-full pl-10 bg-darkPurple text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F39F5A] h-5 w-5" />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingCourse(null);
                  setIsDialogOpen(true);
                }}
                className="bg-[#371641] text-[#F39F5A] hover:bg-[#24062C]"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-darkPurple text-[#F39F5A]">
              <DialogHeader>
                <DialogTitle className="text-[#AE445A]">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </DialogTitle>
              </DialogHeader>
              <CourseForm 
                course={editingCourse || { title: '', price: 0, description: '', image: '' }} 
                onSave={handleSave}
                mode={editingCourse ? 'edit' : 'create'}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-[#F39F5A]">View</span>
         
          <Button
            variant="ghost"
            className={!isGrid ? 'bg-[#AE445A]' : ''}
            onClick={() => setIsGrid(false)}
          >
            <List className="h-5 w-5 text-[#F39F5A]" />
          </Button>
          <Button
            variant="ghost"
            className={isGrid ? 'bg-[#AE445A]' : ''}
            onClick={() => setIsGrid(true)}
          >
            <Grid className="h-5 w-5 text-[#F39F5A]" />
          </Button>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center text-[#F39F5A] py-8">
            No courses found
          </div>
        ) : (
          <div className={`grid gap-4 ${isGrid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                isGrid={isGrid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
