import {
  Component,
  OnInit,
  Input,
  Output,
  forwardRef,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-write-comment',
  template: `
    <mat-form-field style="width: 100%">
      <mat-label> Deja tu comentario </mat-label>
      <textarea
        [(ngModel)]="inputValue"
        name="inputValue"
        matInput
        (input)="eventWriteComment($event)"
        (Keyup.enter)="handleSubmit()"
        cols="30"
        rows="3"
      >
      </textarea>
      <emoji-mart
        *ngIf="visiblePickerIcon"
        [style]="{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 5
        }"
        (emojiClick)="emogiClick($event)"
      ></emoji-mart>

      <mat-hint align="end">
        {{ inputValue?.length }} / {{ MAX_LENGHT }}
      </mat-hint>
    </mat-form-field>
    <nz-form-item>
      <button
        nz-button
        nzType="primary"
        (click)="handleSubmit()"
        [hidden]="inputValue.length == 0"
      >
        comentar
      </button>
      <!-- <ul class="bars">
        <a (click)="visiblePickerIcon = !visiblePickerIcon">
          <i class="far fa-smile-beam icon"></i>
        </a>
      </ul> -->
    </nz-form-item>
  `,
  styles: [``],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BoxwriteCommentComponent),
      multi: true
    }
  ]
})
export class BoxwriteCommentComponent implements OnInit, ControlValueAccessor {
  inputValue: string = '';
  private onChangue: (data: string) => void;
  private onTouch: () => void;
  visiblePickerIcon = false;
  public MAX_LENGHT = 150;
  @Output() onComment = new EventEmitter<string>();

  constructor(private detection: ChangeDetectorRef) {}
  writeValue(defaultValue: string): void {
    if (defaultValue?.length) {
      this.inputValue = defaultValue;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {}
  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public handleSubmit(): void {
    if (this.inputValue.length > 1) {
      this.onComment.emit(this.inputValue);
      this.inputValue = '';
    }
  }
  eventWriteComment($event: InputEvent) {
    if (this.inputValue.length >= this.MAX_LENGHT || $event.data === null) {
      ($event.target as HTMLTextAreaElement).value = this.inputValue.substr(
        0,
        this.inputValue.length - 1
      );
    }
  }

  /*=============================================
=            Events Emit            =
=============================================*/

  emogiClick({ emoji }) {
    this.inputValue += emoji.native;
    this.visiblePickerIcon = false;
  }
}
