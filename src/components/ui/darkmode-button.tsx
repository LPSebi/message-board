import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

function DarkmodeButton() {
  const [mounted, setMounted] = useState(false);
  let { resolvedTheme } = useTheme();
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // if () return null;
  if (!mounted || !resolvedTheme) resolvedTheme = "light";

  return (
    <Button
      className="z-10"
      variant="outline"
      size="icon"
      onClick={() => {
        if (resolvedTheme === "dark") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      }}
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon className="animate-fade animate-duration-300" />
      ) : (
        <SunIcon className="animate-fade animate-duration-300" />
      )}
    </Button>
  );
}

export default DarkmodeButton;
