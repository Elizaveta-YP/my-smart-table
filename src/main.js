import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js"; // Подключаем модуль поиска


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    // Преобразуем строковые значения в числа
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);             // номер страницы по умолчанию 1 и тоже число

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    
    // @todo: использование
    result = applySearching(result, state, action);   // Применяем поиск ПЕРВЫМ
    result = applyFiltering(result, state, action);   // Затем применяем фильтрацию
    result = applySorting(result, state, action);     // Затем применяем сортировку
    result = applyPagination(result, state, action);  // Затем применяем пагинацию


    sampleTable.render(result)
}

// Инициализируем таблицу с search, header и filter
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], // Добавляем шаблон search первым
    after: ['pagination']
}, render);

// Инициализируем поиск
const applySearching = initSearching('search'); // Передаем имя поля для поиска

// Инициализируем сортировку
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализируем фильтрацию
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// @todo: инициализация
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Инициализируем пагинацию
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

render();