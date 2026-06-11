"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker from "emoji-picker-react";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateIncome } from "@/hooks/use-incomes";
import { createIncomeSchema, type CreateIncomeInput } from "@/validation/income.schema";

export default function CreateIncomes() {
  const [emojiIcon, setEmojiIcon] = useState("💵");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useCreateIncome();

  const form = useForm<CreateIncomeInput>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: { name: "", amount: 0, icon: "💵" },
  });

  const onSubmit = (data: CreateIncomeInput) => {
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
          <h2>Create New Income Source</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Income Source</DialogTitle>
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
                <label className="text-black font-medium block mb-1">Source Name</label>
                <Input placeholder="e.g. Freelance, YouTube" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-black font-medium block mb-1">Monthly Amount</label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                {form.formState.errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isPending} className="w-full rounded-full">
                {isPending ? <Loader className="animate-spin" /> : "Create Income Source"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
