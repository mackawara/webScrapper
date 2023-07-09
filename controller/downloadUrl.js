import http from "http";
import https from "https";
import fs from "fs";

export default function downloadUrl(url, outPut) {
  const file = fs.createWriteStream(outPut);
  if (url.startsWith("http")) {
    const request = http.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
      });
    });
  } else {
    const request = https.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
      });
    });
  }
}
