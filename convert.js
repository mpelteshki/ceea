const fs = require('fs');

let code = fs.readFileSync('src/components/ui/logo-raw.tsx', 'utf8');

const svgMatch = code.match(/<svg[\s\S]*?<\/svg>/);
if (!svgMatch) {
    console.error('No svg found');
    process.exit(1);
}
let svgContent = svgMatch[0];

svgContent = svgContent.replace(/<style>[\s\S]*?<\/style>/, '');

svgContent = svgContent.replace(/className=\"logo_svg__st0\"/g, 'fill=\"none\"');
svgContent = svgContent.replace(/className=\"logo_svg__st1\"/g, 'fill=\"none\" stroke={iconColor} strokeWidth={0.25} strokeMiterlimit={10}');
svgContent = svgContent.replace(/className=\"logo_svg__st2\"/g, 'fill={iconColor}');
svgContent = svgContent.replace(/className=\"logo_svg__st3\"/g, 'fill={iconColor} stroke={iconColor} strokeWidth={0.25} strokeMiterlimit={10}');
svgContent = svgContent.replace(/className=\"logo_svg__st4\"/g, 'fill={textColor}');
svgContent = svgContent.replace(/className=\"logo_svg__st5\"/g, 'fill={darkIconColor}');
svgContent = svgContent.replace(/style=\{\{\s*fill:\s*\"#073f47\",?\s*\}\}/g, 'fill={darkIconColor}');

svgContent = svgContent.replace(/style=\{\{\s*clipPath:\s*\"([^\"]+)\",?\s*\}\}/g, 'clipPath=\"$1\"');

const newComponent = `import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "default" | "monochrome" | "white";
}

export const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const iconColor = variant === "default" ? "#19656b" : variant === "white" ? "#ffffff" : "currentColor";
    const textColor = variant === "white" ? "#ffffff" : "currentColor";
    const darkIconColor = variant === "default" ? "#073f47" : variant === "white" ? "#e2e8f0" : "currentColor";

    return (
      ` + svgContent.replace(/<svg[\s\S]*?>/, `<svg
        xmlns="http://www.w3.org/2000/svg"
        id="logo_svg__Layer_1"
        viewBox="0 0 595.28 841.89"
        className={cn("w-auto", className)}
        ref={ref}
        {...props}
      >`) + `
    );
  }
);
Logo.displayName = "Logo";
`;

fs.writeFileSync('src/components/ui/logo.tsx', newComponent);
console.log("Successfully generated clean logo component!");
fs.unlinkSync('src/components/ui/logo-raw.tsx');
