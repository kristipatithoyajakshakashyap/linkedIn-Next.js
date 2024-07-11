import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfilePhoto from "./shared/ProfilePhoto";
import { Textarea } from "./ui/textarea";
import { Images } from "lucide-react";
import React, { useRef, useState } from "react";
import { readFileAsDataUrl } from "@/lib/utils";
import Image from "next/image";
import { createPostAction } from "@/lib/serveractions";

export function PostDialog({
  setOpen,
  open,
  src,
}: {
  setOpen: any;
  open: boolean;
  src: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  const changeHandler = (e: any) => {
    setInputText(e.target.value);
  };

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile(dataUrl);
    }
  };

  const postActionHandler = async (formData: FormData) => {
    const inputText = formData.get("inputText") as string;
    try {
      await createPostAction(inputText, selectedFile);
    } catch (error) {
      throw new Error("An error occured");
    }
    setInputText("");
    setSelectedFile("");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <ProfilePhoto src={src} />
            <div>
              <h1>Kashyap</h1>
              <p className="text-xs">Post to anyone</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <form action={postActionHandler}>
          <div className="flex flex-col">
            <Textarea
              placeholder="Type"
              id="name"
              name="inputText"
              className="border-none text-lg focus-visible:ring-0"
              onChange={changeHandler}
              value={inputText}
            />
            <div className="my-4">
              {selectedFile && (
                <Image
                  src={selectedFile}
                  alt="preview-image"
                  width={400}
                  height={400}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center gap-4">
              <input
                ref={inputRef}
                type="file"
                name="image"
                className="hidden"
                accept="image/*"
                onChange={fileChangeHandler}
              />
              <Button type="submit">Post</Button>
            </div>
          </DialogFooter>
        </form>
        <Button
          variant={"ghost"}
          onClick={() => inputRef?.current?.click()}
          className="gap-2"
        >
          <Images className="text-blue-500" />
          <p>Media</p>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
