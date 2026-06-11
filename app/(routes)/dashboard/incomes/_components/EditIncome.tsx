"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine, Loader2 } from "lucide-react";
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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateIncome } from "@/hooks/use-incomes";
import { updateIncomeSchema, type UpdateIncomeInput } from "@/validation/income.schema";
import type { IncomeWithTotal } from "@/types";

interface EditIncomeProps {
  income: IncomeWithTotal;
}

export default function EditIncome({ income }: EditIncomeProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState(income.icon ?? "💵");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const { mutate, isPending } = useUpdateIncome();

  const form = useForm<UpdateIncomeInput>({
    resolver: zodResolver(updateIncomeSchema),
    defaultValues: {
      id: income.id,
      name: income.name,
      amount: Number(income.amount),
      icon: income.icon ?? "💵",
    },
  });

  useEffect(() => {
    if (dialogOpen) {
      setEmojiIcon(income.icon ?? "💵");
      form.reset({
        id: income.id,
        name: income.name,
        amount: Number(income.amount),
        icon: income.icon ?? "💵",
      });
    }
  }, [dialogOpen, income, form]);

  const onSubmit = (data: UpdateIncomeInput) => {
    mutate(
      { ...data, icon: emojiIcon },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
          <PenLine className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Income Source</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
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

          <div>
            <label className="text-sm font-medium block mb-1.5">Source Name</label>
            <Input placeholder="e.g. Freelance, YouTube" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

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

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
