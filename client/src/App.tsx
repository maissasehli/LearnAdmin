import { FC, useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, Plus, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-darkPurple border-b border-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img
                src="../src/assets/logo/the_bridge.png"
                alt="Logo"
                className="h-12 object-contain"
              />
              <div className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" className="text-yellow hover:bg-purple/20">
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Courses
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow h-5 w-5" />
                <Input
                  className="w-full pl-10 bg-purple/20 text-white border-purple focus:ring-yellow"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingCourse(null);
                      setIsDialogOpen(true);
                    }}
                    className="bg-purple text-yellow hover:bg-purple/90"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-darkPurple border border-purple/20">
                  <DialogHeader>
                    <DialogTitle className="text-pink">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-yellow">Courses Overview</h1>
          <div className="flex items-center space-x-2 bg-purple/20 rounded-lg p-1">
            <Button
              variant="ghost"
              className={`${!isGrid ? 'bg-purple text-yellow' : 'text-yellow/60'} rounded-md`}
              onClick={() => setIsGrid(false)}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              className={`${isGrid ? 'bg-purple text-yellow' : 'text-yellow/60'} rounded-md`}
              onClick={() => setIsGrid(true)}
            >
              <Grid className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-purple/20 rounded-lg p-8 inline-block">
              <BookOpen className="h-12 w-12 text-yellow mx-auto mb-4" />
              <p className="text-yellow text-lg">No courses found</p>
              <p className="text-yellow/60 mt-2">Try adjusting your search or add a new course</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${isGrid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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