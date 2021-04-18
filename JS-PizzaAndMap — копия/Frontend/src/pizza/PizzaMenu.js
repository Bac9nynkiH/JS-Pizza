/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
const API = require("../API");
var Pizza_List = API.getPizzaList(initPizzaList);

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find("#buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find("#buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }
    $("#allPizzas").html(list.length);
    list.forEach(showOnePizza);
}
$("body").find(".typeOfPizza").find("input").change(function(){
    filterPizza(this);
});


function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    var idOption = $(filter).attr('id');
    Pizza_List.forEach(function(pizza){
        switch (idOption){
            case 'option1':
                pizza_shown.push(pizza);
                break;
            case 'option2':
                if (pizza.content.meat !== undefined){
                    pizza_shown.push(pizza);
                }
                break;
            case 'option3':
                if (pizza.content.pineapple !== undefined){
                    pizza_shown.push(pizza);
                }
                break;
            case 'option4':
                if (pizza.content.mushroom !== undefined){
                    pizza_shown.push(pizza);
                }
                break;
            case 'option5':
                if (pizza.content.ocean !== undefined){
                    pizza_shown.push(pizza);
                }
                break;
            case 'option6':
                if (pizza.content.ocean === undefined && pizza.content.meat === undefined){
                    pizza_shown.push(pizza);
                }
                break;
        }
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    API.getPizzaList(initPizzaList);
}

function initPizzaList(error, data) {
    if (error == null) {
        Pizza_List = data;
        showPizzaList(Pizza_List);

    }
}

function sendToBack(error, data) {
    let receipt_details = data;
    console.log('receipt_details');
    console.log(receipt_details);
    if (!error) {
        LiqPayCheckout.init({
            data:	receipt_details.data,
            signature:	receipt_details.signature,
            embedTo:	"#liqpay",
            mode:	"popup"	//	embed	||	popup
        }).on("liqpay.callback",	function(data){
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready",	function(data){
//	ready
        }).on("liqpay.close",	function(data){
//	close
        });
    }
    else{
        console.log('some error');
    }
}
$("#exampleInputName1").keyup(function(){
    if (this.value.length >= 6){
        $("#name").css("color","green");
        $("#nameError").text("");
        document.getElementById("submit-order").disabled = false;

    } else {
        $("#name").css("color","red");
        $("#nameError").text("Здається, ви ввели неправильне ім'я");
        $("#nameError").css("color","red");
        document.getElementById("submit-order").disabled = true;


    }
});

$("#exampleInputPhone1").keyup(function(){
    if (!this.value.match("^([0|\\+[0-9]{1,9})?([7-9][0-9]{9}[0-9])$")){
        $("#phone").css("color","red");
        $("#phoneError").text("Упс... Здається, ви ввели неправильний номер телефону");
        $("#phoneError").css("color","red");

        document.getElementById("submit-order").disabled = true;

    }
    else {
        $("#phone").css("color","green");
        $("#phoneError").text("");
        document.getElementById("submit-order").disabled = false;

    }
});
$("#exampleInputAddress1").keyup(function(){
    if (this.value.length >= 4){
        $("#address").css("color","green");
        $("#addressError").text("");

        document.getElementById("submit-order").disabled = false;

    } else {
        $("#address").css("color","red");
        $("#addressError").text("Ну хоч тут введіть все правильно");
        $("#addressError").css("color","red");

        document.getElementById("submit-order").disabled = true;
    }
});

$("#submit-order").click(function () {
    var phoneNumber = $("#exampleInputPhone1").val();
    var login = $("#exampleInputName1").val();
    var address = $("#exampleInputAddress1").val();
    if (phoneNumber === "" || login === "" || address === "") {
        console.log("//////////////////////////////////");
        return;
    }


    var pizza = [];
    PizzaCart.getPizzaInCart().forEach(element =>
        pizza.push(element));
    var order_info = {
        phoneNumber: phoneNumber,
        login: login,
        address: address,
        pizzas: pizza
    }
    console.log('pizza');
    console.log(pizza);
    API.createOrder(order_info, sendToBack);
});


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;