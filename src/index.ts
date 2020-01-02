import { JSDOM } from 'jsdom';
import * as jquery from 'jquery'

var requiredElements = Array.prototype.slice.call($(".sections").children);

"#app > div > div > div.pb-story > div.sections > div:nth-child(8) > div > div > div.poll-question-wrapper > div.pb-poll-question.top-line > div.square.big > div:nth-child(1) > button"

requiredElements.forEach(e => {
    if(e.textContent.toLowerCase().includes("dhoni") || e.textContent.toLowerCase().includes("kohli")) {
        var requiredPollElement = Array.prototype.slice.call(e.children)
    }
});