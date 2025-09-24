import {
    Directive,
    ElementRef,
    HostListener,
    forwardRef
  } from '@angular/core';
  import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
  
  @Directive({
    selector: '[appPhoneFormatter]',
    standalone: true,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneFormatterDirective),
      multi: true
    }]
  })
  export class PhoneFormatterDirective implements ControlValueAccessor {
    private onChange = (value: any) => {};
    private onTouched = () => {};
  
    constructor(private el: ElementRef<HTMLInputElement>) {}
  
    @HostListener('input', ['$event'])
    onInput(event: InputEvent) {
    const input = this.el.nativeElement;
    const rawInput = input.value;
    const cursor = input.selectionStart ?? rawInput.length;

    const digitsOnly = rawInput.replace(/\D/g, '').slice(0, 10);
    const digitIndex = this.getDigitIndex(rawInput, cursor);
    const formatted = this.formatPhone(digitsOnly);

    if (rawInput === formatted) return;

    const newCursor = this.getCursorFromDigitIndex(formatted, digitIndex);
    input.value = formatted;
    this.onChange(digitsOnly);

    setTimeout(() => {
        input.setSelectionRange(newCursor, newCursor);
    });
    }

  
    @HostListener('blur')
    onBlur() {
      this.onTouched();
    }
    
  
    writeValue(value: string): void {
      const formatted = this.formatPhone(value || '');
      this.el.nativeElement.value = formatted;
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    private formatPhone(digits: string): string {
        const d = digits.replace(/\D/g, '').slice(0, 10);
        const len = d.length;
      
        if (len === 0) return '';
        if (len <= 3) return d;
        if (len <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      }
      
  
    private getDigitIndex(str: string, cursor: number): number {
      let count = 0;
      for (let i = 0; i < cursor; i++) {
        if (/\d/.test(str[i])) count++;
      }
      return count;
    }
  
    private getCursorFromDigitIndex(str: string, digitIndex: number): number {
      let count = 0;
      for (let i = 0; i < str.length; i++) {
        if (/\d/.test(str[i])) {
          if (count === digitIndex) return i;
          count++;
        }
      }
      return str.length;
    }
  }
  