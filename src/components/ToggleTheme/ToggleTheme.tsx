"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const ToggleTheme = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Image
        src={"/svg/hourglass.png"}
        width={0}
        height={0}
        alt="loading theme toggle icon h-8 w-8"
        priority={false}
      />
    );
  }

  return (
    <Image
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      src={resolvedTheme === "dark" ? "/svg/sun.png" : "/svg/moon.png"}
      alt="toggle theme"
      width={32}
      height={32}
      className="w-8 h-8 self-center ml-4 cursor-pointer"
    />
  );
};

export default ToggleTheme;
