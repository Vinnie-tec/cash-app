"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addDays } from "date-fns";

const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expenses"]),
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.coerce
    .date()
    .max(addDays(new Date(), 1), "Transaction datecan not be in the future"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  description: z
    .string()
    .min(3, "Description must contain atleast 3 characters")
    .max(300, "Description must contain a maximum of 300 characters"),
});

export default function TransactionForm() {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),

      
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      transactionType: "income",
    }
  });
  
  return <div>Transaction form</div>;
}
