"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenBox, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateBudget } from "@/hooks/use-budgets";
import { updateBudgetSchema, type UpdateBudgetInput } from "@/validation/budget.schema";
import type { BudgetWithStats } from "@/types";

interface EditBudgetProps {
  budgetInfo: BudgetWithStats | undefined;
}

export default function EditBudget({ budgetInfo }: EditBudgetProps) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon ?? "💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutate, isPending } = useUpdateBudget();

  const form = useForm<UpdateBudgetInput>({
    resolver: zodResolver(updateBudgetSchema),
    defaultValues: {
      id: budgetInfo?.id,
      name: budgetInfo?.name ?? "",
      amount: Number(budgetInfo?.amount ?? 0),
      icon: budgetInfo?.icon ?? "💰",
    },
  });

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo.icon ?? "💰");
      form.reset({
        id: budgetInfo.id,
        name: budgetInfo.name,
        amount: Number(budgetInfo.amount),
        icon: budgetInfo.icon ?? "💰",
      });
    }
  }, [budgetInfo, form]);

  const onSubmit = (data: UpdateBudgetInput) => {
    mutate(
      { ...data, icon: emojiIcon },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 rounded-full">
          <PenBox className="w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
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
              <Button type="submit" disabled={isPending} className="w-full rounded-full">
                {isPending ? <Loader className="animate-spin" /> : "Update Budget"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
