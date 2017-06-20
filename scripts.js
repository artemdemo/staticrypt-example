let cryptoApp;

(() => {
    let decryptHtmlEl = null;
    let decryptHtmlInputEl = null;

    let encryptHtmlEl = null;
    let encryptHtmlInputEl = null;
    let encryptHtmlTextareaEl = null;
    let encryptHtmlCodeEl = null;

    cryptoApp = {
        init: () => {
            const cryptoJsScript = document.createElement('script');
            cryptoJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';
            cryptoJsScript.onload = () => cryptoApp.start();
            document.head.appendChild(cryptoJsScript);

            decryptHtmlEl = document.querySelector('.decryptHtml');
            encryptHtmlEl = document.querySelector('.encryptHtml');
        },

        start: () => {
            if (decryptHtmlEl) {
                decryptHtmlEl.addEventListener('submit', cryptoApp.submitDecryptHtml);
                decryptHtmlInputEl = decryptHtmlEl.querySelector('.decryptHtmlInput');
            } else if (encryptHtmlEl) {
                encryptHtmlEl.addEventListener('submit', cryptoApp.submitEncryptHtml);
                encryptHtmlInputEl = encryptHtmlEl.querySelector('.encryptHtmlInput');
                encryptHtmlTextareaEl = encryptHtmlEl.querySelector('.encryptHtmlTextarea');
                encryptHtmlCodeEl = encryptHtmlEl.querySelector('.encryptHtmlCode');
            }
        },

        submitDecryptHtml: (e) => {
            e.preventDefault();
            const passPhrase = decryptHtmlInputEl.value;
            const encryptedMsg = '51092afa07afce02b788678c36ef17dbb056c1e4a5567f651c6e2ef3e369e6faU2FsdGVkX19NYQpNLjpRn1HcHZo1e5SDUdBtud1b0EfxoNBKjv356ohNnF2uB231b56XxyH/5gVkQvUw1g4VzzZe29x8dt1W0hkp9MBCQRJfWacMmcvziyof901hi12FeS5hvTOcTgB2DwceHLf1HbdsDdB2DzKIOhc0yM3cr2TNAHLbkZYwnhoCCDXJGWG1utbCBd1fdtPc56DPgz33XlsNTHcD2zZ2n+suN92EVnueg43lSsJQsr2Bu6My3tTurOw/xIsonE+P0VD5szlcnSDE00i8kb+ym6XGTo/8jSQ+EJRtygxqgCQSfTSWt0EJjG702dIsiU3wzghPka/Y9CqodkXHKwfp8EEqJGqBgpE=';
            const encryptedHMAC = encryptedMsg.substring(0, 64);
            const encryptedHTML = encryptedMsg.substring(64);
            const decryptedHMAC = CryptoJS.HmacSHA256(encryptedHTML, CryptoJS.SHA256(passPhrase)).toString();

            if (decryptedHMAC !== encryptedHMAC) {
                alert('Неправильный пароль!');
                return;
            }

            const plainHTML = CryptoJS.AES.decrypt(encryptedHTML, passPhrase).toString(CryptoJS.enc.Utf8);
            document.body.innerHTML = plainHTML;
        },

        submitEncryptHtml: (e) => {
            e.preventDefault();
            const passPhrase = encryptHtmlInputEl.value;
            const text = encryptHtmlTextareaEl.value;

            const encrypted = CryptoJS.AES.encrypt(text, passPhrase);
            const hmac = CryptoJS.HmacSHA256(encrypted.toString(), CryptoJS.SHA256(passPhrase)).toString();
            const encryptedMsg = hmac + encrypted;

            encryptHtmlCodeEl.textContent = encryptedMsg;
        },
    };
})();

document.addEventListener('DOMContentLoaded', cryptoApp.init());