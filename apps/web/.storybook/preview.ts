import type { Preview } from "@storybook/react";
import "../src/app/styles/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "space",
      values: [
        { name: "space", value: "hsl(0 0% 0%)" },
        { name: "card", value: "hsl(0 0% 5%)" },
        { name: "light", value: "hsl(0 0% 100%)" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
