import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Mikro16Compiler';

  text:string;
  output:string;
  freeRegisters = [
    "R6",
    "R7",
    "R8",
    "R9",
    "R10"
  ]

  test = (~(-10)).toString(2)

  parseText(input:string){
    let resultString = "";
    let splitInput = input.split('\n');
    for(let i = 0; i < splitInput.length; i++){
      let line = splitInput[i].trim();
      if(line.startsWith("if")){
        /*
        if <register1> <operator> <register2> : <goto>
        */

        let args = line.split(' ');
        resultString += this.compare(args[1], args[3], args[2], args[5])
      }else if(line.startsWith("while")){
        /*
        while <register1> [==,<,<=,>,>=,!=] <register2>{
          <content>
        }
        */
       let args = line.split(' ');
       let content = "";
       
       // Search for content
       let nestedBrackets = 0;
       for(i=i+1; nestedBrackets >= 0; i++){
        let line = splitInput[i].trim();
         if(line.includes("{")){
          nestedBrackets++;
          content += line+"\n"
         }else if(line.includes("}")){
          nestedBrackets--
         }else{
          content += line+"\n"
         }
       }

       
       resultString += this.whileLoop(args[1], args[3], args[2], content);
        
      }else if(line.includes('=')){
        /*
        <register> = <number>;
        */

        // TODO: Implement assigning value of register
       let args = line.replace(' ', '').split('=');
       resultString += this.assignValue(args[0], parseInt(args[1]));
      }else{
        resultString += line+"\n"
      }

    }

    this.output = resultString;
    return resultString
  }

  calculate(registerLocation, register1, register2, operator):string{
    let resultString = "";
    let tempRegister = this.freeRegisters.pop();

    switch(operator){
      case "+":
        resultString += `${registerLocation} <- ${register1} + ${register2}`
        break;
      case "-":
        resultString += `${tempRegister} <- ~${register2}\n`
        resultString += `${registerLocation} <- ${register1} + ${tempRegister}`
        break;
      case "*":
        break;
      case "/":
        break;
      case "^":
        break;
    }

    this.freeRegisters.push(tempRegister);
    return resultString;
  }
  
  assignValue(register: string, value:number):string{
    let valueString;
    let resultString = `${register} <- 0\n`;
    if(value > 0){
      valueString = value.toString(2);

    }else if(value < 0){
      // TODO: implement assignment of negative numbers
      valueString = this.assignValue(register, Math.abs(value)) ;
      valueString += `${register} <- ~${register}\n`
      valueString += `${register} <- ${register}+1\n`
      return valueString;
    }else {
      return `${register} <- 0`;  
    }

    for(let i = 0; i < valueString.length; i++){
      if(valueString[i] == 0 && i < valueString.length -1 && valueString[i+1] == 0){
        resultString += `${register} <- lsh(${register} + ${register})\n`;
        i++;
      }else if(valueString[i] == 0){
        resultString += `${register} <- lsh(${register})\n`;
      }else if(valueString[i] == 1){
        resultString += `${register} <- lsh(${register})\n`;
        resultString += `${register} <- ${register}+1\n`;
      }
    }
    this.output = resultString;
    return resultString;
  }

  compare(register1:string, register2:string, operator:string, goto:string):string{
    let tempRegister = this.freeRegisters.pop();
    let resultString = "";
    
    switch(operator){
      case "<":
        let temp = register2
        register2 = register1
        register1 = temp;
      case ">":
        resultString += `${tempRegister} <- ~${register1}\n`
        resultString += `${register2} + ${register1}; if N goto .${goto}\n`;
        break;
      case "==":
        resultString += `${tempRegister} <- ~${register1}\n`
        resultString += `${register2} + ${register1}; if Z goto .${goto}\n`;
        break;
    }

    
    this.freeRegisters.push(tempRegister);
    return resultString;
  }

  loopCounter = 0;
  whileLoop(register1:string, register2:string, operator:string, content:string):string{
    let loopCounter = this.loopCounter;
    loopCounter++;
    let resultString = `:while${loopCounter}\n`
    resultString += this.compare(register1, register2, operator, `while${loopCounter}`)
    
    console.log(content)
    resultString += this.parseText(content);

    resultString += `:endWhile${loopCounter}\n`

    return resultString;
  }

  forLoop(){

  }


}
