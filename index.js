import dbConnect from "./model/database.js";
import puppeteer from "puppeteer";
import downloadUrl from "./controller/downloadUrl.js";
import dotenv from "dotenv";

import sylabiModels from "./model/sylabus.js";

//connect to the DB first beofre doing anythin elde

dotenv.config();
dbConnect().then(async () => {
  console.log("ready to run");

  (async () => {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
    });

    // Create a page
    const page = await browser.newPage();
    const secSchools = "http://mopse.co.zw/curriculum-framework/secondary";

    await page.goto(secSchools, {
      waitUntil: "domcontentloaded",
    });

    await page
      .waitForSelector("td.views-field.views-field-field-syllabus-download")
      .then(async (result) => {
        console.log("has appeared");
        let arrayTop = [];
        console.log(result);
        //get the subjects
        const subjects = await page.evaluate(async () => {
          const tr = document.querySelectorAll(
            "td.views-field.views-field-field-syllabus-download"
          );

          let links = [];

          // Iterate through each <a> tag and extract its href value
          tr.forEach(async (element) => {
            const aTag = element.querySelector("a");
            const subject = aTag.innerText
              .replace(/\s/gi, "")
              .replace(".pdf", "");
            /*  await page._client.send("Page.setDownloadBehavior", {
              behavior: "allow",
              downloadPath: "./assets/sylabi/",
            });

            console.log(`Downloading ${subject}...`);

            */

            if (aTag && aTag.href) {
              // links.push(aTag.href);
              links.push({
                title: aTag.innerText,
                link: aTag.href,
                fileName: `${subject}`,
              });
              //download pdf

              await Promise.all([
                page.waitFor("download"),
                page.click(aTag.href),
              ]);
            }
          });

          return links;
          //console.log(table.querySelectorAll("tr"))
          //const subjects=table.querySelectorAll("tr")
        });

        /*    subjects.forEach(async()=>{

        }) */

        subjects.forEach((subject) => {
          console.log(subject.link);
          downloadUrl(subject.link, `./assets/sylabi/${subject.fileName}`);
          const newSubj = new sylabiModels({
            link: subject.link,
            subjectName: subject.title,
            filePath: `./assets/sylabi/${subject.fileName}`,
          });
          try {
            newSubj.save();
            console.log("saved");
          } catch (err) {
            console.log(err);
          }
        });
        //  console.log(arrayTop);
      });
  })();
});
