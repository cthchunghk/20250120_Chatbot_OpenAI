import * as fs from "fs";
function readFileByLocalPath(path) {
    const content = fs.readFileSync(path, "utf8");
    //console.log(content);
    const contentInLine = content.split("\n");
    var faq = [];
    for (var l of contentInLine) {
        if (l.length == 1) {
            continue;
        }
        //console.log(`Line ${c}: ${l}`);
        const faqItem = l.split("？ ");
        var question = faqItem[0] + "？";
        var ans = faqItem[1].replace("\r", "");
        faq.push({
            question: question,
            answer: ans,
        });
    }
    //console.log(faq);
    return faq;
}
function readLocalJSONFile(path) {
    const faqData = JSON.parse(fs.readFileSync(path, 'utf-8'));
    return faqData;
}
function writeJSONFile(path, data) {
    //console.log(data);
    fs.writeFile(path, data, function (err) {
        if (err) {
            console.log("ERROR: ", err);
        }
    });
}
export default { readFileByLocalPath, readLocalJSONFile, writeJSONFile };
