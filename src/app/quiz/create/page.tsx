"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/types";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Quiz } from "@/model/Quiz.model";
import { Plus, Trash, Loader2, X, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSpringValue, animated } from "@react-spring/web";

type ContentType = {
  question: string;
  options: string[];
  answer: number;
};

type CreateQuizType = {
  name: string;
  slug: string;
  subject: string;
  content: Array<ContentType>;
};

function CreatePage() {
  const [isCreatedSuccessful, setIsCreatedSuccessful] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdQuiz, setCreatedQuiz] = useState<Quiz | undefined>();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateQuizType>({
    defaultValues: {
      name: "",
      subject: "",
      slug: "",
      content: [
        {
          question: "",
          options: ["", "", "", ""] as string[],
          answer: 0,
        },
      ] as ContentType[],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content",
  });

  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

  const onSubmit: SubmitHandler<CreateQuizType> = async (
    data: CreateQuizType
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/create-quiz`, {
        name: data.name,
        slug: data.slug,
        subject: data.slug,
        content: data.content,
      });

      if (response.data) {
        setCreatedQuiz(response.data.quiz);
        setIsCreatedSuccessful(true);
      }
    } catch (error) {
      console.error("Error in creating quiz", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        variant: "destructive",
        title: "Failed!",
        description:
          axiosError.response?.data.message ??
          "Uh oh! Unable to create the quiz",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transformSlug = useCallback((value: string | undefined) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: createdQuiz?.name,
          text:
            "Click on the link and try your knowledge in " +
            createdQuiz?.subject,
          url: createdQuiz?.redirectLink,
        });
      } catch (error) {
        console.error("Error sharing ", error);
        toast({
          variant: "destructive",
          title: "Oops! Failed to share",
          description: "Unable to share the quiz link",
        });
      }
    } else {
      // fallback for older browser
      const shareUrl = `mailto:?subject=${encodeURIComponent(
        `Try this quiz: ${createdQuiz?.name}`
      )}&body=${encodeURIComponent(
        `Check out this quiz on ${createdQuiz?.subject}:\n${createdQuiz?.redirectLink}`
      )}`;

      window.open(shareUrl, "_blank");
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        form.setValue("slug", transformSlug(value.name), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, form.setValue, transformSlug, form]);

  return (
    <animated.div
      style={{ opacity }}
      className="relative xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3 "
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:w-1/2 sm:w-[70%] flex flex-col items-start md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8 z-10"
      >
        <div className="w-full flex flex-col items-start md:space-y-4 space-y-2">
          <section className="w-full flex flex-col items-start space-y-1">
            <span className="w-full flex flex-col items-start space-y-2">
              <Label
                htmlFor="name"
                className="md:text-base text-sm font-medium text-slate-600 capitalize"
              >
                Name of Quiz
              </Label>
              <Input
                id="name"
                placeholder="Quiz Name"
                {...form.register("name", { required: "Name is required" })}
                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
              />
            </span>
            {form.formState.errors.name && (
              <p className="text-red-400 md:text-sm text-[11px] pl-2 font-light">
                {form.formState.errors.name.message}
              </p>
            )}
          </section>
          <section className="w-full flex flex-col items-start space-y-1">
            <span className="w-full flex flex-col items-start space-y-2">
              <Label
                htmlFor="subject"
                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
              >
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Quiz Subject"
                {...form.register("subject", {
                  required: "Subject is required",
                })}
                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
              />
            </span>
            {form.formState.errors.subject && (
              <p className="text-red-400 md:text-sm text-[11px] pl-2 font-light">
                {form.formState.errors.subject.message}
              </p>
            )}
          </section>
          <section className="w-full flex flex-col items-start space-y-1">
            <span className="w-full flex flex-col items-start space-y-2">
              <Label
                htmlFor="slug"
                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
              >
                Slug
              </Label>
              <Input
                id="slug"
                placeholder="Quiz Slug"
                {...form.register("slug", { required: "Slug is required" })}
                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
                disabled
              />
            </span>
            {form.formState.errors.slug && (
              <p className="text-red-400 md:text-sm text-[11px] pl-2 font-light">
                {form.formState.errors.slug.message}
              </p>
            )}
          </section>
        </div>
        <div className="w-full flex flex-col items-start space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="w-full flex flex-col items-start space-y-6"
            >
              <div className="w-full flex flex-col items-start space-y-4 ">
                <section className="w-full flex flex-col items-start space-y-1">
                  <span className="w-full flex flex-col items-start space-y-2">
                    <div className="w-full flex items-center justify-between">
                      <Label
                        htmlFor={`question.${index}`}
                        className="md:text-base text-sm font-medium text-slate-600 capitalize"
                      >
                        Question No.{index + 1}
                      </Label>
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-400 "
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <Input
                      id={`question.${index}`}
                      placeholder="What is the question?"
                      {...form.register(`content.${index}.question`, {
                        required: "Question is required",
                      })}
                      className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
                    />
                  </span>
                  {form.formState.errors?.content?.[index]?.question && (
                    <p className="text-red-400 md:text-sm text-[11px] pl-2 font-light">
                      {form.formState.errors.content[index]?.question.message}
                    </p>
                  )}
                </section>
                <section className="w-full flex flex-col items-start space-y-1">
                  <span className="w-full flex flex-col items-start space-y-2">
                    <p className="md:text-base text-sm font-medium text-slate-600 capitalize">
                      Options
                    </p>
                    {[0, 1, 2, 3].map((optIndex) => (
                      <div
                        key={optIndex}
                        className="flex flex-col items-start space-y-1"
                      >
                        <Input
                          placeholder={`Option ${String.fromCharCode(
                            65 + optIndex
                          )}`}
                          {...form.register(
                            `content.${index}.options.${optIndex}`,
                            {
                              required: `Option ${String.fromCharCode(
                                65 + optIndex
                              )} is required`,
                            }
                          )}
                          className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
                        />
                        {form.formState.errors?.content?.[index]?.options?.[
                          optIndex
                        ] && (
                          <p className="text-red-400 md:text-xs text-[10px] pl-2 font-light">
                            {
                              form.formState.errors?.content?.[index]
                                ?.options?.[optIndex].message
                            }
                          </p>
                        )}
                      </div>
                    ))}
                  </span>
                </section>
                <section className="w-full flex flex-col items-start space-y-1">
                  <span className="w-full flex flex-col items-start space-y-2">
                    <Label className="md:text-base text-sm font-medium text-slate-600 capitalize">
                      Answer
                    </Label>
                    <Controller
                      name={`content.${index}.answer`}
                      control={form.control}
                      rules={{ required: "Answer is required" }}
                      render={({ field, formState }) => (
                        <>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue
                                className="placeholder:text-sm placeholder:md:text-[15px] opacity-80 placeholder:xl:text-base"
                                placeholder="Select correct Options"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3].map((optIndex) => (
                                <SelectItem
                                  key={optIndex}
                                  value={optIndex.toString()}
                                >
                                  Option {String.fromCharCode(65 + optIndex)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formState.errors.content?.[index]?.answer && (
                            <p className="text-red-400 md:text-sm text-[11px] pl-2 font-light">
                              {
                                formState.errors.content?.[index]?.answer
                                  .message
                              }
                            </p>
                          )}
                        </>
                      )}
                    />
                  </span>
                </section>
              </div>
            </div>
          ))}
          <div>
            <Button
              variant="outline"
              size="sm"
              className="border-green-400 text-green-400 uppercase hover:bg-green-100 hover:text-slate-500"
              onClick={() =>
                append({
                  question: "",
                  options: ["", "", "", ""] as string[],
                  answer: 0,
                })
              }
            >
              <Plus /> Add
            </Button>
          </div>
        </div>
        <Button type="submit" className="mt-4 self-center">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> {`Please wait`}{" "}
            </>
          ) : (
            "Create Quiz"
          )}
        </Button>
      </form>
      <div>
        <AlertDialog
          open={isCreatedSuccessful}
          onOpenChange={setIsCreatedSuccessful}
        >
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <div className="flex justify-between items-center">
                <AlertDialogTitle>Successful!</AlertDialogTitle>
                <AlertDialogCancel className="w-8 h-8">
                  <X className="text-red-400" />
                </AlertDialogCancel>
              </div>
              <AlertDialogDescription>
                Quiz{" "}
                <span className="text-slate-700 bg-slate-300 rounded-sm p-[2px]">{`'${createdQuiz?.name}'`}</span>{" "}
                has created.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                className="px-2"
                onClick={() => router.push(createdQuiz?.originalLink as string)}
              >
                Preview
              </Button>
              <Button
                size="sm"
                className="px-2 flex items-center bg-green-500 text-slate-200 hover:bg-green-600"
                onClick={handleShare}
              >
                <Share className=" w-3 h-3" /> Share
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </animated.div>
  );
}

export default CreatePage;
