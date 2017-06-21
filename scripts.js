(() => {
    class Form {
        submit(e) {
            e.preventDefault();
        };
    }

    class DecryptForm extends Form {
        constructor(decryptHtmlEl) {
            super();
            this.decryptHtmlInputEl = decryptHtmlEl.querySelector('.decryptHtmlInput');
            this.submit = this.submit.bind(this);
            decryptHtmlEl.addEventListener('submit', this.submit);
        }

        submit(e) {
            super.submit(e);
            const passPhrase = this.decryptHtmlInputEl.value;
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
        }
    }

    class EncryptForm extends Form {
        constructor(encryptHtmlEl) {
            super();
            this.encryptHtmlInputEl = encryptHtmlEl.querySelector('.encryptHtmlInput');
            this.encryptHtmlTextareaEl = encryptHtmlEl.querySelector('.encryptHtmlTextarea');
            this.encryptHtmlCodeEl = encryptHtmlEl.querySelector('.encryptHtmlCode');
            this.submit = this.submit.bind(this);
            encryptHtmlEl.addEventListener('submit', this.submit);
        }

        submit(e) {
            super.submit(e);
            const passPhrase = this.encryptHtmlInputEl.value;
            const text = this.encryptHtmlTextareaEl.value;

            const encrypted = CryptoJS.AES.encrypt(text, passPhrase);
            const hmac = CryptoJS.HmacSHA256(encrypted.toString(), CryptoJS.SHA256(passPhrase)).toString();
            const encryptedMsg = hmac + encrypted;

            this.encryptHtmlCodeEl.textContent = encryptedMsg;
        }
    }

    let decryptHtmlEl = null;
    let encryptHtmlEl = null;

    const cryptoApp = {
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
                new DecryptForm(decryptHtmlEl);
            } else if (encryptHtmlEl) {
                new EncryptForm(encryptHtmlEl);
            }
        },
    };

    document.addEventListener('DOMContentLoaded', cryptoApp.init());
})();
