function getFilteredData(data){
    let values={}
    let outputData=[]

    //получает значения из полей формы
    values['name']=document.getElementById('name').value
    values['type']=document.getElementById('type').value
    values['country']=document.getElementById('country').value
    values['yearFrom']=document.getElementById('yearFrom').value
    values['yearTo']=document.getElementById('yearTo').value
    values['budget_ot']=document.getElementById('budget_ot').value
    values['budget_do']=document.getElementById('budget_do').value
    values['floors_ot']=document.getElementById('floors_ot').value
    values['floors_do']=document.getElementById('floors_do').value
    values['apartments_ot']=document.getElementById('apartments_ot').value
    values['apartments_do']=document.getElementById('apartments_do').value
    
    if(checkInputFields(values)){ //проверка ввода
        data.forEach(item => {
            let flagToInput=true //предполагаем объект проходит фильтрацию
            let checkedData={}
            //проверка всех критериев
            if(values.name!==''){
                if(item.name.indexOf(values.name)<0) flagToInput=false
            }
            if(values.type!==''){
                if(item.type.indexOf(values.type)<0) flagToInput=false
            }
            if(values.country!==''){
                if(item.country.indexOf(values.country)<0) flagToInput=false
            }
            if(values.yearFrom!==''){
                let yearFrom=Number(values.yearFrom)
                if(yearFrom>item.year) flagToInput=false
            }
            if(values.yearTo!==''){
                let yearTo=Number(values.yearTo)
                if(yearTo<item.year) flagToInput=false
            }
            if(values.budget_ot!==''){
                let budget_ot=Number(values.budget_ot)
                if(budget_ot>item.budget) flagToInput=false
            }
            if(values.budget_do!==''){
                let budget_do=Number(values.budget_do)
                if(budget_do<item.budget) flagToInput=false
            }
            if(values.floors_ot!==''){
                let floors_ot=Number(values.floors_ot)
                if(floors_ot>item.floors) flagToInput=false
            }
            if(values.floors_do!==''){
                let floors_do=Number(values.floors_do)
                if(floors_do<item.floors) flagToInput=false
            }
            if(values.apartments_ot!==''){
                let apartments_ot=Number(values.apartments_ot)
                if(apartments_ot>item.apartments) flagToInput=false
            }
            if(values.apartments_do!==''){
                let apartments_do=Number(values.apartments_do)
                if(apartments_do<item.apartments) flagToInput=false
            }
            if(flagToInput) outputData.push(item) //если прошел то в результат
        })
    }else{
        document.getElementById('errorFilter').innerHTML='Ошибка в фильтре значений'
    }
    return outputData
}

//корректность значений
function checkInputFields(values){
    //проверка текстовых полкй
    if(values.name!==""){
        if(typeof values.name !== 'string'){
        return false
        }
        values.name=values.name.trim()
    }
    if(values.type!==""){
        if(typeof values.type !=='string'){
            return false
        }
        values.type=values.type.trim()
    }
    if(values.country!==""){
        if(typeof values.country !=='string'){
            return false
        }
        values.country=values.country.trim()
    }
    //проверка числовых
    if(values.yearFrom!==""){
        if(!isNaN(values.yearFrom) && isFinite(values.yearFrom)){
            values.yearFrom=Number(values.yearFrom)
            if(!Number.isInteger(values.yearFrom)) return false
        } else{
            return false
        }
    }
    if(values.yearTo!==""){
        if(!isNaN(values.yearTo) && isFinite(values.yearTo)){
            values.yearTo=Number(values.yearTo)
            if(!Number.isInteger(values.yearTo)) return false
        } else{
            return false
        }
    }
    if(values.budget_ot!==""){
        if(!isNaN(values.budget_ot) && isFinite(values.budget_ot)){
            values.budget_ot=Number(values.budget_ot)
        } else{
            return false
        }
    }
    if(values.budget_do!==""){
        if(!isNaN(values.budget_do) && isFinite(values.budget_do)){
            values.budget_do=Number(values.budget_do)
        } else{
            return false
        }
    }
    if(values.floors_ot!==""){
        if(!isNaN(values.floors_ot) && isFinite(values.floors_ot)){
            values.floors_ot=Number(values.floors_ot)
        } else{
            return false
        }
    }
    if(values.floors_do!==""){
        if(!isNaN(values.floors_do) && isFinite(values.floors_do)){
            values.floors_do=Number(values.floors_do)
        } else{
            return false
        }
    }
    if(values.apartments_ot!==""){
        if(!isNaN(values.apartments_ot) && isFinite(values.apartments_ot)){
            values.apartments_ot=Number(values.apartments_ot)
        } else{
            return false
        }
    }
    if(values.apartments_do!==""){
        if(!isNaN(values.apartments_do) && isFinite(values.apartments_do)){
            values.apartments_do=Number(values.apartments_do)
        } else{
            return false
        }
    }
    return true
}