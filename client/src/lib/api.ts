import { Course } from '@/types/course';

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CourseResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const courseApi = {
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/course`);
    const data = await response.json() as ApiResponse<CourseResponse[]>;
    if (!data.success) throw new Error(data.message);
    return data.data.map((course) => ({
      id: course.id,
      title: course.name,
      description: course.description,
      price: course.price,
      image: course.image
    }));
  },

  async createCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: course.title,
        description: course.description,
        price: course.price,
        image: course.image
      })
    });
    const data = await response.json() as ApiResponse<CourseResponse>;
    if (!data.success) throw new Error(data.message);
    return {
      id: data.data.id,
      title: data.data.name,
      description: data.data.description,
      price: data.data.price,
      image: data.data.image
    };
  },

  async updateCourse(course: Course): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/course/${course.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: course.title,
        description: course.description,
        price: course.price,
        image: course.image
      })
    });
    const data = await response.json() as ApiResponse<CourseResponse>;
    if (!data.success) throw new Error(data.message);
    return {
      id: data.data.id,
      title: data.data.name,
      description: data.data.description,
      price: data.data.price,
      image: data.data.image
    };
  },

  async deleteCourse(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/course/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json() as ApiResponse<void>;
    if (!data.success) throw new Error(data.message);
  }
};