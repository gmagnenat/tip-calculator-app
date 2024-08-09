"use strict";

document.addEventListener("DOMContentLoaded", init);

const form = document.querySelector(".form");
const amount = document.querySelector(".form__input--amount");
const people = document.querySelector(".form__input--n-people");
const tipPerPerson = document.querySelector(".tip-amount");
const totalPerPerson = document.querySelector(".grand-total");
const radios = document.getElementsByName("tip");
const customRadio = document.querySelector(".custom-tip-radio");
const customText = document.querySelector(".form__input--custom-tip");
const amountErrorMessage = document.querySelector(".error-amount");
const tipErrorMessage = document.querySelector(".error-tip");
const peopleErrorMessage = document.querySelector(".error-people");
const resetButton = document.querySelector(".form__reset-button");

form.addEventListener("submit", () => {
  e.preventDefault();
});

function getSelectedTipValue() {
  const selectedRadio = document.querySelector('input[name="tip"]:checked');
  return selectedRadio
    ? selectedRadio.classList.contains("custom-tip-radio")
      ? parseFloat(customText.value) || 0
      : parseFloat(selectedRadio.value) || 0
    : 0;
}

function roundToUpper05(value) {
  return (Math.ceil(value * 20) / 20).toFixed(2);
}

function validateInputs(amountVal, peopleVal) {
  let isValid = true;

  if (!isFinite(peopleVal) || peopleVal <= 0) {
    showError(peopleErrorMessage, "Can't be zero");
    isValid = false;
  } else {
    clearError(peopleErrorMessage);
  }

  if (!isFinite(amountVal) || amountVal <= 0) {
    showError(amountErrorMessage, "Can't be zero");
    isValid = false;
  } else {
    clearError(amountErrorMessage);
  }

  if (getSelectedTipValue() <= 0) {
    showError(tipErrorMessage, "Select a tip.");
    isValid = false;
  } else {
    clearError(tipErrorMessage);
  }

  return isValid;
}

function unselectRadios() {
  radios.forEach((radio) => (radio.checked = false));
}

function showError(element, message) {
  element.textContent = message;
  element.setAttribute("aria-live", "polite");
  element.focus();
  tipPerPerson.textContent = "--";
  totalPerPerson.textContent = "--";
  resetButton.disabled = true;
}

function clearError(element) {
  element.textContent = "";
  element.removeAttribute("aria-live");

  // Check if all errors are cleared to enable the reset button
  if (
    !amountErrorMessage.textContent &&
    !peopleErrorMessage.textContent &&
    !tipErrorMessage.textContent
  ) {
    resetButton.disabled = false;
  }
}

function calculateAndDisplayAmounts() {
  const amountVal = parseFloat(amount.value);
  const peopleVal = parseInt(people.value, 10);

  if (!validateInputs(amountVal, peopleVal)) {
    return;
  }

  const selectedTip = getSelectedTipValue();
  const tipTotal = (amountVal * selectedTip) / 100;
  const newAmount = amountVal + tipTotal;
  const tipValPerson = tipTotal / peopleVal;
  const amountValPerson = newAmount / peopleVal;

  tipPerPerson.innerHTML = `<span class="sr-only">Tip per person is</span>$${roundToUpper05(
    tipValPerson
  )}`;
  totalPerPerson.innerHTML = `<span class="sr-only">Total per person is</span>$${roundToUpper05(
    amountValPerson
  )}`;
}

function attachEventListeners() {
  [amount, people, customText].forEach((input) =>
    input.addEventListener("input", calculateAndDisplayAmounts)
  );

  customRadio.addEventListener("change", () => customText.focus());
  customText.addEventListener("click", () => {
    unselectRadios();
    customRadio.checked = true;
  });

  radios.forEach((radio) =>
    radio.addEventListener("change", () => {
      customText.value = "";
      calculateAndDisplayAmounts();
    })
  );

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Tab" &&
      !document.querySelector('input[name="tip"]:checked')
    ) {
      radios[0].checked = true;
      calculateAndDisplayAmounts();
    }
  });
}

function init() {
  people.value = 1;
  attachEventListeners();
  calculateAndDisplayAmounts();
}
