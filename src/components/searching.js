import {createComparison, rules, skipEmptyTargetValues} from "../lib/compare.js";

export function initSearching(searchField) {
    // Создаем компаратор для поиска
    const compare = createComparison(
        skipEmptyTargetValues, // Пропускаем пустые значения поиска
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false) // Поиск по нескольким полям
    );

    return (data, state, action) => {
        // Применяем поиск к данным
        return data.filter(row => compare(row, state));
    }
}