import * as Tooltip from "@radix-ui/react-tooltip";

const ReusableTooltip = ({ children, content, side = "top", align = "center", className = "" }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align={align}
            className={`bg-gray-800 text-white text-sm px-3 py-2 rounded-md shadow-md ${className}`}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ReusableTooltip;