"use client";

import { UserButton } from "@clerk/nextjs";

export default function UserDropDown() {
  return (
    <UserButton
      showName
      appearance={{
        elements: {
          userButtonOuterIdentifier: {
            color: "white",
          },
        },
      }}
    />
  );
}
