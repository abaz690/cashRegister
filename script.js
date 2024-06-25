let purchaseBtn = document.getElementById("purchase-btn");
let parseFloatInput = document.getElementById("cash");
let output = document.getElementById("change-due");
let cashBox= document.getElementById("change-box");
let totalPrice= document.getElementById("total-bill")
let price = 19.5;

totalPrice.innerText=`Total: $${price}`
let cid =[["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
let currencyUnits = {
     "PENNY" : 0.01 ,
     "NICKEL" : 0.05 ,
     "DIME" : 0.1 ,
     "QUARTER" : 0.25 ,
     "ONE" : 1 ,
     "FIVE" : 5 ,
     "TEN" : 10 ,
     "TWENTY" : 20 ,
     "ONE HUNDRED" : 100 
  };

let currencyCounts={};
let usedCurrencyCount={};
cid.forEach((elm)=>{
      currencyCounts[elm[0]] = Math.ceil(elm[1]/currencyUnits[elm[0]]) 
});
// console.log(currencyCounts)

window.onload = function() {
    cid.forEach((elm)=>cashBox.innerHTML+=`
    <p>${elm[0]}: $${elm[1]}</p>
    `)
};
const updatecashBoxText = () => {
    cashBox.innerHTML="";
    cid.forEach((elm)=>cashBox.innerHTML+=`
    <p>${elm[0]}:$${elm[1]}</p>
    `)
};
const calculateRemainingcid = ()=>{
    cid.forEach((elm)=>{
     if (usedCurrencyCount[elm[0]]){
        elm[1] = parseFloat((elm[1] - ( currencyUnits[elm[0]]*usedCurrencyCount[elm[0]])).toFixed(2));
     }
    });

};
const updateOutput=()=>{
    Object.keys(usedCurrencyCount).forEach((key)=>{
        if (usedCurrencyCount[key]>0){
        output.innerHTML+=`
        <p>${key}: $${usedCurrencyCount[key]*currencyUnits[key]}</p>
        `
        }
    });
}
const calculateCount = (amount, crr) => {
    return Math.floor(amount/crr);
};
const calculateChange = () => {
    let res=0;
    let newCount = 0;
    let amount = parseFloat((parseFloat(parseFloatInput.value,10) - price).toFixed(2));

    if (amount<0){
        alert('Customer does not have enough money to purchase the item')
    }
    else if(amount == 0){
        output.innerText="No change due - customer paid with exact cash";
        output.classList.remove("hide");
    }
    else{
        Object.keys(currencyUnits).reverse().forEach((key)=>{
            
            if(amount >= currencyUnits[key]){
                
            res = parseFloat((amount - (currencyUnits[key]*currencyCounts[key])).toFixed(2));
        
            if (res>=0){
                usedCurrencyCount[key] = currencyCounts[key];
                currencyCounts[key] = 0;
                amount=res;
            }
            
            else if(res<0){
                newCount =calculateCount(amount,currencyUnits[key]);
            
                res = (amount - (currencyUnits[key]*newCount)).toFixed(2);
                currencyCounts[key]-=newCount;
                usedCurrencyCount[key]=newCount;
                amount=res;
            }
        }
        });
        calculateRemainingcid();
        updatecashBoxText();
        if (amount>0){
            output.innerHTML="";
            output.innerHTML+=`<p>Status: INSUFFICIENT_FUNDS</p>`;
            output.classList.remove("hide");
        }
        
        else if (amount==0 && !(cid.every(([currency, amount]) => amount === 0))){
            output.innerHTML="";
            output.innerHTML+=`<p>Status: OPEN</p>`;
            updateOutput();
            output.classList.remove("hide");
        }
        else if (cid.every(([currency, amount]) => amount === 0)){
            output.innerHTML="";
            output.innerHTML+=`<p>Status: CLOSED</p>`;
            updateOutput();
            output.classList.remove("hide");
        }
        
    }
    usedCurrencyCount={};
};  
purchaseBtn.addEventListener("click", calculateChange );

