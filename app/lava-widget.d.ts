import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
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
