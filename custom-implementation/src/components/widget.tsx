"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    plugSDK: any;
  }
}

export const Widget = ({ id }: { id: string }) => {
  const [hasWidgetLoaded, setHasWidgetLoaded] = useState(false);

  const runScript = () => {
    window.plugSDK.init({
      app_id: id,
    });
    window.plugSDK.onEvent((payload: any) => {
      switch (payload.type) {
        case "ON_PLUG_WIDGET_READY":
          window.plugSDK.initSearchAgent();
          document.addEventListener("keydown", function (event) {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
              event.preventDefault();
              window.plugSDK.toggleSearchAgent();
            }
          });
          break;
        default:
          break;
      }
    });
  };

  // React.StrictMode causes script.onload to be called twice hence putting a hack in place only instantiate plug widget once
  useEffect(() => {
    if (hasWidgetLoaded) {
      runScript();
    }
  }, [hasWidgetLoaded]);

  return (
    <script
      onLoad={() => {
        setHasWidgetLoaded(true);
      }}
      type="text/javascript"
      src="https://plug-platform.devrev.ai/static/plug.js"
    />
  );
};
