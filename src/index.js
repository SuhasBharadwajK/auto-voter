const puppeteer = require('puppeteer');
var votedForDhoni = false;
var votedForKohli = true;
var isRejected = false;
var isBrowserOpen = false;

const pageUrl = "https://www.espncricinfo.com/story/_/id/28403037/vote-your-men-cricketer-2010-2019-quarter-finals";

const dhoniSelector = '#app > div > div > div.pb-story > div.sections > div:nth-child(8) > div > div > div.poll-question-wrapper > div.pb-poll-question.top-line > div.square.big > div:nth-child(1) > button';
const kohliSelector = '#app > div > div > div.pb-story > div.sections > div:nth-child(2) > div > div > div.poll-question-wrapper > div.pb-poll-question.top-line > div.square.big > div:nth-child(1) > button';
const totalVotesCountSelector = "#app > div > div > div.pb-story > div.sections > div:nth-child(8) > div > div > div.poll-question-wrapper > div.pb-poll-question.top-line > div.question-footer.basic > div.question-votes > div > span:nth-child(1)";

var browser = null;

function openBrowser() {
    puppeteer.launch({ headless: false }).then((b) => {
        isBrowserOpen = true;
        browser = b;
        voteForDhoni();
    }, (reason) => {
        isRejected = true;
        console.log("Rejected because: " + reason)
    })
}

async function voteForDhoni() {
    isBrowserOpen = true;

    const page = await browser.newPage();

    page.goto(pageUrl).then(async () => {
        var frames = await page.frames()
        for (const index in frames) {
            if (frames.hasOwnProperty(index)) {
                const frame = frames[index];
                frame.$(dhoniSelector).then((element) => {
                    if (element) {
                        element.click().then(() => {
                            console.log("Voted for Dhoni!")
                            votedForDhoni = true;
                            frame.$(totalVotesCountSelector).then(async (span) => {
                                var val = await (await span.getProperty('textContent')).jsonValue();
                                console.log("Total votes so far: " + val);
                            }, (reason) => {
                                console.log("Could not get the total votes element because: " + reason);
                            });
                        });
                    }
                }, (reason) => {
                    isRejected = true;
                    console.log("Rejected because: " + reason)
                });
            }
        }
    }, (reason) => {
        isRejected = true;
        console.log("Rejected because: " + reason)
    });
}

setInterval(() => {
    if (isBrowserOpen && (isRejected || votedForDhoni) && browser) {
        browser.close().then(() => {
            isBrowserOpen = false;
            isRejected = false;
            votedForDhoni = false;
        }, (reason) => {
            isRejected = true;
            console.log("Rejected because: " + reason)
        });
    }

    if (!votedForDhoni && !isBrowserOpen) {
        openBrowser();
    }
}, 3000)
