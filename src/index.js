import './css/styles.css';
import { fetchCountries } from './js/fetchcountries';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    const trim = input.value.trim();
    cleanHtml(); 

    if (trim) {
      fetchCountries(trim).then(data => {
        if (data.length > 10) {
          Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (!data.length) {
          Notify.failure('Oops, there is no country with that name');
        } else if (data.length >= 2 && data.length <= 10) {
          renderCountryList(data);
        } else if (data.length === 1) {
          renderCountryInfo(data);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

const createLi = (country) => {
    const result = `<li class="list-item">
        <img src="${country.flags.svg}" alt="${country.name.official} flag" width="30" height="20">
        <p>${country.name.official}</p>
        </li>`;
    return result;
}

function renderCountryList(countries) {

    const markup = countries
        .reduce((acc, country) => acc + createLi (country),'');

  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(countries) {

    const markup = countries
    .map(country => {
      return `<li class="one-country">
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" height="20">
         <h2>${country.name.official}</h2>
            <div><b>Capital</b>: ${country.capital}</div>
            <div><b>Population</b>: ${country.population}</div>
            <div><b>Languages</b>: ${Object.values(country.languages)} </div>
                </li>`;
    })

  countryInfo.insertAdjacentHTML('beforeend', markup);
}

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}