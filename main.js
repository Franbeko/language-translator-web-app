let langOption = document.querySelectorAll('select');
let fromText = document.querySelector('.fromText');
let transText = document.querySelector('.toTranslate');
let fromVoice = document.querySelector('.property_from .bx-volume-full');
let toVoice = document.querySelector('.property_trans .bx-volume-full');
let cpyBtn = document.querySelector('.bx-copy');
let countValue = document.querySelector('.code_length');
let exchangLang = document.querySelector('.bx-transfer');

langOption.forEach((get, con) => {
    for (let countryCode in language) {
        let selected = "";
        if (con === 0 && countryCode === "en-GB") {
            selected = "selected";
        } else if (con === 1 && countryCode === "es-ES") {
            selected = "selected";
        }
        let option = `<option value="${countryCode}" ${selected}>${language[countryCode]}</option>`;
        get.insertAdjacentHTML('beforeend', option);
    }
});

fromText.addEventListener('input', function () {
    let content = fromText.value.trim();
    let fromContent = langOption[0].value;
    let transContent = langOption[1].value;

    if (content.length === 0) {
        transText.value = "";
        return;
    }

    let transLINK = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(content)}&langpair=${fromContent}|${transContent}`;

    fetch(transLINK)
        .then(response => response.json())
        .then(data => {
            if (data.responseData) {
                transText.value = data.responseData.translatedText;
            } else {
                transText.value = "Translation error!";
            }
        })
        .catch(error => {
            console.error("Error fetching translation:", error);
            transText.value = "Translation failed!";
        });
});

fromVoice.addEventListener('click', function () {
    let fromTalk = new SpeechSynthesisUtterance(fromText.value);
    fromTalk.lang = langOption[0].value;
    speechSynthesis.speak(fromTalk);
});

toVoice.addEventListener('click', function () {
    let toTalk = new SpeechSynthesisUtterance(transText.value);
    toTalk.lang = langOption[1].value;
    speechSynthesis.speak(toTalk);
});

cpyBtn.addEventListener('click', function () {
    if (transText.value.trim().length > 0) {
        navigator.clipboard.writeText(transText.value).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error("Clipboard copy failed:", err);
        });
    }
});

fromText.addEventListener('keyup', function () {
    countValue.innerHTML = `${fromText.value.length}/5,000`;
});

exchangLang.addEventListener('click', function () {
    let tempText = fromText.value;
    fromText.value = transText.value;
    transText.value = tempText;

    let tempOpt = langOption[0].value;
    langOption[0].value = langOption[1].value;
    langOption[1].value = tempOpt;
});
