//массив параметров сотрировки
let createSortArr = (data) => {
    let sortArr = [];
    let sortSelects = data.getElementsByTagName('select'); //получает все селекты

    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked; //направление сорта
        sortArr.push(
            {column: keySort - 1,
                order: desc} //по убывнию?
        );
    }
    return sortArr;
};

//сортирует таблу
let sortTable = (idTable, data) => {

    let sortArr = createSortArr(data); //параметры сортировки

    if (sortArr.length === 0) {
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows); //все строки таблицы
    let header = rowData.shift(); //отделить заголовок

    //сорт строк
    rowData.sort((first, second) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;

            //для числовых
            if(key===2 || key===4 || key===5 || key===6){
                let firstNum=Number(first.cells[key].innerHTML)
                let secondNum=Number(second.cells[key].innerHTML)
                if(firstNum > secondNum){
                    return !sortArr[i].order ? 1:-1
                } else if(firstNum < secondNum){
                    return !sortArr[i].order ? -1: 1
                }

                //для текстовых
            }else{
            if (first.cells[key].innerHTML > second.cells[key].innerHTML) {
                return !sortArr[i].order ? 1 : -1;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML){
                return !sortArr[i].order ? -1 : 1;
            }
            }
        }
        return 0;
    });

    //обновляем таблу
    clearTable(idTable);
    rowData.unshift(header);
    rowData.forEach(row => table.append(row));
}