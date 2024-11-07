import { Content, Quiz } from "@/model/Quiz.model";

interface ApiResponse {
  success: boolean;
  message: string;
  quiz?: Quiz;
  quizzes?: Quiz[];
}
