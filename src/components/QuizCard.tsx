"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Forward, Trash2, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse, VerificationCodeType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { formatDate } from "@/utils/formatDateTime";


type QuizCardProps = {
  className?: string;
  name: string;
  subject: string;
  slug: string;
  redirectLink: string;
  originalLink: string;
  dateTime?: Date;
  onDelete: () => void;
};

function QuizCard(props: QuizCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const [isVerificationLoading, setIsVerificationLoading] =
    useState<boolean>(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState<
    string | undefined
  >();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const form = useForm<VerificationCodeType>({
    defaultValues: {
      code: "",
    },
  });

  const onQuizDelete = async (data: VerificationCodeType) => {
    setIsVerificationLoading(true);
    try {
      const verificationResponse = await axios.post<ApiResponse>(
        `/api/verify-secrete-key`,
        {
          secreteKey: data.code,
        }
      );

      if (verificationResponse.data) {
        try {
          const response = await axios.delete<ApiResponse>(
            `/api/delete-quiz?slug=${props.slug}`
          );

          if (response.data) {
            toast({
              title: `Successfully Deleted ${props.name}`,
              description: response.data.message,
            });
            props.onDelete();
            setIsDialogOpen(false);
          }
        } catch (error) {
          console.log("Error delete the quiz", error);
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            variant: "destructive",
            title: `Unable to delete the quiz ${props.name}`,
            description: axiosError.response?.data.message,
          });
        }
      }
    } catch (error) {
      console.log("Error in verification", error);
      const axiosError = error as AxiosError<ApiResponse>;
      setVerificationErrorMessage(axiosError.response?.data.message);
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.redirectLink);
    setIsUrlCopied(true);
    setTimeout(() => {
      setIsUrlCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.name,
          text: "Click on the link and try your knowledge in " + props.subject,
          url: props.redirectLink,
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
        `Try this quiz: ${props.name}`
      )}&body=${encodeURIComponent(
        `Check out this quiz on ${props.subject}:\n${props.redirectLink}`
      )}`;

      window.open(shareUrl, "_blank");
    }
  };

  return (
    <Card className="w-full md:px-4 md:py-2 px-1.5 py-1 border-blue-300/70">
      <CardContent className="">
        <div className="w-full flex md:flex-row items-center justify-between ">
          <section className="w-full flex flex-col items-start justify-stretch md:gap-3 gap-2">
            <div className="flex flex-col items-start ">
              <h2 className="md:text-xl text-lg capitalize font-semibold text-blue-800">
                {props.name}
              </h2>
              <span className="md:text-sm text-xs capitalize font-light text-blue-800/70">
                {props.subject}
              </span>
            </div>
            <section className="w-full flex items-center justify-between ">
              <Button
                className="font-medium tracking-wide capitalize md:text-sm text-xs"
                onClick={() => router.push(props.originalLink)}
              >
                Take Quiz
              </Button>
              <div>
                <Button variant="ghost" onClick={copyToClipboard}>
                  {isUrlCopied ? (
                    <Check className="text-green-400" />
                  ) : (
                    <Copy className="text-blue-400" />
                  )}
                </Button>
                <Button variant="ghost" onClick={handleShare}>
                  <Forward className="text-green-500" />
                </Button>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Trash2 className="text-red-400" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <div className="flex items-center justify-between">
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogCancel className="md:w-8 md:h-8 w-6 h-6">
                          <X className="text-red-300" />
                        </AlertDialogCancel>
                      </div>
                      <AlertDialogDescription className="md:text-sm text-xs">
                        This action cannot be undone. This will permanently
                        delete this Quiz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form
                      onSubmit={form.handleSubmit(onQuizDelete)}
                      className="flex items-center md:space-x-4 space-x-2"
                    >
                      <Input
                        {...form.register("code", {
                          required: "Secrete code is required",
                        })}
                        placeholder="Secrete Code"
                        className="placeholder:text-sm"
                      />

                      <Button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-xs md:text-sm"
                      >
                        {isVerificationLoading ? (
                          <span>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </span>
                        ) : (
                          <span className="">Delete</span>
                        )}
                      </Button>
                    </form>
                    {verificationErrorMessage && (
                      <p className="text-red-400 xl:text-sm md:text-xs text-[10px]">
                        {verificationErrorMessage}
                      </p>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>
            <div>
              <p className="md:text-xs text-[10px] text-slate-700/50">
                {"Released " +
                  formatDate(new Date(props.dateTime?.toString() as string)) +
                  " ago"}
              </p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

export { QuizCard };
