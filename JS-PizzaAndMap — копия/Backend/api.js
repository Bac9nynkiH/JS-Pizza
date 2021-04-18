/**
 * Created by chaika on 09.02.16.
 */

const PUBLIC_KEY = 'sandbox_i92197953769';
const PRIVATE_KEY = 'sandbox_e4zCdTQrK15rQNwJponDUuzPTaEao4w2ChDVrq4l';


var Pizza_List = require('./data/Pizza_List');
exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

var crypto	= require('crypto');
function sha1(string)	{
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}
function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
}


exports.createOrder = function(req, res) {
    var order_info = req.body;

    function calculateTotalSum(order_info) {
        let pizzas = order_info.pizzas;
        let sum = 0;
        for (let i = 0; i < pizzas.length;i++){
            if (pizzas[i].size === 'big_size'){
                sum += pizzas[i].pizza.big_size.price * pizzas[i].quantity;
            }
            else{
                sum += pizzas[i].pizza.small_size.price * pizzas[i].quantity;
            }
        }
        return sum;
    }
    function parse_order_info(order_info) {
        let str = '';
        let pizzas = order_info.pizzas;
        str += order_info.login + ", " + order_info.phoneNumber + ", " + order_info.address + "\n";
        for (let i = 0; i < pizzas.length;i++){
            str += pizzas[i].pizza.title + " - " + pizzas[i].size + "\n";
        }
        return str;
    }

    let sum = calculateTotalSum(order_info);
    let parse_order = parse_order_info(order_info);
    console.log(sum);
    console.log(parse_order);
    var order	=	{
        version:	3,
        public_key:	PUBLIC_KEY,
        action:	"pay",
        amount:	sum,
        currency:	"UAH",
        description:parse_order,
        order_id:	Math.random(),
//!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox:	1
    };
    var data	=	base64(JSON.stringify(order));
    var signature	=	sha1(PRIVATE_KEY + data + PRIVATE_KEY);
    var receipt = {
        data: data,
        signature: signature
    }
    res.send(receipt);
};