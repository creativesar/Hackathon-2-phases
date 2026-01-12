"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { translateText } from "@/lib/translate";
import { Task } from "@/lib/types";

/**
 * Hook to translate task content based on current locale
 */
export function useTranslateTask(task: Task) {
  const locale = useLocale();
  const [translatedTitle, setTranslatedTitle] = useState(task.title);
  const [translatedDescription, setTranslatedDescription] = useState(task.description || "");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function translate() {
      // Only translate if locale is Urdu
      if (locale !== "ur") {
        setTranslatedTitle(task.title);
        setTranslatedDescription(task.description || "");
        return;
      }

      setIsTranslating(true);

      try {
        const [title, description] = await Promise.all([
          translateText(task.title, locale),
          task.description ? translateText(task.description, locale) : Promise.resolve(""),
        ]);

        if (isMounted) {
          setTranslatedTitle(title);
          setTranslatedDescription(description);
        }
      } catch (error) {
        console.error("Translation error:", error);
        // Keep original text on error
        if (isMounted) {
          setTranslatedTitle(task.title);
          setTranslatedDescription(task.description || "");
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    }

    translate();

    return () => {
      isMounted = false;
    };
  }, [task.id, task.title, task.description, locale]);

  return {
    title: translatedTitle,
    description: translatedDescription,
    isTranslating,
  };
}

/**
 * Hook to translate multiple tasks
 */
export function useTranslateTasks(tasks: Task[]) {
  const locale = useLocale();
  const [translatedTasks, setTranslatedTasks] = useState<Task[]>(tasks);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function translateAll() {
      // Only translate if locale is Urdu
      if (locale !== "ur") {
        setTranslatedTasks(tasks);
        return;
      }

      setIsTranslating(true);

      try {
        const translated = await Promise.all(
          tasks.map(async (task) => {
            const [title, description] = await Promise.all([
              translateText(task.title, locale),
              task.description ? translateText(task.description, locale) : Promise.resolve(""),
            ]);

            return {
              ...task,
              title,
              description,
            };
          })
        );

        if (isMounted) {
          setTranslatedTasks(translated);
        }
      } catch (error) {
        console.error("Translation error:", error);
        // Keep original tasks on error
        if (isMounted) {
          setTranslatedTasks(tasks);
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
        }
      }
    }

    translateAll();

    return () => {
      isMounted = false;
    };
  }, [tasks, locale]);

  return {
    tasks: translatedTasks,
    isTranslating,
  };
}
