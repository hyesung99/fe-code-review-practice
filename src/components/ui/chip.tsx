import {
  createContext,
  PropsWithChildren,
  use,
  type ComponentProps,
} from "react";

type ChipGroupContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

const useChipGroup = () => {
  const context = use(ChipGroupContext);
  if (!context) throw new Error("Chip.Item은 Chip.Group 안에서 사용해야 해요.");
  return context;
};

type ChipGroupProps = ComponentProps<"div"> & ChipGroupContextValue;

const ChipGroup = ({
  value,
  onValueChange,
  children,
  ...props
}: PropsWithChildren<ChipGroupProps>) => {
  return (
    <ChipGroupContext value={{ value, onValueChange }}>
      <div role="group" className="flex flex-wrap gap-2" {...props}>
        {children}
      </div>
    </ChipGroupContext>
  );
};

type ChipItemProps = Omit<ComponentProps<"button">, "value"> & {
  value: string;
};

const ChipItem = ({
  value,
  onClick,
  children,
  ...props
}: PropsWithChildren<ChipItemProps>) => {
  const { value: selectedValue, onValueChange } = useChipGroup();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        isSelected ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
      }`}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onValueChange(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Chip = {
  Group: ChipGroup,
  Item: ChipItem,
};
