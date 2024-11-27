"use client";
import { Controller } from "react-hook-form";
import { InputEditor } from "./editor/InputEditor";

export const RichInput = ({
  name,
  control,
  rules,
}: {
  name: string;
  control: any;
  rules?: object;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <InputEditor value={field.value} onChange={field.onChange} />
      )}
    />
  );
};
