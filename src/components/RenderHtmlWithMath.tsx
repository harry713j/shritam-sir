"use client";
import React, { useEffect, useState } from "react";
import katex from "katex";

interface RenderHTMLWithMathProps {
  htmlString: string;
}

const RenderHTMLWithMath: React.FC<RenderHTMLWithMathProps> = ({
  htmlString,
}) => {
  const [renderedContent, setRenderedContent] = useState<string>("");

  useEffect(() => {
    const rendered = renderLatexInHTML(htmlString);
    setRenderedContent(rendered);
  }, [htmlString]);

  const renderLatexInHTML = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const latexElements = tempDiv.querySelectorAll("[data-type='math'][latex]");

    latexElements.forEach((element) => {
      const latexString = element.getAttribute("latex") || "";
      if (latexString) {
        try {
          const htmlContent = katex.renderToString(latexString, {
            throwOnError: false,
            displayMode: element.hasAttribute("displaymode"),
          });
          element.innerHTML = htmlContent;
        } catch (error) {
          console.error("Error rendering LaTeX:", error);
        }
      }
    });

    return tempDiv.innerHTML;
  };

  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default RenderHTMLWithMath;
