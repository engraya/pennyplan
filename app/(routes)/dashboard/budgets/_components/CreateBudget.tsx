"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker from "emoji-picker-react";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateBudget } from "@/hooks/use-budgets";
import { createBudgetSchema, type CreateBudgetInput } from "@/validation/budget.schema";

export default function CreateBudget() {
  const [emojiIcon, setEmojiIcon] = useState("💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useCreateBudget();

  const form = useForm<CreateBudgetInput>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: { name: "", amount: 0, icon: "💰" },
  });

  const onSubmit = (data: CreateBudgetInput) => {
    mutate(
      { ...data, icon: emojiIcon },
      { onSuccess: () => { setDialogOpen(false); form.reset(); } }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="bg-slate-100 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md transition-shadow">
          <h2 className="text-3xl">+</h2>
          <h2>Create New Budget</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute z-20">
                    <EmojiPicker
                      open={openEmojiPicker}
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="text-black font-medium block mb-1">Budget Name</label>
                <Input placeholder="e.g. Home Decor" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-black font-medium block mb-1">Budget Amount</label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full"
              >
                {isPending ? <Loader className="animate-spin" /> : "Create Budget"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
