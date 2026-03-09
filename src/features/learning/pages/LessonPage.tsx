import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/app";
import { useLanguage } from "@/contexts/language";
import { PageLayout } from "@/components/layout";
import { LessonScreen } from "../components/lesson/LessonScreen";

export default function LessonPage() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const trackRoute = `${ROUTES.learn}/${trackId}`;

  const handleExit = () => navigate(trackRoute);
  const handleComplete = () => navigate(trackRoute);

  if (!lessonId) return null;

  return (
    <LessonScreen
      lessonId={lessonId}
      trackId={trackId ?? ""}
      trackRoute={trackRoute}
      onExit={handleExit}
      onComplete={handleComplete}
    />
  );
}
