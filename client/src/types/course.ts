export interface Course {
  id: number;
  title: string;
  price: number;
  description: string;
  image?: string;
}

export type CourseFormData = Omit<Course, 'id'> & { id?: number };
