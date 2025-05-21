const btnFilter = document.getElementById('Filterbutton');
const btnClearFilter = document.getElementById('ClearFilter');
const firstFieldSort = document.getElementById('fieldsFirst');
const secondFieldSort = document.getElementById('fieldsSecond');
const thirdFieldSort = document.getElementById('fieldsThird');
const btnSort = document.getElementById('btnSort');
const btnClearSort = document.getElementById('btnClearSort');

// исходные данные для восстановления
let originalData = [...residential_complexes];
let currentDisplayedData = [...residential_complexes];
let currentSortParams = null;

document.addEventListener('DOMContentLoaded', function() {
    createTable(originalData, 'table');
    let sort = document.getElementById('sort');
    setSortSelects(originalData[0], sort);
    
    let selects = sort.getElementsByTagName('select');
    selects[0].addEventListener("change", function() {
        changeNextSelect(selects[1].id, selects[0]);
    });
    selects[1].addEventListener("change", function() {
        changeNextSelectSecond(selects[2].id, selects[0], selects[1]);
    });
    d3.select("input[value='Построить'").on("click", function(){
        drawGraph(getFilteredData(residential_complexes));
    });
});

// Обработчик фильтрации
btnFilter.addEventListener('click', function() {
    currentDisplayedData = getFilteredData(originalData);
    createTable(currentDisplayedData, 'table');
    
    if (currentSortParams) {
        applySortToCurrentTable();
    }
    
    drawGraph(currentDisplayedData); // обновляем график
});


// Обработчик очистки фильтра
btnClearFilter.addEventListener('click', function() {
    resetFilterFields();
    currentDisplayedData = [...originalData];
    createTable(currentDisplayedData, 'table');
    
    if (currentSortParams) {
        applySortToCurrentTable();
    }
});

// Обработчик сортировки
btnSort.addEventListener('click', function() {
    currentSortParams = createSortArr(document.getElementById('sort'));
    sortTable('table', document.getElementById('sort'));
});

// Обработчик очистки сортировки
btnClearSort.addEventListener('click', function() {
    resetSortFields();
    currentSortParams = null;
    
    // последние отображенные данные
    createTable(currentDisplayedData, 'table');
});

// Сбрасываем поля фильтра
function resetFilterFields() {
    document.getElementById('name').value = '';
    document.getElementById('type').value = '';
    document.getElementById('country').value = '';
    document.getElementById('yearFrom').value = '';
    document.getElementById('yearTo').value = '';
    document.getElementById('budget_ot').value = '';
    document.getElementById('budget_do').value = '';
    document.getElementById('floors_ot').value = '';
    document.getElementById('floors_do').value = '';
    document.getElementById('apartments_ot').value = '';
    document.getElementById('apartments_do').value = '';
}

// Сбрасываем поля сортировки
function resetSortFields() {
    firstFieldSort.value = 0;
    secondFieldSort.value = 0;
    thirdFieldSort.value = 0;
    secondFieldSort.disabled = true;
    thirdFieldSort.disabled = true;
    
    document.getElementById('fieldsFirstDesc').checked = false;
    document.getElementById('fieldsSecondDesc').checked = false;
    document.getElementById('fieldsThirdDesc').checked = false;
}

// Применяем сортировку к текущей таблице
function applySortToCurrentTable() {
    if (!currentSortParams) return;
    
    let table = document.getElementById('table');
    let rowData = Array.from(table.rows);
    let header = rowData.shift();

    rowData.sort((first, second) => {
        for(let i in currentSortParams) {
            let key = currentSortParams[i].column;

            if(key === 2 || key === 4 || key === 5 || key === 6){
                let firstNum = Number(first.cells[key].innerHTML);
                let secondNum = Number(second.cells[key].innerHTML);
                if(firstNum > secondNum){
                    return !currentSortParams[i].order ? 1 : -1;
                } else if(firstNum < secondNum){
                    return !currentSortParams[i].order ? -1 : 1;
                }
            } else {
                if (first.cells[key].innerHTML > second.cells[key].innerHTML) {
                    return !currentSortParams[i].order ? 1 : -1;
                } else if (first.cells[key].innerHTML < second.cells[key].innerHTML){
                    return !currentSortParams[i].order ? -1 : 1;
                }
            }
        }
        return 0;
    });

    clearTable('table');
    rowData.unshift(header);
    rowData.forEach(row => table.append(row));
}

// Функция для получения текущих данных таблицы
function getCurrentTableData() {
    let table = document.getElementById('table');
    let rows = table.rows;
    let result = [];
    
    // Пропускаем заголовок 
    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].cells;
        result.push({
            name: cells[0].innerHTML,
            type: cells[1].innerHTML,
            year: parseInt(cells[2].innerHTML),
            country: cells[3].innerHTML,
            budget: parseInt(cells[4].innerHTML),
            floors: parseInt(cells[5].innerHTML),
            apartments: parseInt(cells[6].innerHTML)
        });
    }
    
    return result;
}

// Создание option для select
let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

// Инициализация select
let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for(let i in head) {
        sortSelect.append(createOption(head[i], Number(i)+1));
    }
};

// Инициализация всех select
let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName('select');
    for(let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if(j !== 0) {
            allSelect[j].disabled = true;
        }
    }
};

// Обработка изменения первого select
let changeNextSelect = (nextSelectId, curSelect) => {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.innerHTML = curSelect.innerHTML;
    if(curSelect.value != 0) {
        nextSelect.disabled = false;
        nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
        thirdFieldSort.disabled = true;
        thirdFieldSort.value = 0;
    }
};

// Обработка изменения второго select
let changeNextSelectSecond = (nextSelectId, beforeSelectValue, curSelect) => {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.innerHTML = curSelect.innerHTML;
    if(curSelect.value != 0) {
        nextSelect.disabled = false;
        nextSelect.remove(curSelect.value-1);
        nextSelect.remove(beforeSelectValue.value);
    } else {
        nextSelect.disabled = true;
    }
};