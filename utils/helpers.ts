export function copyToClipboard(
    text: string,
    onCopy?: () => void,
    onFail?: () => void
  ): void {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Text copied to clipboard");
          onCopy?.();
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          onFail?.();
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        console.log("Text copied to clipboard");
        onCopy?.();
      } catch (err) {
        console.error("Failed to copy text: ", err);
        onFail?.();
      }
      document.body.removeChild(textarea);
    }
  }
  