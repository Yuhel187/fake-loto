import type { DetailedHTMLProps, HTMLAttributes } from "react";

// React 19 moved the JSX namespace under the "react" module, so augment it there.
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "lava-chat-widget": DetailedHTMLProps<
                HTMLAttributes<HTMLElement> & { "site-key"?: string },
                HTMLElement
            >;
        }
    }
}

export { };
