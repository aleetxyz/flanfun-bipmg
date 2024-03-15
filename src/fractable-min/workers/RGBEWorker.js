import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

onmessage = function (message) {
  const apiUrl = message.data;
  if (!apiUrl) {
    postMessage(null);
  } else {
    fetch(apiUrl)
      .then((response) => {
        response.arrayBuffer().then((result) => {
          const rgbeLoader = new RGBELoader();
          const RGBE = rgbeLoader.parse(result);
          postMessage(RGBE);
        });
      })
      .catch((error) => {
        postMessage(null);
      });
  }
};
