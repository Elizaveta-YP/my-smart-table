import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    // Добавляем шаблоны "до" таблицы в обратном порядке
    if (before && before.length > 0) {
        before.reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.prepend(root[subName].container);
        });
    }
    
    // Добавляем шаблоны "после" таблицы
    if (after && after.length > 0) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);
            root.container.append(root[subName].container);
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Обработчик события change
    root.container.addEventListener('change', () => {
        onAction();
    });

    // Обработчик события reset
    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    // Обработчик события submit
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            // Перебираем ключи данных
            Object.keys(item).forEach(key => {
                // Проверяем, что ключ существует в row.elements
                if (row.elements && key in row.elements) {
                    // Присваиваем значение в textContent соответствующего элемента
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}