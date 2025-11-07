const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".currency-select");
const fromCurrencySelect = document.querySelector(".from-currency-select");

async function convertValues() {
  const inputCurrencyValue = document.querySelector(".input-currency").value;
  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
  const currencyValueConverted = document.querySelector(".currency-value");

  if (!inputCurrencyValue) {
    currencyValueToConvert.textContent = "R$ 0,00";
    currencyValueConverted.textContent = "US$ 0,00";
    return;
  }

  // obtém taxas atualizadas
  const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
  const data = await response.json();

  const rates = {
    real: data.rates.BRL,
    dolar: data.rates.USD,
    euro: data.rates.EUR,
    libra: data.rates.GBP,
    bitcoin: data.rates.BTC || 0.00002 // fallback
  };

  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = currencySelect.value;

  // converte primeiro tudo para dólar, depois pra moeda de destino
  const valueInDollars = inputCurrencyValue / rates[fromCurrency];
  const convertedValue = valueInDollars * rates[toCurrency];

  // formata valores
  const formatter = {
    real: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    dolar: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    euro: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
    libra: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }),
    bitcoin: new Intl.NumberFormat("en-US", { minimumFractionDigits: 6 })
  };

  currencyValueToConvert.textContent = formatter[fromCurrency].format(inputCurrencyValue);
  currencyValueConverted.textContent = formatter[toCurrency].format(convertedValue);
}

function changeCurrency() {
  const fromCurrencyImage = document.querySelector(".from-currency-img");
  const toCurrencyImage = document.querySelector(".to-currency-img");
  const fromCurrencyName = document.querySelectorAll(".currency")[0];
  const toCurrencyName = document.querySelectorAll(".currency")[1];

  const currencies = {
    real: { name: "Real Brasileiro", img: "./assets/real.png" },
    dolar: { name: "Dólar Americano", img: "./assets/usa.png" },
    euro: { name: "Euro", img: "./assets/euro.png" },
    libra: { name: "Libra Esterlina", img: "./assets/libra.png" },
    bitcoin: { name: "Bitcoin", img: "./assets/bitcoin.png" }
  };

  const fromSelected = fromCurrencySelect.value;
  const toSelected = currencySelect.value;

  fromCurrencyName.textContent = currencies[fromSelected].name;
  fromCurrencyImage.src = currencies[fromSelected].img;

  toCurrencyName.textContent = currencies[toSelected].name;
  toCurrencyImage.src = currencies[toSelected].img;

  convertValues(); // já atualiza automaticamente quando trocar
}

// botão ainda funciona
convertButton.addEventListener("click", convertValues);

// atualiza em tempo real quando mudar selects ou digitar
currencySelect.addEventListener("change", changeCurrency);
fromCurrencySelect.addEventListener("change", changeCurrency);
document.querySelector(".input-currency").addEventListener("input", convertValues);

changeCurrency(); // inicializa com valores corretos

