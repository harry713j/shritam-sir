"use client";
import React, { useEffect, useState } from "react";
import katex from "katex";

interface RenderHTMLWithMathProps {
  htmlString: string;
  appendText?: string;
}

const RenderHTMLWithMath: React.FC<RenderHTMLWithMathProps> = ({
  htmlString,
  appendText = "",
}) => {
  const [renderedContent, setRenderedContent] = useState<string>("");

  useEffect(() => {
    const rendered = renderLatexInHTML(htmlString);
    setRenderedContent(rendered);
  }, [htmlString]);

  const renderLatexInHTML = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    if (!/<[a-z][\s\S]*>/i.test(html.trim())) {
      // Input is plain text, wrap it in a paragraph or span
      tempDiv.textContent = html;
    } else {
      // Input is structured HTML
      tempDiv.innerHTML = html;
    }

    const brTags = tempDiv.querySelectorAll("br");
    brTags.forEach((br) => br.remove());

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

    if (appendText) {
      const lastElement = tempDiv.lastChild;

      if (lastElement instanceof HTMLElement) {
        lastElement.insertAdjacentHTML("beforeend", appendText);
      } else if (lastElement) {
        const wrapper = document.createElement("div");
        wrapper.appendChild(lastElement);
        wrapper.insertAdjacentHTML("beforeend", appendText);
        tempDiv.appendChild(wrapper);
      } else {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = appendText;
        tempDiv.appendChild(wrapper);
      }
    }

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
