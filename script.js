"use strict";
$(document).ready(function(){
    let cnt = 0;
    let expressionMemory;
    let ans;

    if(localStorage.getItem("EXP")){
        expressionMemory = JSON.parse(localStorage.getItem("EXP"));

    }
    else{
        expressionMemory = { array: [] };
    }
    if(localStorage.getItem("ANS")){
        ans = localStorage.getItem("ANS");
    }
    else{
        ans = 0;
        localStorage.setItem("ANS", 0);
    }

    let expressionIsEvaluated = true;
    let getEqv = (selector) => $(selector).attr("data-equiv");
    let getAnswer = () =>$("#answer").val();
    let getExpression = () => $("#expressions").val();

    let inputLiteral = (selector) => {
        if(expressionIsEvaluated == true){ //replaces the evaluated expressions
            $("#expressions").val(function(i, expressions){
                return getEqv(selector);
            });
            expressionIsEvaluated = false;
        }
        else{
            $("#expressions").val(function(i, expressions){
                return expressions + getEqv(selector);
            });
        }
    };
    let inputOperation = (selector) => {
        if(expressionIsEvaluated == true){
            $("#expressions").val(function(i, expressions){
                return $("#answer").val() + getEqv(selector)
            });
            expressionIsEvaluated = false;
        }
        else{
            $("#expressions").val(function(i, expressions){
                return expressions + getEqv(selector)
            });
        }
    };

    let inputGrouping = selector => {
        if(expressionIsEvaluated == true){
            $("#expressions").val(function(i, expressions){
                return getEqv(selector)
            });
            expressionIsEvaluated = false;
        }
        else{
            $("#expressions").val(function(i, expressions){
                return expressions + getEqv(selector)
            });
        }
    }

    let parseExpression = () => {
        let expression = getExpression().toLowerCase();
        if(expression == ""){
            return 0;
        }
        else{
            let parsed = expression.replace(/\d+/g, function(number){
                return parseInt(number, 10);
            });
            ans = localStorage.getItem("ANS");
            parsed = parsed.replace(/\^/g, "**");
            parsed = parsed.replace(/×/g, "*");
            parsed = parsed.replace(/÷/g, "/");
            parsed = parsed.replace(/sqrt\(/g, "Math.sqrt(" );
            parsed = parsed.replace(/cos\(/g, "Math.cos(" );
            parsed = parsed.replace(/sin\(/g, "Math.sin(" );
            parsed = parsed.replace(/tan\(/g, "Math.tan(" );
            parsed = parsed.replace(/ANS/g, ans);
            return parsed;
        }
    }

    let evalExpression = () =>{
        $("#answer").fadeOut(0.5);
        let exp = parseExpression();

        try{
            $("#answer").fadeIn(500).val(eval(exp));
            localStorage.setItem("ANS", eval(exp));
            expressionMemory.array.unshift(getExpression());
            localStorage.setItem("EXP", JSON.stringify(expressionMemory));
        }
        catch(err){
            expressionMemory.array.unshift(getExpression());
            localStorage.setItem("EXP", JSON.stringify(expressionMemory));
            $("#expressions").val("Syntax Error");
            $("#answer").val("");
        }

        cnt = 0;
        expressionIsEvaluated = true;
    }

    // //LITERALS
    $("#zero").click(function(){ inputLiteral("#zero"); });
    $("#one").click(function(){ inputLiteral("#one"); });
    $("#two").click(function(){ inputLiteral("#two"); });
    $("#three").click(function(){ inputLiteral("#three"); });
    $("#four").click(function(){ inputLiteral("#four"); });
    $("#five").click(function(){ inputLiteral("#five"); });
    $("#six").click(function(){ inputLiteral("#six"); });
    $("#seven").click(function(){ inputLiteral("#seven"); });
    $("#eight").click(function(){ inputLiteral("#eight"); });
    $("#nine").click(function(){ inputLiteral("#nine"); });
    //
    // //OPERATIONS
    $("#plus").click(function(){ inputOperation("#plus"); });
    $("#minus").click(function(){ inputOperation("#minus"); });
    $("#times").click(function(){ inputOperation("#times"); });
    $("#divide").click(function(){ inputOperation("#divide"); });
    $("#point").click(function(){ inputOperation("#point"); });
    $("#exponent").click(function(){ inputOperation("#exponent"); });
    $("#sqrt").click(function(){ inputGrouping("#sqrt"); });
    $("#cos").click(function(){ inputGrouping("#cos"); });
    $("#sin").click(function(){ inputGrouping("#sin"); });
    $("#tan").click(function(){ inputGrouping("#tan"); });
    $("#open-parenthesis").click(function(){ inputGrouping("#open-parenthesis"); });
    $("#close-parenthesis").click(function(){ inputGrouping("#close-parenthesis"); });

    $("#equals").click(function(){ evalExpression()});

    $("#delete").click(function(){
        $("#expressions").val(function(i, expressions){
            return expressions.slice(0, expressions.length-1);
        });
        cnt = 0;
    });

    $("#ans").click(function(){
        $("#expressions").val(function(i, expressions){
            return "ANS";
        });
        expressionIsEvaluated = false;
    });

    $("#clear").click(function(){
        $("#expressions").val(function(i, expressions){
            return "";
        });
        $("#answer").val(function(i, expressions){
            return "0";
        });
        cnt = 0;
    });

    //CALCULATOR MEMORY
    let prevExpression = () => {
        if(cnt < expressionMemory.array.length-1){
            $("#expressions").val(expressionMemory.array[cnt++]);
        }
        else{
            $("#expressions").val(expressionMemory.array[cnt]);
        }

    };
    let nextExpression = () => {
        if(cnt > 0){
            $("#expressions").val(expressionMemory.array[--cnt]);
        }
        else{
            $("#expressions").val("");
        }
    };

    $("body").keydown(function (e){
        switch(e.which){
            case 13: //ENTER
                evalExpression();
                break;
            case 38: //KEYUP
                prevExpression();
                break;
            case 40: //KEYDOWN
                nextExpression();
                break;
            default:
                return
        }
        e.preventDefault()
    });
});
