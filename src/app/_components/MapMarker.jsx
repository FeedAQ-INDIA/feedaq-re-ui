"use client";
import React, { useEffect } from "react";
import "../../../public/OlaMapsWebSDK/OlaMapsWebSDK/style.css";

import { OlaMaps } from "../../../public/OlaMapsWebSDK/OlaMapsWebSDK/olamaps-js-sdk.es.js";

function MapMarker({ lat, lng , detail, cutsomClassName}) {
  useEffect(() => {
    
    const olaMaps = new OlaMaps({
      apiKey: "1rCxrGlqhTlG77NQnYAmLpVkLpXR1y0Wtn5sQa4S",
    });
    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "map",
      center: [lat, lng],
      zoom: 15,
    });

    var olaIcon = document.createElement("div");
    olaIcon.classList.add("olalogo");

    olaMaps
      .addMarker({ element: olaIcon, offset: [0, -10], anchor: "bottom" })
      .setLngLat([lat, lng])
      .addTo(myMap);

    const popup = olaMaps
      .addPopup({ offset: [0, -30], anchor: "bottom" })
      .setHTML(`<div>${detail}</div>`);

    olaMaps
      .addMarker({
        offset: [0, 6],
        anchor: "bottom",
        color: "purple",
        draggable: true,
      })
      .setLngLat([lat, lng])
      .setPopup(popup)
      .addTo(myMap);
  }, []);

  return <div id="map"  className={cutsomClassName}></div>;
}

export default MapMarker;
