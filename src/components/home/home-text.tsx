"use client";

import { createContext, useContext } from "react";
import ScrambledText from "@/components/reactbits/ScrambledText/ScrambledText";

export const HomeTextRevealContext = createContext(true);

export function HomeText({
  as,
  children,
  className,
  hover = true,
  id,
  role,
}: {
  as: React.ElementType;
  children: string;
  className?: string;
  hover?: boolean;
  id?: string;
  role?: React.AriaRole;
}) {
  const intro = useContext(HomeTextRevealContext);

  return (
    <ScrambledText
      as={as}
      className={["home-scrambled-text", className].filter(Boolean).join(" ")}
      clickBurst
      duration={1.2}
      effect="scramble"
      hover={hover}
      intro={intro}
      radius={100}
      scrambleChars=".:"
      speed={0.6}
      strength={1}
      trail={0.6}
      role={role}
      id={id}
    >
      {children}
    </ScrambledText>
  );
}
