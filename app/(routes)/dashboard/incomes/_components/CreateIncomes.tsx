"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker from "emoji-picker-react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
      {
        onSuccess: () => {
          setDialogOpen(false);
          form.reset();
          setEmojiIcon("💵");
        },
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Income Source</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Emoji picker */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Icon</label>
            <Popover open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="text-xl w-12 h-10">
                  {emojiIcon}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0" align="start">
                <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Source Name */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Source Name</label>
            <Input placeholder="e.g. Freelance, YouTube" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Monthly Amount */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Monthly Amount</label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              {...form.register("amount", { valueAsNumber: true })}
            />
            {form.formState.errors.amount && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Income Source"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
