import { Component, ApplicationRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SyntaxDialogComponent } from './syntax-dialog/syntax-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Mikro16Compiler';

  defaultText?: string;

  editorOptions = {
    automaticLayout: true,
    theme: 'Micro16Theme',
    language: 'Micro16',
  };

  preCompile: string = ""

  postCompile: string = ""

  freeRegisters = ['R0', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10'];

  ifCount = 1;
  calcCount = 1;
  loopCounter = 1;

  constructor(private app: ApplicationRef, private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.preCompile = <string> localStorage.getItem("code");
    this.http
      .get('assets/startercode.txt', { responseType: 'text' })
      .subscribe((data) => {
        this.defaultText = data;
        if(!this.preCompile){
          this.preCompile = this.defaultText
        }
        this.compile();
      });
  }

  showSyntax(): void {
    const dialogRef = this.dialog.open(SyntaxDialogComponent, {
      data: {text: this.defaultText},
      width: "75vw",
      height: "75vh"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
    });
  }

  setRegister(register: string, checked: boolean) {
    if(checked){
      this.freeRegisters.push(register)
    }else{
      this.freeRegisters.splice(this.freeRegisters.indexOf(register), 1);
    }

  }

  initEditor(editor:any) {
    editor.onDidChangeContent(()=>{
      localStorage.setItem("code", this.preCompile);
    })
  }

  compile() {
    this.ifCount = 1;
    this.loopCounter = 1;
    this.postCompile = this.parseText(this.preCompile);
  }

  parseText(input: string) {
    let resultString = '';
    let splitInput = input.split('\n');
    for (let i = 0; i < splitInput.length; i++) {
      let line = splitInput[i].trim();
      if (line.startsWith('#')) {
        resultString += line + '\n';
      } else if (line.startsWith('if')) {
        /*
        if <register1> <operator> <register2>{

        }
        */

        line = line
          .replace(/\s/g, '')
          .replace('{', '')
          .substring(2, line.length);
        let operands = line.split(/[<>=]+/g);
        let operator = line.replace(/[^<>=]+/g, '');

        //Check if registers or numbers are compared
        let validInput1 = this.validateInput(operands[0]);
        let validInput2 = this.validateInput(operands[1]);
        resultString += validInput1.setup + validInput2.setup;

        // Search for content
        let content = this.getContent(splitInput, i + 1);
        i += content.end - i;

        let ifCount = this.ifCount;
        this.ifCount++;

        resultString += this.compare(
          validInput1.register,
          validInput2.register,
          operator,
          `then${ifCount}`
        );
        resultString += `goto .endThen${ifCount}\n`;
        resultString += `:then${ifCount}\n`;
        resultString += this.parseText(content.text);
        resultString += `:endThen${ifCount}\n`;

        // Release Temporary registers
        if (validInput1.setup.length > 0) {
          this.freeRegisters.push(validInput1.register);
        }
        if (validInput2.setup.length > 0) {
          this.freeRegisters.push(validInput2.register);
        }
      } else if (line.startsWith('while')) {
        /*
        while <register1> [==,<,<=,>,>=,!=] <register2>{
          <content>
        }
        */
        line = line
          .replace(/\s/g, '')
          .replace('{', '')
          .substring(5, line.length);
        let operands = line.split(/[<>=]+/g);
        let operator = line.replace(/[^<>=]+/g, '');

        // Search for content
        let content = this.getContent(splitInput, i + 1);
        i += content.end - i;

        //Check if registers or numbers are compared
        let validInput1 = this.validateInput(operands[0]);
        let validInput2 = this.validateInput(operands[1]);
        resultString += validInput1.setup + validInput2.setup;

        resultString += this.whileLoop(
          validInput1.register,
          validInput2.register,
          operator,
          content.text
        );

        // Release Temporary registers
        if (validInput1.setup.length > 0) {
          this.freeRegisters.push(validInput1.register);
        }
        if (validInput2.setup.length > 0) {
          this.freeRegisters.push(validInput2.register);
        }
      } else if (line.includes('=')) {
        /*
        <register> = <number>;
        */

        // TODO: Implement assigning value of register
        let args = line.replace(/\s/g, '').split('=');
        let assignee = args[0];
        let operands = args[1].split(/[+\-*\/^]/g);
        let operator = line.replace(/[^+\-*\/^]+/g, '');
        if (operands[0] == '') {
          operands.shift();
        }

        if (operands.length > 1) {
          // Calculate

          // Check if registers or numbers are compared
          let validInput1 = this.validateInput(operands[0]);
          let validInput2 = this.validateInput(operands[1]);
          resultString += validInput1.setup + validInput2.setup;

          resultString += this.calculate(
            assignee,
            validInput1.register,
            validInput2.register,
            operator
          );

          // Release Temporary registers
          if (validInput1.setup.length > 0) {
            this.freeRegisters.push(validInput1.register);
          }
          if (validInput2.setup.length > 0) {
            this.freeRegisters.push(validInput2.register);
          }
        } else {
          // Assign
          resultString += this.assignValue(assignee, parseInt(args[1]));
        }
      } else {
        resultString += line + '\n';
      }
    }

    return resultString;
  }

  calculate(registerLocation: string, register1: string, register2: string, operator: string): string {
    let resultString = '';
    let tempRegister = <string> this.freeRegisters.pop();

    switch (operator) {
      case '+':
        resultString += `${registerLocation} <- ${register1} + ${register2}\n`;
        break;
      case '-':
        resultString += `${tempRegister} <- ~${register2}\n`;
        resultString += `${tempRegister} <- ${tempRegister} + 1\n`;
        resultString += `${registerLocation} <- ${register1} + ${tempRegister}\n`;
        break;
      case '*':
        let calcCount = this.calcCount
        this.calcCount++
        resultString += `${register1}; if Z goto .calcZero${calcCount}`
        resultString += `${register2}; if Z goto .calcZero${calcCount}`
        resultString += `${register1}; if N goto .calcNegative${calcCount}`
        resultString += `goto .end`
        resultString += `:calcNegative`
        resultString += `${register2}; if N goto .calcEnd${calcCount}`
        resultString += ``
        resultString += ``
        resultString += ``
        resultString += ``
        resultString += ``
        resultString += ``
        resultString += ``

        resultString += ``
        resultString += ``
        resultString += `goto .end`
        resultString += `:calcZero;`
        resultString += `${registerLocation} <- 0`
        resultString += `:end`

        break;
      case '/':
        break;
      case '^':
        break;
    }

    this.freeRegisters.push(tempRegister);
    return resultString;
  }

  assignValue(register: string, value: number): string {
    let valueString;
    let resultString = `${register} <- 0\n`;
    if (value > 0) {
      valueString = value.toString(2);
    } else if (value < 0) {
      // TODO: implement assignment of negative numbers
      valueString = this.assignValue(register, Math.abs(value));
      valueString += `${register} <- ~${register}\n`;
      valueString += `${register} <- ${register}+1\n`;
      return valueString;
    } else {
      return `${register} <- 0`;
    }

    for (let i = 0; i < valueString.length; i++) {
      if (
        valueString[i] == '0' &&
        i < valueString.length - 1 &&
        valueString[i + 1] == '0'
      ) {
        resultString += `${register} <- lsh(${register} + ${register})\n`;
        i++;
      } else if (valueString[i] == '0') {
        resultString += `${register} <- lsh(${register})\n`;
      } else if (valueString[i] == '1') {
        resultString += `${register} <- lsh(${register})\n`;
        resultString += `${register} <- ${register}+1\n`;
      }
    }
    return resultString;
  }

  compare(
    register1: string,
    register2: string,
    operator: string,
    goto: string
  ): string {
    let resultString = '';

    switch (operator) {
      case '<': {
        return this.compare(register2, register1, '>', goto)
      }
      case '>': {
        let tempRegister = this.freeRegisters.pop();
        resultString += `${tempRegister} <- ~${register1}\n`;
        resultString += `${tempRegister} <- ${tempRegister} + 1\n`;
        resultString += `${register2} + ${tempRegister}; if N goto .${goto}\n`;
        this.freeRegisters.push(<string> tempRegister);
        break;
      }
      case '==': {
        let tempRegister = this.freeRegisters.pop();
        resultString += `${tempRegister} <- ~${register1}\n`;
        resultString += `${tempRegister} <- ${tempRegister} + 1\n`;
        resultString += `${register2} + ${tempRegister}; if Z goto .${goto}\n`;
        this.freeRegisters.push(<string> tempRegister);
        break;
      }
      case '<=': {
        resultString += this.compare(register1, register2, '<', goto);
        resultString += this.compare(register1, register2, '==', goto);
        break;
      }
      case '>=': {
        resultString += this.compare(register1, register2, '>', goto);
        resultString += this.compare(register1, register2, '==', goto);
        break;
      }
      case '!=': {
        let tempRegister = this.freeRegisters.pop();
        resultString += `${tempRegister} <- ~${register1}\n`;
        resultString += `${tempRegister} <- ${tempRegister} + 1\n`;
        resultString += `${register2} + ${tempRegister}; if N goto .${goto}\n`;
        resultString += `${tempRegister} <- ~${register2}\n`;
        resultString += `${tempRegister} <- ${tempRegister} + 1\n`;
        resultString += `${register1} + ${tempRegister}; if N goto .${goto}\n`;
        this.freeRegisters.push(<string> tempRegister);
        break;
      }
    }

    return resultString;
  }

  whileLoop(
    register1: string,
    register2: string,
    operator: string,
    content: string
  ): string {
    let loopCounter = this.loopCounter;
    this.loopCounter++;
    let resultString = `:while${loopCounter}\n`;
    resultString += this.compare(
      register1,
      register2,
      this.getInverseOperation(operator),
      `endWhile${loopCounter}`
    );

    resultString += this.parseText(content);

    resultString += `goto .while${loopCounter}\n`;
    resultString += `:endWhile${loopCounter}\n`;

    return resultString;
  }

  forLoop() {}

  getContent(
    splitText: string[],
    start: number
  ): { text: string; end: number } {
    let content = '';
    let i = start;
    let nestedBrackets = 0;

    for (i; nestedBrackets >= 0; i++) {
      let line = splitText[i].trim();
      if (line.includes('{')) {
        nestedBrackets++;
        content += line + '\n';
      } else if (line.includes('}')) {
        nestedBrackets--;
        if (nestedBrackets >= 0) {
          content += line + '\n';
        }
      } else {
        content += line + '\n';
      }
    }

    return {
      text: content,
      end: i - 1,
    };
  }

  validateInput(input: any): { register: string; setup: string } {
    let register: string;
    let setup: string;

    if (isNaN(input)) {
      register = input;
      setup = '';
    } else {
      register = <string> this.freeRegisters.pop();
      setup = this.assignValue(register, parseInt(input));
    }

    return {
      register: register,
      setup: setup,
    };
  }

  getInverseOperation(operator: string): string {
    switch (operator) {
      case '<':
        return '>=';
      case '>':
        return '<=';
      case '>=':
        return '<';
      case '<=':
        return '>';
      case '==':
        return '!=';
      case '!=':
        return '==';
      default:
        return '';
    }
  }
}
