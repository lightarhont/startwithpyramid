//Функционатор: выполняет все функции по списку в массиве если они там есть
var funcs = (function(funcarr){
        
        if (funcarr.length != 0)
        {
            for (var i = 0; i < funcarr.length; i++)
            {
                if (funcarr[i] instanceof Array) {
                        var arr = funcarr[i]
                        var func = arr[0];
                        var param = arr[1];
                        func(param);
                }
                else
                {
                        funcarr[i]();
                }
            }
        }
}); 