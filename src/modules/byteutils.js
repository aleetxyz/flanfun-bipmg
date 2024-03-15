export function blob2b64(res) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject("Error reading file.");
    };
    reader.readAsDataURL(res);
  });
}
